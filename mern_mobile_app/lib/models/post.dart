import 'package:chip_in/models/tag.dart';

class Post {
  final String id;
  final String title;
  final String body;
  final List<String> likes;
  final List<Tag> tags;
  final String authorUsername;
  final DateTime datePosted;

  Post({
    required this.id,
    required this.title,
    required this.body,
    required this.likes,
    required this.tags,
    required this.authorUsername,
    required this.datePosted
  });
}