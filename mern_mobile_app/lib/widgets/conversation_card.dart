import 'package:chip_in/models/conversation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:timeago_flutter/timeago_flutter.dart' as timeago;

class ConversationCard extends StatelessWidget {
  final Conversation conversation;
  final String currentUsername;
  final VoidCallback onTap;

  const ConversationCard({
    super.key,
    required this.conversation,
    required this.currentUsername,
    required this.onTap,
  });

  String _buildMembersLine() {
    // Show all members except the current user
    final others = conversation.memberUsernames
        .where((u) => u != currentUsername)
        .toList();
    if (others.isEmpty) return "You";
    return others.join(", ");
  }

  String _buildPreview() {
    final last = conversation.lastMessage;
    if (last == null) return "No messages yet";
    final prefix = last.authorUsername == currentUsername ? "You: " : "${last.authorUsername}: ";
    return "$prefix${last.content}";
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Stack(
          children: [
            // left edge highlight
            Positioned(
              left: 0,
              top: 0,
              bottom: 0,
              width: 8,
              child: Container(
                color: const Color(0xFFffe082),
              ),
            ),
            // Main content
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        conversation.memberUsernames.isNotEmpty
                          ? TablerIcons.users_group
                          : TablerIcons.user,
                        color: Color(0xFFFFA500),
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          _buildMembersLine(),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.montserrat(
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                            color: const Color(0xFFFFA500),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        conversation.lastMessage != null
                          ? timeago.format(conversation.lastMessage!.createdAt)
                          : timeago.format(conversation.updatedAt),
                        style: Theme.of(context)
                            .textTheme
                            .bodySmall
                            ?.copyWith(color: Colors.grey),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _buildPreview(),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.montserrat(
                      fontSize: 14,
                      color: Colors.black87,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}