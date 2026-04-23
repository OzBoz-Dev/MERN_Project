import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ProfileSquare extends StatelessWidget {
  final String username;
  final String firstName;
  final String lastName;
  ProfileSquare({super.key, required this.username, required this.firstName, required this.lastName});

  final colorOptions = [
    Color(0xff1e40af),
    Color(0xff065f46),
    Color(0xff7f1d1d),
    Color(0xff5b21b6),
    Color(0xff92400e),
    Color(0xff9d174d),
    Color(0xff1f2937),
    Color(0xff78350f)
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: colorOptions[username.length % 8],
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