import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ProfileSquare extends StatelessWidget {
  final String firstName;
  final String lastName;
  const ProfileSquare({super.key, required this.firstName, required this.lastName});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.blue,
        borderRadius: BorderRadius.circular(14)
      ),
      child: Text(
        "${firstName[0]}${lastName[0]}",
        style: GoogleFonts.montserrat(
          fontSize: 28,
          fontWeight: FontWeight.w800,
          color: Colors.white
        ),
      ),
    );
  }
}