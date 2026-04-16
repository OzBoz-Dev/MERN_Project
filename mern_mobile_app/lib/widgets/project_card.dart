import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:chip_in/models/tag.dart';
import 'package:chip_in/widgets/tag_container.dart';
import 'package:timeago_flutter/timeago_flutter.dart' as timeago;

class ProjectCard extends StatefulWidget {
  final String title;
  final String poster;
  final String description;
  final int numLikes;
  final List<Tag> tags;
  final DateTime dateTimePosted;

  const ProjectCard({
    super.key,
    required this.title,
    required this.poster,
    required this.description,
    required this.numLikes,
    required this.tags,
    required this.dateTimePosted
  });

  @override
  State<ProjectCard> createState() => _ProjectCardState();
}

class _ProjectCardState extends State<ProjectCard> {

  // Whether post has been liked
  late bool _isLiked;

  @override
  void initState() {
    super.initState();
    _isLiked = false; // default hasn't been liked
  }

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
          // Bookmark
          // Positioned(
          //   top: 0,
          //   right: 0,
          //   child: Padding(
          //     padding: const EdgeInsets.all(24),
          //     child: IconButton(
          //       onPressed: () {},
          //       icon: Icon(Symbols.bookmark),
          //     ),
          //   )
          // ),
          // Main content
          Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.title,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 5,),
                Text(
                  "Posted by: ${widget.poster} • ${timeago.format(widget.dateTimePosted)}",
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.grey),
                ),
                const SizedBox(height: 5,),
                Row(
                  children: [
                    Icon(TablerIcons.user, color: Colors.grey,),
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
                    itemCount: widget.tags.length,
                    itemBuilder: (context, index) {
                      return TagContainer(tag: widget.tags[index]);
                    },
                    separatorBuilder: (context, index) => const SizedBox(width: 5,),
                  ),
                ),
                const SizedBox(height: 15,),
                Text(
                  widget.description,
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                const SizedBox(height: 15,),
                Row(
                  children: [
                    Expanded(
                      child: TextButton.icon(
                        onPressed: () {},
                        label: Text(
                          "Message",
                          style: TextStyle(
                            fontWeight: FontWeight.bold
                          ),
                        ),
                        icon: Icon(TablerIcons.send),
                      ),
                    ),
                    const SizedBox(width: 5,),
                    // Like button
                    IconButton(
                      style: IconButton.styleFrom(
                        backgroundColor: Color(0xFFFFA500),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(6)
                        )
                      ),
                      onPressed: () {
                        setState(() {
                          _isLiked = !_isLiked;
                        });
                      },
                      icon: AnimatedSwitcher(
                        duration: Duration(milliseconds: 200),
                        switchInCurve: Curves.easeOutBack,
                        switchOutCurve: Curves.easeIn,
                        transitionBuilder: (child, animation) {
                          return FadeTransition(
                            opacity: animation,
                            child: ScaleTransition(
                              scale: animation,
                              child: child,
                            ),
                          );
                        },
                        child: Icon(
                          key: ValueKey(_isLiked),
                          _isLiked ? TablerIcons.heart_filled : TablerIcons.heart,
                        ),
                      ),
                    )
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}