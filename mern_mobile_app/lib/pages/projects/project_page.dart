import 'package:chip_in/models/post.dart';
import 'package:flutter/material.dart';

class ProjectPage extends StatefulWidget {
  final Post post;
  const ProjectPage({super.key, required this.post});

  @override
  State<ProjectPage> createState() => _ProjectPageState();
}

class _ProjectPageState extends State<ProjectPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: const Center(
        child: Text("Full Project"),
      ),
    );
  }
}