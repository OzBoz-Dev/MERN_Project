import 'package:chip_in/models/post.dart';
import 'package:flutter/material.dart';
import 'package:chip_in/models/tag.dart';
import 'package:chip_in/widgets/project_card.dart';
import 'package:objectid/objectid.dart';

class FeedPage extends StatelessWidget {
  FeedPage({super.key});

  // Mock data
  final mockPosts = List.filled(20, ProjectCard(
    post: Post(
      id: "69daa24cabc881c47249492b",
      title: "New Project",
      body: "lorem ipsum",
      likes: ["user1", "user2"],
      tags: [Tag(label: "mobile")],
      authorUsername: "jaedo",
      datePosted: ObjectId.fromHexString("69daa24cabc881c47249492b").timestamp
    ),
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