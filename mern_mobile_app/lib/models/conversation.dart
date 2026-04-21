import 'package:chip_in/models/message.dart';

class Conversation {
  final String id;
  final String ownerUsername;
  final List<String> memberUsernames;
  final List<Message> messages;
  final DateTime createdAt;
  final DateTime updatedAt;

  Conversation({
    required this.id,
    required this.ownerUsername,
    required this.memberUsernames,
    required this.messages,
    required this.createdAt,
    required this.updatedAt,
  });

  Message? get lastMessage => messages.isNotEmpty ? messages.last : null;
}