import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Card(
          child: Padding(
            padding: const EdgeInsets.all(10),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  "MERN Project",
                  style: Theme.of(context).textTheme.titleLarge,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}