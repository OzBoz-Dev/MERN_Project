import 'dart:convert';

import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:chip_in/models/tag.dart';
import 'package:chip_in/models/user.dart';
import 'package:http/http.dart' as http;

class ProfileService {
  final String _baseUrl = dotenv.env['API_ENTRYPOINT'] ?? '';

  Future<User> getProfileByUserName({required String username}) async {
    final response = await http.get(
      Uri.parse("$_baseUrl/profile/$username"),
      headers: {
        "Content-Type": "application/json"
      }
    );
    final data = jsonDecode(response.body) as Map<String, dynamic>;

    if(response.statusCode != 200) {
      throw Exception(data['error']);
    }
    else {
      return User(
        username: data['username'],
        firstName: data['firstName'],
        lastName: data['lastName'],
        bio: data['bio'] ?? "",
        tags: (data['tags'] as List<dynamic>? ?? [])
      .map((tag) => Tag(label: tag as String))
      .toList(),
      );
    }
  }

}