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
  Future<List<Post>> getFeedPosts(String username, int limit, int offset) async {
    final response = await http.get(
      Uri.parse("$_baseUrl/posts/for-you/$username?limit=$limit&offset=$offset"),
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

  // Get recent posts by user
  Future<List<Post>> getPostsByUsername(String username, int limit, int offset) async {
    final response = await http.get(
      Uri.parse("$_baseUrl/posts/by-user/$username?limit=$limit&offset=$offset"),
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
        final List<Post> userPosts = (data as List).map(
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
        return userPosts;
      }
      catch(e) {
        rethrow;
      }
    }
  }

  // Get posts a user has liked
  Future<List<Post>> getLikedPosts(String token, int limit, int offset) async {
    final response = await http.get(
      Uri.parse("$_baseUrl/my-projects/liked?limit=$limit&offset=$offset"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      }
    );
    final data = jsonDecode(response.body);
    if(response.statusCode != 200) {
      throw Exception(data['error'] ?? data['message']);
    }
    else {
      try {
        final List<Post> userPosts = (data as List).map(
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
        return userPosts;
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

  // Create a new post
  Future<String> createPost(String token, String title, String body, List<String> arrayTags) async {
    final response = await http.post(
      Uri.parse("$_baseUrl/posts/"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
      body: jsonEncode({
        "title": title,
        "body": body,
        "attachments": "",
        "likes": List<String>.empty(),
        "array_tags": arrayTags,
      }),
    );
    final data = jsonDecode(response.body);
    if (response.statusCode != 201) {
      throw Exception(data['error'] ?? data['message'] ?? "Failed to create post");
    }
    return data['_id'] as String;
  }

  // COMMENTS
  // Post a comment
  Future<Comment> postComment(String token, String postId, String commentBody,) async {
    final response = await http.post(
      Uri.parse("$_baseUrl/comments/"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      },
      body: jsonEncode({
        "body": commentBody,
        "post_id_belong": postId,
        "likes": List<String>.empty() // no likes initially
      })
    );
    final data = jsonDecode(response.body);
    if(response.statusCode != 201) {
      throw Exception(data['error']);
    }
    else {
      return Comment(
        id: data['_id'],
        authorUsername: data['author_username'],
        body: data['body'],
        likes: (data['likes'] as List).map((usernameLiked) => usernameLiked as String).toList().toSet(),
        postIdBelong: data['post_id_belong'],
        datePosted: ObjectId.fromHexString(data['_id']).timestamp
      );
    }
  }

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
      ).toList().reversed.toList(); // Reversed to bring newest comments to the top
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