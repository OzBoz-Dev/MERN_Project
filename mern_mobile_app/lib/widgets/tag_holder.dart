import 'package:chip_in/models/tag.dart';
import 'package:chip_in/widgets/tag_container.dart';
import 'package:flutter/material.dart';

class TagHolder extends StatelessWidget {
  final List<Tag> tags;
  const TagHolder({super.key, required this.tags});

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 6,
      runSpacing: 8,
      children: tags.map((tag) => TagContainer(tag: tag)).toList()
    );
  }
}