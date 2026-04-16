import 'package:flutter/material.dart';
import 'package:mern_mobile_app/models/tag.dart';

class TagContainer extends StatelessWidget {
  final Tag tag;
  const TagContainer({super.key, required this.tag});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Color(0xFFf0f0ff),
        borderRadius: BorderRadius.circular(6)
      ),
      padding: const EdgeInsets.all(8),
      child: Text(
        tag.label,
        style: TextStyle(
          color: Color(0xFF4b4be6),
          fontSize: 12,
          fontWeight: FontWeight.bold
        ),
      ),
    );
  }
}