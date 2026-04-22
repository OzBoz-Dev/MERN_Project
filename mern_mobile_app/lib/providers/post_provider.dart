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

  // Pagination for feed
  final int _limit = 10;
  int _offset = 0;
  bool _hasMore = true;
  bool get hasMore => _hasMore;

  // Used for likes
  Post? getPostById(String postId) => _posts[postId];

  // Prevents a stale feed when switcing users
  void reset() {
    _posts.clear();
    _error = null;
    _isLoading = false;
    notifyListeners();
  }

  Future<void> loadFeed(String username, {bool refresh = false}) async {
    if (_isLoading) return;

     if (refresh) {
      _offset = 0;
      _hasMore = true;
      _posts.clear();
    }

    if (!_hasMore) return;

    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final fetchedPosts = await _contentService.getFeedPosts(username, _limit, _offset);

      if (fetchedPosts.length < _limit) {
        _hasMore = false;
      }

      for (final post in fetchedPosts) {
        _posts[post.id] = post;
      }

      _offset += fetchedPosts.length;
      _hasLoaded = true;
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  // Convenience function
  Future<void> loadMore(String username) async {
    await loadFeed(username);
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