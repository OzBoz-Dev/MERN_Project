import 'package:chip_in/models/conversation.dart';
import 'package:chip_in/pages/messages/chat_page.dart';
import 'package:chip_in/providers/auth_provider.dart';
import 'package:chip_in/providers/conversation_provider.dart';
import 'package:chip_in/widgets/animated_grid_background.dart';
import 'package:chip_in/widgets/conversation_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

class MessagesPage extends StatefulWidget {
  const MessagesPage({super.key});

  @override
  State<MessagesPage> createState() => _MessagesPageState();
}

class _MessagesPageState extends State<MessagesPage> {

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      context.read<ConversationProvider>().getConversations();
    });
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    // Adjust this to however you access the username on AuthProvider
    final currentUsername = authProvider.username ?? '';

    return Scaffold(
      body: Consumer<ConversationProvider>(
        builder: (context, conversationProvider, child) {
          List<Conversation> conversations = conversationProvider.conversations;
          // Loading and no convos - avoid flicker
          if(conversationProvider.isLoading || !conversationProvider.hasLoaded) {
            return const Center(child: CircularProgressIndicator());
          }
          else if(conversationProvider.error != null) {
            return Center(
              child: Text(
                conversationProvider.error!,
                textAlign: TextAlign.center,
              ),
            );
          }
          // Done loading
          else {
            // Convos still emtpy - we really don't have any
            if(conversations.isEmpty) {
             return AnimatedGridBackground(
                backgroundColor: const Color(0xFFFDF8EA),
                child: Padding(
                  padding: const EdgeInsets.all(14),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(
                        TablerIcons.message_circle_question,
                        color: Color(0xFFFFA500),
                        size: 48,
                      ),
                      const SizedBox(height: 12,),
                      Text(
                        textAlign: TextAlign.center,
                        "You have no messages.",
                        style: GoogleFonts.montserrat(
                          fontSize: 18,
                          fontWeight: FontWeight.w500
                        ),
                      ),
                      const SizedBox(height: 36,),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: () {
                              
                            },
                            child: Text("Start a Conversation", style: GoogleFonts.montserrat(fontWeight: FontWeight.bold),),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }
            // We do have conversations
            else {
              return ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: conversations.length,
                itemBuilder: (context, index) {
                  final convo = conversations[index];
                  return ConversationCard(
                    conversation: convo,
                    currentUsername: currentUsername,
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => ChatPage(
                            conversationId: convo.id,
                          ),
                        ),
                      );
                    },
                  );
                },
              );
            }
          }
        },
      )
    );
  }
}