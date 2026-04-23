class Message {
  final String id;
  final String authorUsername;
  final String content;
  final DateTime createdAt;

  Message({
    required this.id,
    required this.authorUsername,
    required this.content,
    required this.createdAt,
  });
}