import 'package:chip_in/providers/auth_provider.dart';
import 'package:chip_in/services/content_service.dart';
import 'package:chip_in/widgets/animated_grid_background.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

class AddCommentPage extends StatefulWidget {
  final String postId;
  const AddCommentPage({super.key, required this.postId});

  @override
  State<AddCommentPage> createState() => _AddCommentPageState();
}

class _AddCommentPageState extends State<AddCommentPage> {

  final _commentController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: AnimatedGridBackground(
        backgroundColor: const Color(0xFFFDF8EA),
        child: Center(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(
                        "Add Comment",
                        style: GoogleFonts.montserrat(
                          fontSize: 16,
                          fontWeight: FontWeight.bold
                        ),
                      ),
                      const SizedBox(height: 16,),
                      TextField(
                        controller: _commentController,
                        onChanged: (value) => setState(() {}),
                        maxLines: 10,
                        decoration: InputDecoration(
                          label: Text("Write your comment"),
                          alignLabelWithHint: true
                        ),
                      ),
                      const SizedBox(height: 16,),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: _commentController.text.trim().isNotEmpty ? () async {
                            // Content service for posting
                            final contentService = ContentService();
                            final authProvider = context.read<AuthProvider>();

                            final token = authProvider.token!;
                            final commentBody = _commentController.text.trim();

                            try {
                              final newComment = await contentService.postComment(token, widget.postId, commentBody);
                              if(mounted) Navigator.pop(context, newComment.id);
                            }
                            catch(e) {
                              if(mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text("Error occurred: ${e.toString()}"),
                                  )
                                );
                              }
                            }
                          } : null,
                          child: Text("Save", style: GoogleFonts.montserrat(fontWeight: FontWeight.bold),),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}