// Deals with posts, comments, tags 
import 'dart:convert';

import 'package:chip_in/models/comment.dart';
import 'package:chip_in/models/post.dart';
import 'package:chip_in/models/tag.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:objectid/objectid.dart';

class ContentService {
  final String _baseUrl = dotenv.env['API_ENTRYPOINT'] ?? '';

  // POSTS
  // Get feed posts - matches user tags to posts
  Future<List<Post>> getFeedPosts(String username) async {
    final response = await http.get(
      Uri.parse("$_baseUrl/posts/for-you/$username"),
      headers: {
        "Content-Type": "application/json"
      }
    );
    final data = jsonDecode(response.body);
    if(response.statusCode != 200) {
      throw Exception(data['error'] ?? data['message']);
    }
    else {
      try {
        final List<Post> feedPosts = (data as List).map(
          (post) => Post(
            id: post['_id'],
            title: post['title'],
            body: post['body'],
            likes: (post['likes'] as List).map((usernameLiked) => usernameLiked as String).toSet(),
            tags: (post['array_tags'] as List).map((tag) => Tag(label: tag)).toList(),
            authorUsername: post['author_username'],
            datePosted: ObjectId.fromHexString(post['_id']).timestamp
          )
        ).toList();
        return feedPosts;
      }
      catch(e) {
        rethrow;
      }
    }
  }

  // Likes a post
  Future<void> likePostById(String token, String postId) async {
    final response = await http.post(
      Uri.parse("$_baseUrl/posts/likes/$postId"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      },
    );
    final data = jsonDecode(response.body);
    if(response.statusCode == 404 || response.statusCode == 500) {
      throw Exception(data['error']);
    }
  }

  // COMMENTS
  // Fetch comments by post id
  Future<List<Comment>> getCommentsByPostId(String postId) async {
    final response = await http.get(
      Uri.parse("$_baseUrl/comments/post/$postId"),
      headers: {
        "Content-Type": "application/json"
      }
    );
    final data = jsonDecode(response.body);
    if(response.statusCode != 200) {
      throw Exception(data['error']);
    }
    else {
      final List<Comment> comments = (data as List).map(
        (comment) => Comment(
          id: comment['_id'],
          authorUsername: comment['author_username'],
          body: comment['body'],
          likes: (comment['likes'] as List).map((usernameLiked) => usernameLiked as String).toSet(),
          postIdBelong: comment['post_id_belong'],
          datePosted: ObjectId.fromHexString(comment['_id']).timestamp
        )
      ).toList();
      return comments;
    }
  }

  // Like comment by id
  Future<void> likeCommentById(String token, String commentId) async {
    final response = await http.post(
      Uri.parse("$_baseUrl/comments/likes/$commentId"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      },
    );
    final data = jsonDecode(response.body);
    if(response.statusCode == 404 || response.statusCode == 500) {
      throw Exception(data['error']);
    }
  }

  // TAGS
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