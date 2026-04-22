import 'package:chip_in/pages/profile/edit_profile_page.dart';
import 'package:chip_in/providers/post_provider.dart';
import 'package:chip_in/providers/profile_post_provider.dart';
import 'package:chip_in/widgets/project_card.dart';
import 'package:chip_in/widgets/tag_holder.dart';
import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:chip_in/models/user.dart';
import 'package:chip_in/providers/auth_provider.dart';
import 'package:chip_in/services/profile_service.dart';
import 'package:chip_in/widgets/animated_grid_background.dart';
import 'package:chip_in/widgets/profile_square.dart';
import 'package:provider/provider.dart';

class ProfilePage extends StatefulWidget {
  final String username;
  final bool? isUser;
  const ProfilePage({super.key, required this.username, this.isUser});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final profileService = ProfileService();
  late Future<User> _userFuture;
  final ScrollController _scrollController = ScrollController();

  void _onScroll() {
    final profilePostProvider = context.read<ProfilePostProvider>();
    if (!_scrollController.hasClients) return;

    final thresholdReached = _scrollController.position.pixels >
        _scrollController.position.maxScrollExtent - 300;

    if (thresholdReached && profilePostProvider.hasMore && !profilePostProvider.isLoading) {
      profilePostProvider.loadMore(widget.username);
    }
  }

  @override
  void initState() {
    super.initState();
    _userFuture = profileService.getProfileByUserName(username: widget.username);
    Future.microtask(() {
      context.read<ProfilePostProvider>().loadPostsByUsername(widget.username, refresh: true);
    });
    _scrollController.addListener(_onScroll);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Profile"), centerTitle: true),
      body: AnimatedGridBackground(
        backgroundColor: const Color(0xFFFDF8EA),
        child: FutureBuilder(
          future: _userFuture,
          builder: (context, snapshot) {
            if (snapshot.hasError) {
              if (snapshot.error.toString() == "Exception: User not found") {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(TablerIcons.mood_puzzled, color: Color(0xFFFFA500), size: 48),
                      const SizedBox(height: 12),
                      Text("Profile not found...",
                          style: GoogleFonts.montserrat(fontSize: 18, fontWeight: FontWeight.w500)),
                    ],
                  ),
                );
              }
              return Center(child: Text("Error Occurred: ${snapshot.error}"));
            } else if (snapshot.hasData) {
              final user = snapshot.data!;
              return CustomScrollView(
                controller: _scrollController,
                slivers: [
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Card(
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                          side: BorderSide(color: Colors.grey[300]!, width: 1),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(24),
                          child: Column(
                            children: [
                              if (widget.isUser == true)
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.end,
                                  children: [
                                    IconButton(
                                      style: IconButton.styleFrom(
                                        backgroundColor: const Color(0xFFFFA500),
                                        foregroundColor: Colors.white,
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                                      ),
                                      onPressed: () async {
                                        final updated = await Navigator.push(
                                          context,
                                          MaterialPageRoute(builder: (context) => EditProfilePage(user: user)),
                                        );
                                        if (updated == true) {
                                          setState(() {
                                            _userFuture = profileService.getProfileByUserName(username: widget.username);
                                          });
                                        }
                                      },
                                      icon: const Icon(TablerIcons.pencil),
                                    ),
                                    const SizedBox(width: 4),
                                    Consumer<AuthProvider>(
                                      builder: (context, authProvider, child) {
                                        return IconButton(
                                          style: IconButton.styleFrom(
                                            backgroundColor: Colors.red,
                                            foregroundColor: Colors.white,
                                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                                          ),
                                          onPressed: () async {
                                            final postProvider = context.read<PostProvider>();
                                            await authProvider.logout();
                                            postProvider.reset();
                                            if (mounted) Navigator.pop(context);
                                          },
                                          icon: const Icon(TablerIcons.logout),
                                        );
                                      },
                                    ),
                                  ],
                                ),
                              const SizedBox(height: 16),
                              ProfileSquare(firstName: user.firstName, lastName: user.lastName),
                              const SizedBox(height: 16),
                              Text("${user.firstName} ${user.lastName}",
                                  style: GoogleFonts.montserrat(fontSize: 18, fontWeight: FontWeight.w800)),
                              const SizedBox(height: 2),
                              Text(user.username, style: GoogleFonts.montserrat(fontStyle: FontStyle.italic)),
                              const SizedBox(height: 16),
                              Text(user.bio.isEmpty ? "No Bio" : user.bio,
                                  textAlign: TextAlign.center, style: GoogleFonts.montserrat(color: Colors.grey[600])),
                              const SizedBox(height: 16),
                              const Divider(),
                              const SizedBox(height: 4),
                              user.tags.isEmpty ? const Text("No tags") : TagHolder(tags: user.tags),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(24, 16, 24, 8),
                      child: Text("Recent Posts",
                          style: GoogleFonts.montserrat(fontWeight: FontWeight.bold, fontSize: 16)),
                    ),
                  ),
                  Consumer<ProfilePostProvider>(
                    builder: (context, postProvider, child) {
                      if (postProvider.isLoading && postProvider.posts.isEmpty) {
                        return const SliverToBoxAdapter(
                          child: Center(child: Padding(padding: EdgeInsets.all(24), child: CircularProgressIndicator(color: Color(0xFFFFA500)))),
                        );
                      }
                      if (postProvider.error != null) {
                        return SliverToBoxAdapter(child: Center(child: Text(postProvider.error!)));
                      }
                      if (postProvider.posts.isEmpty) {
                        return SliverToBoxAdapter(
                          child: Column(
                            children: [
                              const SizedBox(height: 20),
                              const Icon(TablerIcons.mood_confuzed, color: Color(0xFFFFA500), size: 48),
                              const SizedBox(height: 12),
                              Text("This user has no posts...", style: GoogleFonts.montserrat(fontSize: 18, fontWeight: FontWeight.w500)),
                            ],
                          ),
                        );
                      }
                      return SliverPadding(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        sliver: SliverList(
                          delegate: SliverChildBuilderDelegate(
                            (context, index) {
                              if (index == postProvider.posts.length) {
                                return postProvider.hasMore
                                    ? const Padding(padding: EdgeInsets.all(16), child: Center(child: CircularProgressIndicator(color: Color(0xFFFFA500))))
                                    : Padding(padding: const EdgeInsets.all(16), child: Center(child: Text("You've reached the end!", style: GoogleFonts.montserrat(fontWeight: FontWeight.bold))));
                              }
                              return Padding(
                                padding: const EdgeInsets.symmetric(vertical: 4),
                                child: ProjectCard(post: postProvider.posts[index], disableLikeButton: true,),
                              );
                            },
                            childCount: postProvider.posts.length + 1,
                          ),
                        ),
                      );
                    },
                  ),
                  const SliverToBoxAdapter(child: SizedBox(height: 40)),
                ],
              );
            }
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text("Give us a moment...", style: GoogleFonts.montserrat(fontSize: 18)),
                  const SizedBox(height: 24),
                  const CircularProgressIndicator(color: Color(0xFFFFA500)),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }
}