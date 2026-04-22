import 'package:chip_in/models/post.dart';
import 'package:chip_in/providers/auth_provider.dart';
import 'package:chip_in/providers/post_provider.dart';
import 'package:chip_in/widgets/animated_grid_background.dart';
import 'package:flutter/material.dart';
import 'package:chip_in/widgets/project_card.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

class MyBagPage extends StatefulWidget {
  const MyBagPage({super.key});

  @override
  State<MyBagPage> createState() => _MyBagPageState();
}

class _MyBagPageState extends State<MyBagPage> {

  final ScrollController _scrollController = ScrollController();

  void _onScroll() {
    final postProvider = context.read<PostProvider>();
    final authProvider = context.read<AuthProvider>();

    if (!_scrollController.hasClients) return;

    final thresholdReached =
        _scrollController.position.pixels >
        _scrollController.position.maxScrollExtent - 300;

    if (thresholdReached && postProvider.likedHasMore && !postProvider.isLikedLoading) {
      postProvider.loadLikedPosts(authProvider.token!);
    }
  }

  @override
  void initState() {
    super.initState();
    final authProvider = context.read<AuthProvider>();
    final token = authProvider.token!;
    // Get liked posts
    Future.microtask(() {
      context.read<PostProvider>().loadLikedPosts(token, refresh: true);
    });
    _scrollController.addListener(_onScroll);
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        if(!authProvider.isAuthenticated) {
          return const Center(
            child: Text("You are not signed in."),
          );
        }
        else if(authProvider.isLoading) {
          return const Center(
            child: CircularProgressIndicator(),
          );
        }
        else if(authProvider.error != null) {
          return Center(
            child: Text(authProvider.error!),
          );
        }
        else {
          return Consumer<PostProvider>(
            builder: (context, postProvider, child) {
              // Get feed posts first to check the length
              List<Post> likedPosts = postProvider.likedPosts;

              if(postProvider.isLikedLoading && likedPosts.isEmpty) {
                return AnimatedGridBackground(
                  backgroundColor: const Color(0xFFFDF8EA),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        "Give us a moment...",
                        style: GoogleFonts.montserrat(
                          fontSize: 18
                        ),
                      ),
                      const SizedBox(height: 24,),
                      CircularProgressIndicator(
                        color: Color(0xFFFFA500),
                      ),
                    ],
                  ),
                );
              }
              else if(postProvider.likedError != null) {
                return Center(
                  child: Text(postProvider.likedError!),
                );
              }
              else {
                if(likedPosts.isEmpty) {
                  return AnimatedGridBackground(
                    backgroundColor: const Color(0xFFFDF8EA),
                    child: Padding(
                      padding: const EdgeInsets.all(14),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            TablerIcons.mood_confuzed,
                            color: Color(0xFFFFA500),
                            size: 48,
                          ),
                          const SizedBox(height: 12,),
                          Text(
                            textAlign: TextAlign.center,
                            "You haven't liked any posts!",
                            style: GoogleFonts.montserrat(
                              fontSize: 18,
                              fontWeight: FontWeight.w500
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                }
                return AnimatedGridBackground(
                  backgroundColor: const Color(0xFFFDF8EA),
                  child: ListView.builder(
                    controller: _scrollController,
                    itemCount: likedPosts.length + 1,
                    itemBuilder: (context, index) {
                      final posts = likedPosts;
                      final provider = postProvider;
                
                      final isLastItem = index == posts.length;
                
                      if (isLastItem) {
                        if (provider.feedHasMore) {
                          return const Padding(
                            padding: EdgeInsets.all(16),
                            child: Center(child: CircularProgressIndicator(
                              color: Color(0xFFFFA500)
                            )),
                          );
                        } else {
                          return Padding(
                            padding: EdgeInsets.all(16),
                            child: Center(
                              child: Text(
                                "You've reached the end!",
                                style: GoogleFonts.montserrat(
                                  fontWeight: FontWeight.bold
                                ),
                              )
                            ),
                          );
                        }
                      }
                
                      return Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                        child: ProjectCard(post: posts[index]),
                      );
                    }
                  ),
                );
              }
            },
          );
        }
      },
    ); 
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }
}