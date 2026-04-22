import 'package:chip_in/providers/auth_provider.dart';
import 'package:chip_in/providers/conversation_provider.dart';
import 'package:chip_in/widgets/chat_bubble.dart';
import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

class ChatPage extends StatefulWidget {
  final String conversationId;

  const ChatPage({
    super.key,
    required this.conversationId
  });

  @override
  State<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  final _inputController = TextEditingController();
  final _scrollController = ScrollController();

  String _formatMessageDate(DateTime date) {
    final now = DateTime.now();

    final today = DateTime(now.year, now.month, now.day);
    final msgDay = DateTime(date.year, date.month, date.day);

    final diff = today.difference(msgDay).inDays;

    if (diff == 0) return "Today";
    if (diff == 1) return "Yesterday";

    return DateFormat('MMM d, yyyy').format(date);
  }

  List<dynamic> _buildMessageList(List messages) {
    List<dynamic> items = [];

    DateTime? lastDate;

    for (final msg in messages) {
      final msgDate = DateTime(
        msg.createdAt.year,
        msg.createdAt.month,
        msg.createdAt.day,
      );

      if (lastDate == null || msgDate != lastDate) {
        items.add(msgDate);
        lastDate = msgDate;
      }

      items.add(msg);
    }

    return items;
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!_scrollController.hasClients) return;
      _scrollController.animateTo(
        0.0,
        duration: const Duration(milliseconds: 250),
        curve: Curves.easeOut,
      );
    });
  }

  @override
  void initState() {
    super.initState();
    final provider = context.read<ConversationProvider>();
    provider.setActiveConversation(widget.conversationId);
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.read<AuthProvider>();
    final conversationProvider = context.watch<ConversationProvider>();
    final conversation = conversationProvider.getConversationById(widget.conversationId);
    final messages = conversation?.messages ?? [];
    final items = _buildMessageList(messages).reversed.toList();

    final currentUsername = authProvider.username!;
    List<String> others = ["None"];
    if(conversation != null) {
      others = conversation.memberUsernames
        .where((u) => u != currentUsername)
        .toList();
    }

    final headerTitle = others.isEmpty ? "You" : others.join(", ");
    return Scaffold(
      appBar: AppBar(
        elevation: 1,
        title: Row(
          children: [
            Icon(
              others.length > 1 ? TablerIcons.users_group : TablerIcons.user,
              color: Color(0xFFFFA500),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                headerTitle,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: GoogleFonts.montserrat(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFFFFA500),
                ),
              ),
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: messages.isEmpty
            ? Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: const [
                    Icon(
                      TablerIcons.message_dots,
                      size: 48,
                      color: Colors.grey,
                    ),
                    SizedBox(height: 12),
                    Text(
                      "No messages yet",
                      style: TextStyle(
                        color: Colors.grey,
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    SizedBox(height: 6),
                    Text(
                      "Start the conversation!",
                      style: TextStyle(color: Colors.grey),
                    ),
                  ],
                ),
              )
             : ListView.builder(
              reverse: true,
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              itemCount: items.length,
              itemBuilder: (context, index) {
                final item = items[index];
                if (item is DateTime) {
                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Expanded(child: Divider()),
                        const SizedBox(width: 12,),
                        Text(_formatMessageDate(item)),
                        const SizedBox(width: 12,),
                        Expanded(child: Divider())
                      ],
                    ),
                  );
                }
                else {
                  final isSelf = item.authorUsername == currentUsername;
                  return ChatBubble(message: item, isSelf: isSelf);
                }
              },
            )
          ),
          SafeArea(
            top: false,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.white,
                border: Border(
                  top: BorderSide(color: Colors.grey.shade300),
                ),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _inputController,
                      textInputAction: TextInputAction.send,
                      onSubmitted: (_) {},
                      decoration: InputDecoration(
                        hintText: "Type a message...",
                        contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 12),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: BorderSide(color: Colors.grey.shade300),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: BorderSide(color: Colors.grey.shade300),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: const BorderSide(color: Color(0xFFFFA500)),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 6),
                  IconButton(
                    style: IconButton.styleFrom(
                      backgroundColor: const Color(0xFFFFA500)
                    ),
                    onPressed: () async {
                      final text = _inputController.text.trim();
                      if (text.isEmpty) return;

                      _inputController.clear();

                      await context
                          .read<ConversationProvider>()
                          .sendMessage(widget.conversationId, text);

                      _scrollToBottom();
                    },
                    icon: const Icon(Icons.send_rounded, color: Colors.white, size: 20),
                  )
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    super.dispose();
    _inputController.dispose();
    _scrollController.dispose();
  }
}