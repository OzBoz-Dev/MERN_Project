class Post {
  final String id;
  final String title;
  final String body;
  final List<String> likes;
  final List<String> tags;
  final String authorUsername;

  Post({
    required this.id,
    required this.title,
    required this.body,
    required this.likes,
    required this.tags,
    required this.authorUsername
  });
}