import 'package:chip_in/models/comment.dart';
import 'package:chip_in/pages/profile/profile_page.dart';
import 'package:chip_in/providers/auth_provider.dart';
import 'package:chip_in/services/content_service.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:provider/provider.dart';
import 'package:timeago_flutter/timeago_flutter.dart' as timeago;

class CommentCard extends StatefulWidget {
  final Comment comment;
  final bool? isHighlighted;
  const CommentCard({super.key, required this.comment, this.isHighlighted});

  @override
  State<CommentCard> createState() => _CommentCardState();
}

class _CommentCardState extends State<CommentCard> {

  // Liked states
  late bool _isLiked;
  late int _likeCount;

  // For clicking on usernames
  late TapGestureRecognizer _tapRecognizer;
  

  @override
  void initState() {
    super.initState();
    _likeCount = widget.comment.likes.length;
    _tapRecognizer = TapGestureRecognizer()
      ..onTap = () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ProfilePage(username: widget.comment.authorUsername)
          )
        );
      };
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final authProvider = context.read<AuthProvider>();
    _isLiked = authProvider.username != null ? widget.comment.likes.contains(authProvider.username) : false;
  }
  
  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(0),
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
                RichText(
                  text: TextSpan(
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.grey),
                    children: [
                      TextSpan(
                        text: widget.comment.authorUsername,
                        style: const TextStyle(
                          color: Color(0xFFFFA500),
                          decoration: TextDecoration.underline,
                          decorationColor: Color(0xFFFFA500)
                        ),
                        recognizer: _tapRecognizer
                      ),
                      TextSpan(
                        text: " • ${timeago.format(widget.comment.datePosted)}",
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 5,),
                Text(
                  widget.comment.body
                ),
                const SizedBox(height: 12,),
                Align(
                  alignment: Alignment.centerRight,
                  child: Column(
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
                          // Content service
                          final contentService = ContentService();

                          // Auth provider
                          final authProvider = context.read<AuthProvider>();

                          // Optimistic update
                          setState(() {
                            _isLiked = !_isLiked;
                            if(_isLiked) {
                              _likeCount++;
                            }
                            else {
                              _likeCount--;
                            }
                          });
                          // Carry out like/unlike
                          try {
                            await contentService.likeCommentById(authProvider.token!, widget.comment.id);
                          }
                          catch(e) {
                            if(mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text("Error occurred"),
                                )
                              );
                            }
                            // Rollback on error
                            setState(() {
                            _isLiked = !_isLiked;
                              if(_isLiked) {
                                _likeCount++;
                              }
                              else {
                                _likeCount--;
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
                        "$_likeCount",
                        style: TextStyle(
                          fontSize: 12
                        ),
                      )
                    ],
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