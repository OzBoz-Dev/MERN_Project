import 'package:flutter/material.dart';
import 'package:chip_in/models/post.dart';
import 'package:chip_in/services/content_service.dart';

class PostProvider extends ChangeNotifier {
  final ContentService _contentService = ContentService();

  final Map<String, Post> _posts = {};

  // View-specific ID lists
  final List<String> _feedIds = [];
  final List<String> _profileIds = [];
  final List<String> _likedIds = [];

  // Global UI State
  bool _isLoading = false;
  String? _error;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Pagination states for different views
  final int _limit = 10;
  int _feedOffset = 0;
  int _profileOffset = 0;
  int _likedOffset = 0;

  bool _feedHasMore = true;
  bool _profileHasMore = true;
  bool _likedHasMore = true;

  // Getters that map IDs back to the actual Post objects
  List<Post> get feedPosts => _feedIds.map((id) => _posts[id]!).toList();
  List<Post> get profilePosts => _profileIds.map((id) => _posts[id]!).toList();
  List<Post> get likedPosts => _likedIds.map((id) => _posts[id]!).toList();

  // Used for pagination when scrolling
  bool get feedHasMore => _feedHasMore;
  bool get profileHasMore => _profileHasMore;
  bool get likedHasMore => _likedHasMore;

  Post? getPostById(String postId) => _posts[postId];

  // Prevents a stale feed when switcing users
  void reset() {
    _posts.clear();
    _feedIds.clear();
    _profileIds.clear();
    _likedIds.clear();
    _feedOffset = 0;
    _profileOffset = 0;
    _likedOffset = 0;
    _error = null;
    notifyListeners();
  }

  Future<void> loadFeed(String username, {bool refresh = false}) async {
    if (_isLoading) return;

    if (refresh) {
      _feedOffset = 0;
      _feedHasMore = true;
      _feedIds.clear();
    }

    if (!_feedHasMore) return;

    await _fetchBatch(
      fetcher: () => _contentService.getFeedPosts(username, _limit, _feedOffset),
      targetIds: _feedIds,
      onComplete: (count, hasMore) {
        _feedOffset += count;
        _feedHasMore = hasMore;
      },
    );
  }

  Future<void> loadPostsByUsername(String username, {bool refresh = false}) async {
    if (_isLoading) return;

    if (refresh) {
      _profileOffset = 0;
      _profileHasMore = true;
      _profileIds.clear();
    }

    if (!_profileHasMore) return;

    await _fetchBatch(
      fetcher: () => _contentService.getPostsByUsername(username, _limit, _profileOffset),
      targetIds: _profileIds,
      onComplete: (count, hasMore) {
        _profileOffset += count;
        _profileHasMore = hasMore;
      },
    );
  }

  Future<void> loadLikedPosts(String token, {bool refresh = false}) async {
    if (_isLoading) return;

    if (refresh) {
      _likedOffset = 0;
      _likedHasMore = true;
      _likedIds.clear();
    }

    if (!_likedHasMore) return;

    await _fetchBatch(
      fetcher: () => _contentService.getLikedPosts(token, _limit, _likedOffset),
      targetIds: _likedIds,
      onComplete: (count, hasMore) {
        _likedOffset += count;
        _likedHasMore = hasMore;
      },
    );
  }

  Future<void> toggleLike({
    required String token,
    required String postId,
    required String username,
  }) async {
    final post = _posts[postId];
    if (post == null) return;

    final isLiked = post.likes.contains(username);

    // Optimistic update on the reference in the Map
    if (isLiked) {
      post.likes.remove(username);
    } else {
      post.likes.add(username);
    }

    notifyListeners(); // All lists (feed, profile, liked) rebuild with the new state

    try {
      await _contentService.likePostById(token, postId);
    } catch (e) {
      // Rollback
      if (isLiked) {
        post.likes.add(username);
      } else {
        post.likes.remove(username);
      }
      notifyListeners();
      rethrow;
    }
  }

  // Helper to reduce boilerplate
  Future<void> _fetchBatch({
    required Future<List<Post>> Function() fetcher,
    required List<String> targetIds,
    required void Function(int count, bool hasMore) onComplete,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final fetchedPosts = await fetcher();
      
      for (final post in fetchedPosts) {
        // Update the central post store
        _posts[post.id] = post;
        // Add ID to the specific view list if not already there
        if (!targetIds.contains(post.id)) {
          targetIds.add(post.id);
        }
      }

      onComplete(fetchedPosts.length, fetchedPosts.length == _limit);
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}