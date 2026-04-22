import 'package:chip_in/models/post.dart';
import 'package:chip_in/models/user.dart';
import 'package:chip_in/pages/messages/create_conversation_page.dart';
import 'package:chip_in/pages/profile/profile_page.dart';
import 'package:chip_in/pages/projects/project_page.dart';
import 'package:chip_in/providers/auth_provider.dart';
import 'package:chip_in/providers/conversation_provider.dart';
import 'package:chip_in/providers/navigation_provider.dart';
import 'package:chip_in/providers/feed_provider.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:chip_in/widgets/tag_container.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:html/parser.dart' as html_parser;
import 'package:provider/provider.dart';
import 'package:timeago_flutter/timeago_flutter.dart' as timeago;

class ProjectCard extends StatefulWidget {
  final Post post;
  final bool? disableLikeButton;

  const ProjectCard({
    super.key,
    required this.post,
    this.disableLikeButton
  });

  @override
  State<ProjectCard> createState() => _ProjectCardState();
}

class _ProjectCardState extends State<ProjectCard> {

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
                  style: GoogleFonts.montserrat(
                    fontSize: 18,
                    fontWeight: FontWeight.bold
                  ),
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
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
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
                                disableLikeButton: widget.disableLikeButton,
                              )
                            )
                          );
                        },
                        label: Text(
                          "Read Full Post",
                          style: GoogleFonts.montserrat(
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
                      onPressed: () {
                        final conversationProvider = context.read<ConversationProvider>();
                        final navProvider = context.read<NavigationProvider>();
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (context) => CreateConversationPage(
                                // don't need to fetch, we only really care about username
                                initialUser: User(
                                  username: widget.post.authorUsername,
                                  firstName: "",
                                  lastName: "",
                                  bio: "",
                                  tags: []
                                ),
                              ),
                            )
                          ).then((_) {
                            // Reload conversations
                            conversationProvider.getConversations();
                            // Navigate to messages page
                            navProvider.onNavItemTapped(2);
                          });
                      },
                      icon: Icon(TablerIcons.send)
                    ),
                    const SizedBox(width: 5,),
                    // Like button
                    widget.disableLikeButton == true ?
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
                          onPressed: null,
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
                              TablerIcons.heart
                            ),
                          ),
                        ),
                        Text(
                          "${widget.post.likes.length}",
                          style: TextStyle(
                            fontSize: 12
                          ),
                        )
                      ]
                    )
                    :
                    Consumer<FeedProvider>(
                      builder: (context, projectsProvider, child) {
                        if(projectsProvider.posts.isNotEmpty) {
                          // Auth provider for username
                          final authProvider = context.read<AuthProvider>();
                          final post = widget.post;

                          // Whether this post was liked by the user
                          bool isLiked = post.likes.contains(authProvider.username);

                          return Column(
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
                                  projectsProvider.toggleLike(
                                    token: authProvider.token!,
                                    postId: post.id,
                                    username: authProvider.username!
                                  );
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
                                    key: ValueKey(isLiked),
                                    isLiked ? TablerIcons.heart_filled : TablerIcons.heart,
                                  ),
                                ),
                              ),
                              Text(
                                "${post.likes.length}",
                                style: TextStyle(
                                  fontSize: 12
                                ),
                              )
                            ],
                          );
                        }
                        else {
                          return Column(
                            children: [
                              IconButton(
                                style: IconButton.styleFrom(
                                  backgroundColor: Color(0xFFFFA500),
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(6)
                                  )
                                ),
                                onPressed: null,
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
                                    TablerIcons.heart,
                                  ),
                                ),
                              ),
                              Text(
                                "0",
                                style: TextStyle(
                                  fontSize: 12
                                ),
                              )
                            ],
                          );
                        }
                      },
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