import 'package:chip_in/models/tag.dart';

class User {
  final String username;
  final String firstName;
  final String lastName;
  final String bio;
  final List<Tag> tags;

  User({
    required this.username,
    required this.firstName,
    required this.lastName,
    required this.bio,
    required this.tags,
  });
}