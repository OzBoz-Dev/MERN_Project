import 'package:flutter/material.dart';
import 'package:mern_mobile_app/models/tag.dart';
import 'package:mern_mobile_app/widgets/project_card.dart';

class FeedPage extends StatelessWidget {
  FeedPage({super.key});

  // Mock data
  final mockPosts = List.filled(20, ProjectCard(
    title: "Project Title",
    poster: "hml786",
    numLikes: 1000,
    description: "The quick brown fox jumped over the lazy dog.",
    tags: [
      Tag(id: "asdf", label: "ML Developer"),
      Tag(id: "asdf", label: "Frontend Developer"),
      Tag(id: "asdf", label: "DevOps"),
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