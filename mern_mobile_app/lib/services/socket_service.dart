import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

class SocketService {
  io.Socket? _socket;
  final String _baseUrl = dotenv.env['API_ENTRYPOINT']?.replaceAll("/api", "") ?? '';

  void connect(String token) {
    _socket = io.io(
      _baseUrl,
      io.OptionBuilder()
          .setTransports(['websocket'])
          .setAuth({'token': token})
          .enableWithCredentials()
          .disableAutoConnect()
          .build(),
    );

    _socket!.connect();
  }

  void joinConversation(String conversationId) {
    _socket?.emit('joinConversation', conversationId);
  }

  void sendMessage(String conversationId, String content) {
    _socket?.emit('sendMessage', {
      'conversationId': conversationId,
      'content': content,
    });
  }

  void onNewMessage(void Function(dynamic data) handler) {
    _socket?.on('newMessage', handler);
  }

  void dispose() {
    _socket?.dispose();
    _socket = null;
  }
}