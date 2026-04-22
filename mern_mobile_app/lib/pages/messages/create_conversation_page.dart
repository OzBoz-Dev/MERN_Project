import 'package:chip_in/models/user.dart';
import 'package:chip_in/providers/auth_provider.dart';
import 'package:chip_in/services/messages_service.dart';
import 'package:chip_in/services/profile_service.dart';
import 'package:chip_in/widgets/animated_grid_background.dart';
import 'package:chip_in/widgets/user_holder.dart';
import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:flutter_typeahead/flutter_typeahead.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

class CreateConversationPage extends StatefulWidget {
  const CreateConversationPage({super.key});

  @override
  State<CreateConversationPage> createState() => _CreateConversationPageState();
}

class _CreateConversationPageState extends State<CreateConversationPage> {

  // Users that will be searched and added to conversation
  final List<User> _users = [];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Create Conversation"), centerTitle: true,),
      body: AnimatedGridBackground(
        backgroundColor: const Color(0xFFFDF8EA),
        child: Center(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Align(
                        alignment: Alignment.center,
                        child: Text(
                          "New Conversation",
                          style: GoogleFonts.montserrat(
                            fontWeight: FontWeight.bold,
                            fontSize: 18
                          ),
                        )
                      ),
                      const SizedBox(height: 24,),
                      TypeAheadField<User>(
                        itemBuilder: (context, User user) {
                          return ListTile(
                            title: Text(user.username),
                          );
                        },
                        emptyBuilder: (context) => ListTile(title: Text("No users found!"),),
                        onSelected: (user) {
                          // Get own username
                          final authProvider = context.read<AuthProvider>();
                          final alreadyExists = _users.any((u) => u.username == user.username);
                          // Tell user they can't add themselves
                          if(user.username == authProvider.username) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text("Can't add yourself to a new conversation"),
                              )
                            );
                          }
                          else if(alreadyExists) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text("You've already added this user!"),
                              )
                            );
                          }
                          else {
                            setState(() {
                              _users.add(user);
                            });
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text("User added!"),
                              )
                            );
                          }
                        },
                        suggestionsCallback: (pattern) async {
                          if (pattern.isEmpty) return [];
                          final profileService = ProfileService();
                          return await profileService.searchProfileByUsername(username: pattern);
                        },
                        builder: (context, controller, focusNode) {
                          return TextField(
                            controller: controller,
                            focusNode: focusNode,
                            decoration: InputDecoration(
                              labelText: 'Search users',
                              border: OutlineInputBorder(),
                            ),
                          );
                        },
                      ),
                      const SizedBox(height: 12,),
                      _users.isEmpty ? Text("No users added") : UserHolder(
                        users: _users,
                        onDelete: (deletedTag) {
                          setState(() {
                            _users.remove(deletedTag);
                          });
                        },
                      ),
                      const SizedBox(height: 24,),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: _users.isNotEmpty ? () async {
                            final authProvider = context.read<AuthProvider>();
                            final messagesService = MessagesService();

                            final usernames = _users.map((user) => user.username).toList();

                            // Add self to List
                            usernames.add(authProvider.username!);

                            try {
                              // Create convo
                              await messagesService.createConversation(authProvider.token!, usernames);
                              // Go back to messages page
                              if(mounted) Navigator.of(context).pop();
                            }
                            catch(e) {
                              if(mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(e.toString()),
                                  )
                                );
                              }
                            }
                          } : null,
                          icon: Icon(TablerIcons.message_plus),
                          label: Text("Create", style: GoogleFonts.montserrat(fontWeight: FontWeight.bold),),
                        ),
                      ),
                    ]
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