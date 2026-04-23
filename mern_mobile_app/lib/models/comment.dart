class Comment {
  final String id;
  final String authorUsername;
  final String body;
  final Set<String> likes;
  final String postIdBelong;
  final DateTime datePosted;

  Comment({
    required this.id,
    required this.authorUsername,
    required this.body,
    required this.likes,
    required this.postIdBelong,
    required this.datePosted
  });
}