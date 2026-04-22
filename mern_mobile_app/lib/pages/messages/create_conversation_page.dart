import 'package:chip_in/models/user.dart';
import 'package:chip_in/services/profile_service.dart';
import 'package:chip_in/widgets/animated_grid_background.dart';
import 'package:chip_in/widgets/user_holder.dart';
import 'package:flutter/material.dart';
import 'package:flutter_typeahead/flutter_typeahead.dart';

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
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Text("New Conversation")
                      ),
                      const SizedBox(height: 12,),
                      TypeAheadField<User>(
                        itemBuilder: (context, User user) {
                          return ListTile(
                            title: Text(user.username),
                          );
                        },
                        emptyBuilder: (context) => ListTile(title: Text("No users found!"),),
                        onSelected: (user) {
                          final alreadyExists = _users.any((u) => u.username == user.username);
                          if(alreadyExists) {
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