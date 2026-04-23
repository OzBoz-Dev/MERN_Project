import 'package:chip_in/models/user.dart';
import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';

class UserContainer extends StatelessWidget {
  final User user;

  const UserContainer({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color.fromARGB(255, 255, 241, 214),
        borderRadius: BorderRadius.circular(12),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            user.username,
            style: const TextStyle(
              color: Color(0xFFFFA500),
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(width: 6),
          const Icon(
            TablerIcons.circle_x_filled,
            size: 24,
            color: Color(0xFFFFA500),
          ),
        ],
      ),
    );
  }
}