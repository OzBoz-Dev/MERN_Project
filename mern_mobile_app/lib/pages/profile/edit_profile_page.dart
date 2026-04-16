import 'package:chip_in/models/user.dart';
import 'package:chip_in/providers/auth_provider.dart';
import 'package:chip_in/services/profile_service.dart';
import 'package:chip_in/widgets/animated_grid_background.dart';
import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

class EditProfilePage extends StatefulWidget {
  final User user;
  const EditProfilePage({super.key, required this.user});

  @override
  State<EditProfilePage> createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {

  // Text editing controllers
  late TextEditingController _firstNameController;
  late TextEditingController _lastNameController;
  late TextEditingController _bioController;

  @override
  void initState() {
    super.initState();
    _firstNameController = TextEditingController(text: widget.user.firstName);
    _lastNameController = TextEditingController(text: widget.user.lastName);
    _bioController = TextEditingController(text: widget.user.bio);
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Edit Profile"), centerTitle: true,),
      body: AnimatedGridBackground(
        backgroundColor: const Color(0xFFFDF8EA),
        child: Center(
          child: SingleChildScrollView(
            child: Padding(
              padding: EdgeInsets.all(8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Text(
                    "${widget.user.username}'s Profile",
                    style: GoogleFonts.montserrat(
                      fontSize: 18,
                      fontWeight: FontWeight.bold
                    ),
                  ),
                  const SizedBox(height: 16,),
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          // Example fields
                          TextField(
                            controller: _firstNameController,
                            decoration: InputDecoration(
                              labelText: "First Name",
                              border: OutlineInputBorder(),
                            ),
                          ),
                          const SizedBox(height: 12),
                          TextField(
                            controller: _lastNameController,
                            decoration: InputDecoration(
                              labelText: "Last Name",
                              border: OutlineInputBorder(),
                            ),
                          ),
                          const SizedBox(height: 12),
                          TextField(
                            controller: _bioController,
                            maxLength: 300,
                            maxLines: 6,
                            decoration: InputDecoration(
                              labelText: "Bio",
                              alignLabelWithHint: true,
                              border: OutlineInputBorder(),
                            ),
                          ),
                          const SizedBox(height: 20),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: () async {
                                final authService = context.read<AuthProvider>();
                                final profileService = ProfileService();

                                // Collect fields
                                final firstName = _firstNameController.text.trim();
                                final lastName = _lastNameController.text.trim();
                                final bio = _bioController.text.trim();
                                // TODO: Actually impelement tags via search later
                                // For now use existing tags
                                final tags = widget.user.tags;

                                try {
                                  await profileService.editProfile(
                                    token: authService.token ?? '',
                                    username: widget.user.username,
                                    firstName: firstName,
                                    lastName: lastName,
                                    bio: bio,
                                    tags: tags.map((tag) => tag.label).toList()
                                  );
                                }
                                catch(e) {
                                  if(mounted) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content: Text(
                                          e.toString()
                                        ),
                                      )
                                    );
                                  }
                                }

                                if(mounted) Navigator.pop(context, true);
                              },
                              child: const Text("Save"),
                            ),
                          ),
                          const SizedBox(height: 20),
                          Divider(),
                          const SizedBox(height: 12),
                          Center(
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(TablerIcons.alert_triangle, color: Colors.red, size: 18,),
                                const SizedBox(width: 6,),
                                Text(
                                  "Danger Zone",
                                  style: GoogleFonts.montserrat(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.red,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 8),
                          ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.red
                            ),
                            onPressed: () {
                            },
                            child: Text(
                              "Delete Account",
                              style: GoogleFonts.montserrat(
                                color: Colors.white,
                                fontWeight: FontWeight.bold
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}