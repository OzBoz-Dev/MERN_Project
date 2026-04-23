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

  Future<void> editProfile({
    required String token,
    required String username,
    required String firstName,
    required String lastName,
    required String bio,
    required List<String> tags
  }) async {
    final response = await http.put(
      Uri.parse("$_baseUrl/profile/$username"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      },
      body: jsonEncode({
        "data": {
          "firstName": firstName,
          "lastName": lastName,
          "bio": bio,
          "tags": tags,
        }
      })
    );
    final data = jsonDecode(response.body) as Map<String, dynamic>;
    if(response.statusCode != 200) {
      throw Exception(data['error']);
    }
  }

  Future<void> deleteProfile({
    required String token,
    required String username,
    required String password
  }) async {
    final response = await http.delete(
      Uri.parse("$_baseUrl/profile/$username"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      },
      body: jsonEncode({
        "password": password
      })
    );
    final data = jsonDecode(response.body) as Map<String, dynamic>;
    if(response.statusCode != 200) {
      throw Exception(data['error']);
    }
  }

  // Used to search users
  Future<List<User>> searchProfileByUsername({
    required String username
  }) async {
    final response = await http.get(
      Uri.parse("$_baseUrl/profile/search/$username"),
      headers: {
        "Content-Type": "application/json"
      }
    );
    final data = jsonDecode(response.body);
    if(response.statusCode != 200) {
      throw Exception(data['error']);
    }
    else {
      return (data as List).map((user) => User(
        username: user['username'],
        firstName: user['firstName'],
        lastName: user['lastName'],
        bio: user['bio'] ?? "",
        tags: (user['tags'] as List<dynamic>? ?? []).map((tag) => Tag(label: tag as String)).toList()
      )).toList();
    }
  }

}