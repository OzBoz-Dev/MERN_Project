import 'package:chip_in/models/tag.dart';
import 'package:chip_in/widgets/tag_container.dart';
import 'package:flutter/material.dart';

class TagHolder extends StatelessWidget {
  final List<Tag> tags;
  final Function(Tag deletedTag)? onDelete;
  const TagHolder({super.key, required this.tags, this.onDelete});

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 6,
      runSpacing: 8,
      children: tags.map((tag) {
        final child = TagContainer(tag: tag);
        // No interaction
        if (onDelete == null) {
          return child;
        }
        // Allow deletes otherwise
        // Passes the deleted tag up to the parent
        // Parent can look at this tag's label, then rebuild its TagHolder
        return GestureDetector(
          onTap: () {
            onDelete?.call(tag);
          },
          child: child,
        );
      }).toList(),
    );
  }
}