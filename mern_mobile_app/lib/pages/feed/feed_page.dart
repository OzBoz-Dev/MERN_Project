import 'package:chip_in/models/post.dart';
import 'package:chip_in/pages/projects/create_project_page.dart';
import 'package:chip_in/providers/auth_provider.dart';
import 'package:chip_in/providers/post_provider.dart';
import 'package:chip_in/widgets/animated_grid_background.dart';
import 'package:flutter/material.dart';
import 'package:chip_in/widgets/project_card.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

class FeedPage extends StatefulWidget {
  const FeedPage({super.key});

  @override
  State<FeedPage> createState() => _FeedPageState();
}

class _FeedPageState extends State<FeedPage> {

  final ScrollController _scrollController = ScrollController();

  void _onScroll() {
    final postProvider = context.read<PostProvider>();
    final authProvider = context.read<AuthProvider>();

    if (!_scrollController.hasClients) return;

    final thresholdReached =
        _scrollController.position.pixels >
        _scrollController.position.maxScrollExtent - 300;

    if (thresholdReached && postProvider.feedHasMore && !postProvider.isLoading) {
      postProvider.loadFeed(authProvider.username!);
    }
  }

  @override
  void initState() {
    super.initState();
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
              List<Post> feedPosts = postProvider.feedPosts;

              if(postProvider.isLoading && feedPosts.isEmpty) {
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
              else if(postProvider.error != null) {
                return Center(
                  child: Text(postProvider.error!),
                );
              }
              else {
                if(feedPosts.isEmpty) {
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
                            "No posts available!",
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
                return Stack(
                  children: [
                    AnimatedGridBackground(
                      backgroundColor: const Color(0xFFFDF8EA),
                      child: ListView.builder(
                        controller: _scrollController,
                        padding: const EdgeInsets.only(bottom: kToolbarHeight + 20,),
                        itemCount: feedPosts.length + 1,
                        itemBuilder: (context, index) {
                          final posts = feedPosts;
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
                    ),
                    Positioned(
                      left: 0,
                      right: 0,
                      bottom: 0,
                      child: SafeArea(
                        child: Container(
                          decoration: const BoxDecoration(
                            color: Colors.white,
                            boxShadow: [
                              BoxShadow(
                                blurRadius: 12,
                                color: Colors.black12,
                                offset: Offset(0, -2),
                              )
                            ],
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(12),
                            child: Center(
                              child: SizedBox(
                                width: double.infinity,
                                child: ElevatedButton.icon(
                                  onPressed: () {
                                    Navigator.of(context).push(
                                      MaterialPageRoute(
                                        builder: (context) => CreateProjectPage(),
                                      )
                                    );
                                  },
                                  icon: const Icon(TablerIcons.pencil),
                                  label: Text(
                                    "Create Project",
                                    style: GoogleFonts.montserrat(
                                      fontWeight: FontWeight.bold
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
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