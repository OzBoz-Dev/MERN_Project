import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:chip_in/models/user.dart';
import 'package:chip_in/providers/auth_provider.dart';
import 'package:chip_in/services/profile_service.dart';
import 'package:chip_in/widgets/animated_grid_background.dart';
import 'package:chip_in/widgets/profile_square.dart';
import 'package:chip_in/widgets/tag_container.dart';
import 'package:provider/provider.dart';

class ProfilePage extends StatefulWidget {
  final String username;
  final bool? isUser;
  const ProfilePage({super.key, required this.username, this.isUser});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {

  // Profile service
  final profileService = ProfileService();

  // The user whose data will be displayed on this page
  late Future<User> _userFuture;

  @override
  void initState() {
    super.initState();
    _userFuture = profileService.getProfileByUserName(username: widget.username);
  }

  // Get user by username
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Profile"), centerTitle: true,),
      body: AnimatedGridBackground(
        backgroundColor: const Color(0xFFFDF8EA),
        child: Center(
          child: FutureBuilder(
            future: _userFuture,
            builder: (context, snapshot) {
              if(snapshot.hasError) {
                return Text("Error Occurred: ${snapshot.error}");
              }
              else if(snapshot.hasData) {
                final user = snapshot.data!;
                return SingleChildScrollView(
                  child: Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: SizedBox(
                      width: double.infinity,
                      child: Card(
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                          side: BorderSide(
                            color: Colors.grey[300]!,
                            width: 1,
                          ),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(24),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              // Only allow edits and logout if its the user's profile
                              (widget.isUser == true) ? Row(
                                mainAxisAlignment: MainAxisAlignment.end,
                                children: [
                                  IconButton(
                                    style: IconButton.styleFrom(
                                      backgroundColor: Color(0xFFFFA500),
                                      foregroundColor: Colors.white,
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(6)
                                      )
                                    ),
                                    onPressed: () {}, icon: Icon(TablerIcons.pencil)
                                  ),
                                  const SizedBox(width: 4,),
                                  Consumer<AuthProvider>(
                                    builder: (context, authProvider, child) {
                                      return IconButton(
                                        style: IconButton.styleFrom(
                                          backgroundColor: Colors.red,
                                          foregroundColor: Colors.white,
                                          shape: RoundedRectangleBorder(
                                            borderRadius: BorderRadius.circular(6)
                                          )
                                        ),
                                        onPressed: () async {
                                          // Log out
                                          await authProvider.logout();
                                          if(mounted) {
                                            Navigator.pop(context);
                                          }
                                        }, icon: Icon(TablerIcons.logout)
                                      );
                                    },
                                  )
                                ],
                              ) : SizedBox.shrink(),
                              const SizedBox(height: 16,),
                              ProfileSquare(firstName: user.firstName, lastName: user.lastName),
                              const SizedBox(height: 16,),
                              Text(
                                "${user.firstName} ${user.lastName}",
                                textAlign: TextAlign.center,
                                style: GoogleFonts.montserrat(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w800
                                ),
                              ),
                              const SizedBox(height: 2,),
                              Text(
                                user.username,
                                textAlign: TextAlign.center,
                                style: GoogleFonts.montserrat(
                                  fontStyle: FontStyle.italic
                                ),
                              ),
                              const SizedBox(height: 16,),
                              Text(
                                user.bio.isEmpty ? "No Bio" : user.bio,
                                textAlign: TextAlign.center,
                                style: GoogleFonts.montserrat(
                                  color: Colors.grey[600]
                                ),
                              ),
                              const SizedBox(height: 16,),
                              Divider(),
                              const SizedBox(height: 4,),
                              SizedBox(
                                height: 35,
                                child: user.tags.isEmpty ? Text("No tags") : ListView.separated(
                                  scrollDirection: Axis.horizontal,
                                  itemCount: user.tags.length,
                                  itemBuilder: (context, index) {
                                    return TagContainer(tag: user.tags[index]);
                                  },
                                  separatorBuilder: (context, index) => const SizedBox(width: 5,),
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
              else {
                return CircularProgressIndicator(
                  color: Color(0xFFFFA500),
                );
              }
            }
          ),
        )
      ),
    );
  }
}