import 'package:flutter/material.dart';
import 'package:chip_in/models/post.dart';
import 'package:chip_in/services/content_service.dart';

class PostProvider extends ChangeNotifier {
  final ContentService _contentService = ContentService();

  // O(1) lookup by postId
  final Map<String, Post> _posts = {};

  bool _isLoading = false;
  bool _hasLoaded = false;
  String? _error;

  List<Post> get posts => _posts.values.toList();
  bool get isLoading => _isLoading;
  bool get hasLoaded => _hasLoaded;
  String? get error => _error;

  // Used for likes
  Post? getPostById(String postId) => _posts[postId];

  Future<void> loadFeed(String username) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final fetchedPosts = await _contentService.getFeedPosts(username);

      _posts.clear();

      for (final post in fetchedPosts) {
        _posts[post.id] = post; // Populate the map of posts by post id
      }
      _hasLoaded = true;
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> toggleLike({
    required String token,
    required String postId,
    required String username,
  }) async {
    // Efficiently get the post by id
    final post = _posts[postId];
    if (post == null) return;

    final isLiked = post.likes.contains(username); // O(1)

    // optimistic update
    if (isLiked) {
      post.likes.remove(username);
    } else {
      post.likes.add(username);
    }

    notifyListeners(); // Show updates on all pages

    try {
      await _contentService.likePostById(token, postId);
    } catch (e) {
      // rollback on error
      if (isLiked) {
        post.likes.add(username);
      } else {
        post.likes.remove(username);
      }

      notifyListeners();
      rethrow; // Catch in 
    }
  }
}