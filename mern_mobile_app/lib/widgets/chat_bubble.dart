import 'package:chip_in/models/message.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';

class ChatBubble extends StatelessWidget {
  final Message message;
  final bool isSelf;

  const ChatBubble({super.key, required this.message, required this.isSelf});

  @override
  Widget build(BuildContext context) {
    final bgColor = isSelf ? const Color(0xFFFFA500) : Colors.white;
    final textColor = isSelf ? Colors.white :const Color(0xFFFFA500);
    final timeColor = isSelf
        ? Colors.white.withAlpha(200)
        : const Color(0xFFFFA500).withAlpha(200);
    final authorLabel = isSelf ? "You" : message.authorUsername;
    final timeText = DateFormat('h:mm a').format(message.createdAt);

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment:
            isSelf ? CrossAxisAlignment.end : CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(left: 4, right: 4, bottom: 4),
            child: Text(
              authorLabel,
              style: GoogleFonts.montserrat(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: Colors.grey.shade600,
              ),
            ),
          ),
          Container(
            constraints: BoxConstraints(
              maxWidth: MediaQuery.of(context).size.width * 0.72,
            ),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: bgColor,
              borderRadius: BorderRadius.only(
                topLeft: const Radius.circular(16),
                topRight: const Radius.circular(16),
                bottomLeft: Radius.circular(isSelf ? 16 : 4),
                bottomRight: Radius.circular(isSelf ? 4 : 16),
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withAlpha(50),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment:
                  isSelf ? CrossAxisAlignment.end : CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  message.content,
                  style: GoogleFonts.montserrat(
                    fontSize: 14,
                    color: textColor,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  timeText,
                  style: GoogleFonts.montserrat(
                    fontSize: 10,
                    color: timeColor,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}