import 'dart:convert';

import 'package:chip_in/models/conversation.dart';
import 'package:chip_in/models/message.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;

class MessagesService {
  final String _baseUrl = dotenv.env['API_ENTRYPOINT'] ?? '';

  // Get all conversations the current user is a part of
  Future<List<Conversation>> getConversations(String token) async {
    final response = await http.get(
      Uri.parse("$_baseUrl/conversations/"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
    );
    final data = jsonDecode(response.body);
    if (response.statusCode != 200) {
      throw Exception(data['error'] ?? data['message']);
    }
    return (data as List)
        .map((conversation) => Conversation(
          id: conversation['_id'],
          ownerUsername: conversation['owner_username'],
          memberUsernames: (conversation['member_usernames'] as List).map((memberUsername) => memberUsername as String).toList(),
          messages: (conversation['messages'] as List).map(
            (message) => Message(
              id: message['_id'],
              authorUsername: message['author_username'],
              content: message['content'],
              createdAt: DateTime.parse(message['createdAt']).toLocal()
            )).toList(),
          createdAt: DateTime.parse(conversation['createdAt']).toLocal(),
          updatedAt: DateTime.parse(conversation['updatedAt']).toLocal()
        ))
        .toList();
  }

  // Get a single conversation by id (with populated messages)
  Future<Conversation> getConversationById(String id) async {
    final response = await http.get(
      Uri.parse("$_baseUrl/conversations/$id"),
      headers: {"Content-Type": "application/json"},
    );
    final data = jsonDecode(response.body);
    if (response.statusCode != 200) {
      throw Exception(data['error'] ?? data['message']);
    }
    return Conversation(
      id: data['_id'],
      ownerUsername: data['owner_username'],
      memberUsernames: (data['member_usernames'] as List).map((memberUsername) => memberUsername as String).toList(),
      messages: (data['messages'] as List).map(
        (message) => Message(
          id: message['_id'],
          authorUsername: message['author_username'],
          content: message['content'],
          createdAt: DateTime.parse(message['createdAt']).toLocal()
        )).toList(),
      createdAt: DateTime.parse(data['createdAt']).toLocal(),
      updatedAt: DateTime.parse(data['updatedAt']).toLocal()
    );
  }

  // Create a new conversation
  Future<Conversation> createConversation(
    String token,
    List<String> memberUsernames,
  ) async {
    final response = await http.post(
      Uri.parse("$_baseUrl/conversations/"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
      body: jsonEncode({"member_usernames": memberUsernames}),
    );
    final data = jsonDecode(response.body);
    if (response.statusCode != 201) {
      throw Exception(data['error'] ?? data['message']);
    }
    return Conversation(
      id: data['_id'],
      ownerUsername: data['owner_username'],
      memberUsernames: (data['member_usernames'] as List).map((memberUsername) => memberUsername as String).toList(),
      messages: (data['messages'] as List).map(
        (message) => Message(
          id: message['_id'],
          authorUsername: message['author_username'],
          content: message['content'],
          createdAt: DateTime.parse(message['createdAt']).toLocal()
        )).toList(),
      createdAt: DateTime.parse(data['createdAt']).toLocal(),
      updatedAt: DateTime.parse(data['updatedAt']).toLocal()
    );
  }

  // Send a message to a conversation
  Future<Message> sendMessage(
    String token,
    String conversationId,
    String content,
  ) async {
    final response = await http.post(
      Uri.parse("$_baseUrl/conversations/$conversationId/messages"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
      body: jsonEncode({"content": content}),
    );
    final data = jsonDecode(response.body);
    if (response.statusCode != 201) {
      throw Exception(data['error'] ?? data['message']);
    }
    return Message(
      id: data['_id'],
      authorUsername: data['author_username'],
      content: data['content'],
      createdAt: DateTime.parse(data['createdAt']).toLocal()
    );
  }

  // Leave a conversation
  Future<void> leaveConversation(String token, String conversationId) async {
    final response = await http.put(
      Uri.parse("$_baseUrl/conversations/leave/$conversationId"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
    );
    if (response.statusCode != 200) {
      final data = jsonDecode(response.body);
      throw Exception(data['error'] ?? data['message']);
    }
  }

  // Delete a conversation (owner only)
  Future<void> deleteConversation(String token, String conversationId) async {
    final response = await http.delete(
      Uri.parse("$_baseUrl/conversations/$conversationId"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
    );
    if (response.statusCode != 200) {
      final data = jsonDecode(response.body);
      throw Exception(data['error'] ?? data['message']);
    }
  }
}