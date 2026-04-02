import 'package:flutter/material.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'package:timeago_flutter/timeago_flutter.dart' as timeago;

class ProjectCard extends StatelessWidget {
  final String title;
  final String poster;
  final String description;
  final List<String> tags;
  final DateTime dateTimePosted;

  const ProjectCard({
    super.key,
    required this.title,
    required this.poster,
    required this.description,
    required this.tags,
    required this.dateTimePosted
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: Stack(
        children: [
          // left edge highlight
          Positioned(
            left: 0,
            top: 0,
            bottom: 0,
            width: 8,
            child: Container(
              color: Color(0xFFffe082),
            ),
          ),
          // Main content
          Padding(
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
                const SizedBox(height: 5,),
                Row(
                  children: [
                    Icon(Icons.person_outline, color: Colors.grey,),
                    const SizedBox(width: 8,),
                    Text(
                      "Looking for:",
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.grey),
                    )
                  ],
                ),
                const SizedBox(height: 10,),
                SizedBox(
                  height: 35,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: tags.length,
                    itemBuilder: (context, index) {
                      return Container(
                        decoration: BoxDecoration(
                          color: Color(0xFFf0f0ff),
                          borderRadius: BorderRadius.circular(6)
                        ),
                        padding: const EdgeInsets.all(8),
                        child: Text(
                          tags[index],
                          style: TextStyle(
                            color: Color(0xFF4b4be6),
                            fontSize: 12,
                            fontWeight: FontWeight.bold
                          ),
                        ),
                      );
                    },
                    separatorBuilder: (context, index) => const SizedBox(width: 5,),
                  ),
                ),
                const SizedBox(height: 15,),
                Text(
                  description,
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                const SizedBox(height: 15,),
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
        ],
      ),
    );
  }
}