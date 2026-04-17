import 'package:chip_in/models/post.dart';
import 'package:chip_in/pages/profile/profile_page.dart';
import 'package:chip_in/pages/projects/project_page.dart';
import 'package:chip_in/providers/auth_provider.dart';
import 'package:chip_in/services/content_service.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:chip_in/widgets/tag_container.dart';
import 'package:html/parser.dart' as html_parser;
import 'package:provider/provider.dart';
import 'package:timeago_flutter/timeago_flutter.dart' as timeago;

class ProjectCard extends StatefulWidget {
  final Post post;

  const ProjectCard({
    super.key,
    required this.post
  });

  @override
  State<ProjectCard> createState() => _ProjectCardState();
}

class _ProjectCardState extends State<ProjectCard> {

  // Whether post has been liked
  late bool _isLiked;

  late int likeCount;

  // For clicking on usernames
  late TapGestureRecognizer _tapRecognizer;

  // For showing project bodies on the card itself
  String stripHtml(String htmlString) {
    final document = html_parser.parse(htmlString);
    return document.body?.text ?? '';
  }

  @override
  void initState() {
    super.initState();
    _isLiked = false; // default hasn't been liked
    likeCount = widget.post.likes.length; // Set the initial number of likes
    _tapRecognizer = TapGestureRecognizer()
      ..onTap = () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ProfilePage(username: widget.post.authorUsername)
          )
        );
      };
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Set default likes based on username in likes array
    final authProvider = context.read<AuthProvider>();
    if(widget.post.likes.contains(authProvider.username)) {
      _isLiked = true;
    }
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
          // Main content
          Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.post.title,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 5,),
                RichText(
                  text: TextSpan(
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.grey),
                    children: [
                      const TextSpan(text: "Posted by: "),
                      TextSpan(
                        text: widget.post.authorUsername,
                        style: const TextStyle(
                          color: Color(0xFFFFA500),
                          decoration: TextDecoration.underline,
                          decorationColor: Color(0xFFFFA500)
                        ),
                        recognizer: _tapRecognizer
                      ),
                      TextSpan(
                        text: " • ${timeago.format(widget.post.datePosted)}",
                      ),
                    ],
                  ),
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
                    itemCount: widget.post.tags.length,
                    itemBuilder: (context, index) {
                      return TagContainer(tag: widget.post.tags[index]);
                    },
                    separatorBuilder: (context, index) => const SizedBox(width: 6,),
                  ),
                ),
                const SizedBox(height: 15,),
                Text(
                  stripHtml(widget.post.body),
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                const SizedBox(height: 15,),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: TextButton.icon(
                        style: Theme.of(context).textButtonTheme.style!.copyWith(
                          backgroundColor: WidgetStatePropertyAll(Colors.transparent),
                          foregroundColor: WidgetStatePropertyAll(Color(0xFFFFA500))
                        ),
                        onPressed: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (context) => ProjectPage(
                                post: widget.post,
                              )
                            )
                          );
                        },
                        label: Text(
                          "Read Full Post",
                          style: TextStyle(
                            fontWeight: FontWeight.bold
                          ),
                        ),
                        icon: Icon(TablerIcons.arrow_right),
                        iconAlignment: IconAlignment.end,
                      ),
                    ),
                    const SizedBox(width: 5,),
                    IconButton(
                      style: IconButton.styleFrom(
                        backgroundColor: Color(0xFFB9B9B9),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(6)
                        )
                      ),
                      onPressed: () {},
                      icon: Icon(TablerIcons.send)
                    ),
                    const SizedBox(width: 5,),
                    // Like button
                    Column(
                      children: [
                        IconButton(
                          style: IconButton.styleFrom(
                            backgroundColor: Color(0xFFFFA500),
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(6)
                            )
                          ),
                          onPressed: () async {
                            // Auth provider for token
                            final authProvider = context.read<AuthProvider>();
                        
                            // Content service to like the post
                            final contentService = ContentService();
                        
                            // Optimistic update
                            setState(() {
                              _isLiked = !_isLiked;
                              if(_isLiked) {
                                likeCount++;
                              }
                              else {
                                likeCount--;
                              }
                            });
                        
                            // Attempt to like (or unlike) the post
                            try {
                              await contentService.likePostById(authProvider.token!, widget.post.id);
                            }
                            catch(e) {
                              debugPrint("Error liking/unliking: ${e.toString()}");
                              // Tell user
                              if(mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: _isLiked == true ? Text("Failed to unlike post.") : Text("Failed to like post."),
                                  )
                                );
                              }
                              // Revert if like failed
                              setState(() {
                                _isLiked = !_isLiked;
                                if(_isLiked) {
                                  likeCount++;
                                }
                                else {
                                  likeCount--;
                                }
                              });
                            }
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
                        ),
                        Text(
                          "$likeCount",
                          style: TextStyle(
                            fontSize: 12
                          ),
                        )
                      ],
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

  @override
  void dispose() {
    super.dispose();
    _tapRecognizer.dispose();
  }
}