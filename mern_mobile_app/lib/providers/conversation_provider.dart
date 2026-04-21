import 'package:chip_in/models/conversation.dart';
import 'package:chip_in/providers/auth_provider.dart';
import 'package:chip_in/services/messages_service.dart';
import 'package:flutter/material.dart';

class ConversationProvider with ChangeNotifier {
  final AuthProvider authProvider;
  ConversationProvider({required this.authProvider});

  // State
  bool _isLoading = false;
  String? _error;

  // Maps convo ids to their conversation
  Map<String, Conversation> _conversations = {};

  // Getters
  bool get isLoading => _isLoading;
  String? get error => _error;
  List<Conversation> get conversations => _conversations.values.toList();
  Conversation? getConversationById(String id) => _conversations[id];

  // Service
  final messagesService = MessagesService();

  // Fetch conversations from service
  Future<void> getConversations() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final fetchedConversations = await messagesService.getConversations(authProvider.token!);
      _conversations.clear();
      for(Conversation conversation in fetchedConversations) {
        _conversations[conversation.id] = conversation;
      }
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

  // Sends a message
  Future<void> sendMessage(String conversationId, String text) async {
    final token = authProvider.token!;
    await messagesService.sendMessage(token, conversationId, text);
  }

}