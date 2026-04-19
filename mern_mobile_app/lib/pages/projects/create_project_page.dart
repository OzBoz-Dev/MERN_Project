import 'package:chip_in/widgets/animated_grid_background.dart';
import 'package:flutter/material.dart';

class CreateProjectPage extends StatefulWidget {
  const CreateProjectPage({super.key});

  @override
  State<CreateProjectPage> createState() => _CreateProjectPageState();
}

class _CreateProjectPageState extends State<CreateProjectPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Create Project"), centerTitle: true,),
      body: AnimatedGridBackground(
        backgroundColor: const Color(0xFFFDF8EA),
        child: Center(child: Text("Create Project Page")),
      ),
    );
  }
}