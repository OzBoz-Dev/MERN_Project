import 'package:flutter/material.dart';
import 'package:chip_in/models/tag.dart';
import 'package:chip_in/widgets/project_card.dart';

class FeedPage extends StatelessWidget {
  FeedPage({super.key});

  // Mock data
  final mockPosts = List.filled(20, ProjectCard(
    title: "Project Title",
    poster: "hml786",
    numLikes: 1000,
    description: "The quick brown fox jumped over the lazy dog.",
    tags: [
      Tag(label: "ML Developer"),
      Tag(label: "Frontend Developer"),
      Tag(label: "DevOps"),
    ],
    dateTimePosted: DateTime.now().add(Duration(hours: -2)),
  ));

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 5),
      child: ListView.builder(
        itemCount: mockPosts.length,
        itemBuilder: (context, index) => mockPosts[index],
      )
    );
  }
}