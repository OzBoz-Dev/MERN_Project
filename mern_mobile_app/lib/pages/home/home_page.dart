import 'package:flutter/material.dart';
import 'package:mern_mobile_app/widgets/project_card.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Home"),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 5),
        child: Column(
          children: [
            ProjectCard(
              title: "Project Title",
              poster: "hml786",
              description: "The quick brown fox jumped over the lazy dog.",
              tags: [
                "ML Developer",
                "Frontend Developer",
                "DevOps",
              ],
              dateTimePosted: DateTime.now().add(Duration(hours: -2)),
            ),
          ]
        ),
      ),
    );
  }
}