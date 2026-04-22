import 'package:chip_in/models/conversation.dart';
import 'package:chip_in/pages/messages/chat_page.dart';
import 'package:chip_in/providers/auth_provider.dart';
import 'package:chip_in/providers/conversation_provider.dart';
import 'package:chip_in/widgets/conversation_card.dart';
import 'package:flutter/material.dart';
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
              return ListView(
                children: const [
                  SizedBox(height: 200),
                  Center(child: Text("No conversations yet")),
                ],
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