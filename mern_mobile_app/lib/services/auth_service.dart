import 'dart:convert';

import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:mern_mobile_app/services/shared_prefs_service.dart';

class AuthService {
  final String _baseUrl = dotenv.env['API_ENTRYPOINT'] ?? '';
  static const String _tokenKey = 'token';

  // Token management
  Future<void> saveToken(String token) async {
    await SharedPrefsService.instance.setString(_tokenKey, token);
  }

  String? getToken() {
    return SharedPrefsService.instance.getString(_tokenKey);
  }

  Future<void> clearToken() async {
    await SharedPrefsService.instance.remove(_tokenKey);
  }

  // Signup
  Future<Map<String, dynamic>> signup({
    required String username,
    required String email,
    required String password,
    required String firstName,
    required String lastName,
  }) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/auth/signup'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'email': email,
        'password': password,
        'firstName': firstName,
        'lastName': lastName,
      }),
    );

    final data = jsonDecode(response.body) as Map<String, dynamic>;

    if (response.statusCode == 201) {
      return data;
    } else {
      throw Exception(data['error'] ?? 'Signup failed');
    }
  }

  // Login
  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );

    final data = jsonDecode(response.body) as Map<String, dynamic>;

    if (response.statusCode == 200) {
      if (data['token'] != null) {
        await saveToken(data['token']);
      }
      return data;
    } else {
      throw Exception(data['error'] ?? 'Login failed');
    }
  }

  // Resend verification email
  Future<Map<String, dynamic>> resendVerification(String email) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/auth/resend-verification'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email}),
    );

    final data = jsonDecode(response.body) as Map<String, dynamic>;

    if (response.statusCode == 200) {
      return data;
    } else {
      throw Exception(
          data['error'] ?? 'Failed to resend verification email');
    }
  }

  // Get current user
  Future<Map<String, dynamic>> getMe() async {
    final token = getToken();
    if (token == null) {
      throw Exception('No authentication token found');
    }

    final response = await http.get(
      Uri.parse('$_baseUrl/auth/me'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    final data = jsonDecode(response.body) as Map<String, dynamic>;

    if (response.statusCode == 200) {
      return data;
    } else {
      throw Exception(data['error'] ?? 'Failed to fetch user');
    }
  }
}