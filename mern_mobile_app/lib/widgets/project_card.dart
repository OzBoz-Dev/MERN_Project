import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'package:timeago_flutter/timeago_flutter.dart' as timeago;

class ProjectCard extends StatelessWidget {
  final String title;
  final String poster;
  final String description;
  final DateTime dateTimePosted;

  const ProjectCard({
    super.key,
    required this.title,
    required this.poster,
    required this.description,
    required this.dateTimePosted
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 5,),
            Text(
              "Posted by: $poster • ${timeago.format(dateTimePosted)}",
              style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.grey),
            ),
            const SizedBox(height: 25,),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {},
                label: Text(
                  "Express Interest",
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                icon: Icon(Symbols.deployed_code),
              ),
            ),
            const SizedBox(height: 5,),
            SizedBox(
              width: double.infinity,
              child: TextButton.icon(
                onPressed: () {},
                label: Text(
                  "Message",
                  style: TextStyle(
                    fontWeight: FontWeight.bold
                  ),
                ),
                icon: Icon(Icons.send),
              ),
            ),
          ],
        ),
      ),
    );
  }
}