import 'package:chip_in/models/comment.dart';
import 'package:chip_in/models/post.dart';
import 'package:chip_in/models/user.dart';
import 'package:chip_in/pages/messages/create_conversation_page.dart';
import 'package:chip_in/pages/profile/profile_page.dart';
import 'package:chip_in/pages/projects/add_comment_page.dart';
import 'package:chip_in/providers/auth_provider.dart';
import 'package:chip_in/providers/conversation_provider.dart';
import 'package:chip_in/providers/navigation_provider.dart';
import 'package:chip_in/providers/feed_provider.dart';
import 'package:chip_in/services/content_service.dart';
import 'package:chip_in/widgets/comment_card.dart';
import 'package:chip_in/widgets/tag_container.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:provider/provider.dart';
import 'package:timeago_flutter/timeago_flutter.dart' as timeago;

class ProjectPage extends StatefulWidget {
  final Post post;
  final bool? feedReferred;
  final bool? myBagReferred;
  const ProjectPage({super.key, required this.post, this.feedReferred, this.myBagReferred});

  @override
  State<ProjectPage> createState() => _ProjectPageState();
}

class _ProjectPageState extends State<ProjectPage> {

  // For clicking on usernames
  late TapGestureRecognizer _tapRecognizer;

  // Content service
  final contentService = ContentService();

  // Will have comments
  late Future<List<Comment>> _commentsFuture;

  // Highlights newly added comment
  String? _highlightedCommentId;

  // Will scroll to the new comment
  final _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    // Get comments
    _commentsFuture = contentService.getCommentsByPostId(widget.post.id);
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
    return Scaffold(
      appBar: AppBar(),
      body: ListView(
        controller: _scrollController,
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            widget.post.title,
            style: GoogleFonts.montserrat(
              fontSize: 22,
              fontWeight: FontWeight.bold
            ),
          ),
          const SizedBox(height: 5,),
          RichText(
            text: TextSpan(
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.grey),
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
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.grey),
              )
            ],
          ),
          const SizedBox(height: 14,),
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
          Html(
            data: widget.post.body,
          ),
          const SizedBox(height: 15,),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () async {
                    final newCommentId = await Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => AddCommentPage(postId: widget.post.id,),
                      )
                    );
                    if (newCommentId != null) {
                      setState(() {
                        _highlightedCommentId = newCommentId; // set the highlight
                        _commentsFuture = contentService.getCommentsByPostId(widget.post.id); // refetch comments to include the new one
                      });
            
                      // Remove highlight after delay
                      Future.delayed(Duration(seconds: 3), () {
                        if (mounted) {
                          setState(() {
                            _highlightedCommentId = null;
                          });
                        }
                      });
                    }
                  },
                  label: Text(
                    "Add Comment",
                    style: TextStyle(
                      fontWeight: FontWeight.bold
                    ),
                  ),
                  icon: Icon(TablerIcons.bubble_text),
                ),
              ),
              const SizedBox(width: 10,),
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
                  // Pop corruent page then push
                  Navigator.of(context).pushReplacement(
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
              // If referred to this page by the feed, use FeedProvider.
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
          const SizedBox(height: 12,),
          Divider(),
          const SizedBox(height: 12,),
          FutureBuilder(
            future: _commentsFuture,
            builder: (context, snapshot) {
              if(snapshot.hasError) {
                return Center(
                  child: Text("Error getting comments: ${snapshot.error.toString()}"),
                );
              }
              else if(snapshot.hasData) {
            
                final List<Comment> comments = snapshot.data!;
            
                if(comments.isEmpty) {
                  return Padding(
                    padding: const EdgeInsets.all(12),
                    child: Align(
                      alignment: Alignment.center,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          const Icon(
                            TablerIcons.bubble,
                            color: Color(0xFFFFA500),
                            size: 32,
                          ),
                          const SizedBox(height: 12,),
                          Text(
                            textAlign: TextAlign.center,
                            "No comments yet. Start the conversation!",
                            style: GoogleFonts.montserrat(
                              fontSize: 14,
                              color: Colors.grey[600]
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                }
            
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Comments (${comments.length})",
                      style: GoogleFonts.montserrat(
                        fontWeight: FontWeight.bold
                      ),
                    ),
                    const SizedBox(height: 12,),
                    ListView.separated(
                      physics: NeverScrollableScrollPhysics(),
                      shrinkWrap: true,
                      itemCount: comments.length,
                      itemBuilder: (context, index) {
                        return CommentCard(
                          comment: comments[index],
                          isHighlighted: comments[index].id == _highlightedCommentId,
                        );
                      },
                      separatorBuilder: (context, index) => const SizedBox(height: 12,),
                    ),
                  ],
                );
              }
              else {
                return Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Text(
                      "Fetching comments...",
                      style: GoogleFonts.montserrat(
                        fontSize: 18
                      ),
                    ),
                    const SizedBox(height: 24,),
                    CircularProgressIndicator(
                      color: Color(0xFFFFA500),
                    ),
                  ],
                );
              }
            },
          )
        ],
      )
    );
  }
}