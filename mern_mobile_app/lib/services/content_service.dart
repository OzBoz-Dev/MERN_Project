// Deals with posts, comments, tags 
import 'dart:convert';

import 'package:chip_in/models/tag.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;

class ContentService {
  final String _baseUrl = dotenv.env['API_ENTRYPOINT'] ?? '';

  Future<List<Tag>> searchTagsByValue(String value) async {
    final response = await http.get(
      Uri.parse("$_baseUrl/tags/$value"),
      headers: {
        "Content-Type": "application/json"
      }
    );
    final data = jsonDecode(response.body);
    if(response.statusCode != 200) {
      throw Exception(data['error']);
    }
    else {
      final List<Tag> tags = (data as List).map((tag) => Tag(label: tag['value'])).toList();
      return tags;
    }
  }

}