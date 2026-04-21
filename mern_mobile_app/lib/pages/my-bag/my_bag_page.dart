import 'package:chip_in/widgets/animated_grid_background.dart';
import 'package:flutter/material.dart';

class MyBagPage extends StatelessWidget {
  const MyBagPage({super.key});

  @override
  Widget build(BuildContext context) {
    return AnimatedGridBackground(
      backgroundColor: const Color(0xFFFDF8EA),
      child: Center(
        child: Text("My Bag"),
      ),
    );
  }
}