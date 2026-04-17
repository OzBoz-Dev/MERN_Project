import 'package:chip_in/models/post.dart';
import 'package:chip_in/providers/auth_provider.dart';
import 'package:chip_in/services/content_service.dart';
import 'package:flutter/material.dart';
import 'package:chip_in/models/tag.dart';
import 'package:chip_in/widgets/project_card.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:objectid/objectid.dart';
import 'package:provider/provider.dart';

class FeedPage extends StatefulWidget {
  const FeedPage({super.key});

  @override
  State<FeedPage> createState() => _FeedPageState();
}

class _FeedPageState extends State<FeedPage> {
  // Mock data
  final mockPosts = List.filled(20, ProjectCard(
    post: Post(
      id: "69daa24cabc881c47249492b",
      title: "New Project",
      body: "lorem ipsum",
      likes: ["user1", "user2"],
      tags: [Tag(label: "mobile")],
      authorUsername: "jaedo",
      datePosted: ObjectId.fromHexString("69daa24cabc881c47249492b").timestamp
    ),
  ));

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
          final contentService = ContentService();
          Future<List<Post>> feedFuture = contentService.getFeedPosts(authProvider.username!);
          return FutureBuilder(
            future: feedFuture,
            builder: (context, snapshot) {
              if(snapshot.hasError) {
                return Center(
                  child: Text(snapshot.error.toString()),
                );
              }
              else if(snapshot.hasData) {
                // List of posts
                List<Post> feedPosts = snapshot.data!;

                return ListView.separated(
                  itemCount: feedPosts.length,
                  itemBuilder: (context, index) {
                    if(index == feedPosts.length - 1) {
                      return Column(
                        children: [
                          ProjectCard(post: feedPosts[index]),
                          const SizedBox(height: 8,),
                          Text("You've reached the end!"),
                          const SizedBox(height: 12,),
                        ],
                      );
                    }
                    return ProjectCard(post: feedPosts[index]);
                  },
                  separatorBuilder: (context, index) {
                    return const SizedBox(height: 4,);
                  },
                );
              }
              else {
                return Column(
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
                );
              }
            },
          );
        }
      },
    ); 
  }
}