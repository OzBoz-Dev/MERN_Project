import 'package:chip_in/models/conversation.dart';
import 'package:chip_in/models/message.dart';
import 'package:chip_in/providers/auth_provider.dart';
import 'package:chip_in/services/messages_service.dart';
import 'package:chip_in/services/socket_service.dart';
import 'package:flutter/material.dart';

class ConversationProvider with ChangeNotifier {
  final AuthProvider authProvider;
  final SocketService socketService;
  ConversationProvider({required this.authProvider, required this.socketService});

  // State
  bool _isLoading = false;
  bool _hasLoaded = false;
  String? _error;
  String? _activeConversationId;

  // Maps convo ids to their conversation
  Map<String, Conversation> _conversations = {};

  // Getters
  bool get isLoading => _isLoading;
  bool get hasLoaded => _hasLoaded;
  String? get error => _error;
  String? get activeConversationId => _activeConversationId;
  List<Conversation> get conversations => _conversations.values.toList();
  Conversation? getConversationById(String id) => _conversations[id];

  // Service
  final messagesService = MessagesService();

  // Fetch conversations from service
  Future<void> getConversations() async {
    _isLoading = true;
    _hasLoaded = false;
    _error = null;
    notifyListeners();

    try {
      final fetchedConversations = await messagesService.getConversations(authProvider.token!);
      for(Conversation conversation in fetchedConversations) {
        _conversations[conversation.id] = conversation;
      }
      _hasLoaded = true;
    }
    catch(e) {
      _error = e.toString().replaceFirst("Exception: ", "");
      _conversations = {};
    }
    finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Sets the active conversation
  void setActiveConversation(String id) {
    _activeConversationId = id;
    joinConversation(id);
  }

  // Chat with sockets
  void initSocket() {
    socketService.connect(authProvider.token!);

    socketService.onNewMessage((data) {
      final message = Message(
        id: data['_id'],
        authorUsername: data['author_username'],
        content: data['content'],
        createdAt: DateTime.parse(data['createdAt']).toLocal(),
      );

      final convoId = _activeConversationId;
      if (convoId == null) return;

      final convo = _conversations[convoId];
      if (convo == null) return;

      convo.messages.add(message);
      notifyListeners();
    });
  }

  void joinConversation(String conversationId) {
    socketService.joinConversation(conversationId);
  }

  Future<void> sendMessage(String conversationId, String text) async {
    socketService.sendMessage(conversationId, text);
    await messagesService.sendMessage(authProvider.token!, conversationId, text);
  }

}