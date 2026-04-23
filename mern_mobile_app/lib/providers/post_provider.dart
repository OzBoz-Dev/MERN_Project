import 'package:chip_in/models/tag.dart';
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
  final List<String> _searchedIds = [];

  // UI states
  bool _isFeedLoading = false;
  bool _isProfileLoading = false;
  bool _isLikedLoading = false;
  bool _isSearchLoading = false;
  String? _feedError;
  String? _profileError;
  String? _likedError;
  String? _searchError;

  // UI State getters
  bool get isFeedLoading => _isFeedLoading;
  bool get isProfileLoading => _isProfileLoading;
  bool get isLikedLoading => _isLikedLoading;
  bool get isSearchLoading => _isSearchLoading;
  String? get feedError => _feedError;
  String? get profileError => _profileError;
  String? get likedError => _likedError;
  String? get searchError => _searchError;

  // Pagination states for different views
  final int _limit = 10;
  int _feedOffset = 0;
  int _profileOffset = 0;
  int _likedOffset = 0;
  int _searchOffset = 0;

  bool _feedHasMore = true;
  bool _profileHasMore = true;
  bool _likedHasMore = true;
  bool _searchHasMore = true;

  // Getters that map IDs back to the actual Post objects
  List<Post> get feedPosts => _feedIds.map((id) => _posts[id]!).toList();
  List<Post> get profilePosts => _profileIds.map((id) => _posts[id]!).toList();
  List<Post> get likedPosts => _likedIds.map((id) => _posts[id]!).toList();
  List<Post> get searchedPosts => _searchedIds.map((id) => _posts[id]!).toList();

  // Used for pagination when scrolling
  bool get feedHasMore => _feedHasMore;
  bool get profileHasMore => _profileHasMore;
  bool get likedHasMore => _likedHasMore;
  bool get searchHasMore => _searchHasMore;

  Post? getPostById(String postId) => _posts[postId];

  // Prevents a stale feed when switcing users
  void reset() {
    _posts.clear();
    _feedIds.clear();
    _profileIds.clear();
    _likedIds.clear();
    _searchedIds.clear();
    
    _feedOffset = 0;
    _profileOffset = 0;
    _likedOffset = 0;
    _searchOffset = 0;

    _feedHasMore = true;
    _profileHasMore = true;
    _likedHasMore = true;
    _searchHasMore = true;

    _feedError = null;
    _profileError = null;
    _likedError = null;
    _searchError = null;
    _isFeedLoading = false;
    _isProfileLoading = false;
    _isLikedLoading = false;
    _isSearchLoading = false;
    notifyListeners();
  }

  Future<void> loadFeed(String username, {bool refresh = false}) async {
    if (_isFeedLoading) return;

    if (refresh) {
      _feedOffset = 0;
      _feedHasMore = true;
      _feedIds.clear();
    }

    if (!_feedHasMore) return;

    await _fetchBatch(
      state: "feed",
      fetcher: () => _contentService.getFeedPosts(username, _limit, _feedOffset),
      targetIds: _feedIds,
      onComplete: (count, hasMore) {
        _feedOffset += count;
        _feedHasMore = hasMore;
      },
    );
  }

  Future<void> loadPostsByUsername(String username, {bool refresh = false}) async {
    if (_isProfileLoading) return;

    if (refresh) {
      _profileOffset = 0;
      _profileHasMore = true;
      _profileIds.clear();
    }

    if (!_profileHasMore) return;

    await _fetchBatch(
      state: "profile",
      fetcher: () => _contentService.getPostsByUsername(username, _limit, _profileOffset),
      targetIds: _profileIds,
      onComplete: (count, hasMore) {
        _profileOffset += count;
        _profileHasMore = hasMore;
      },
    );
  }

  Future<void> loadLikedPosts(String token, {bool refresh = false}) async {
    if (_isLikedLoading) return;

    if (refresh) {
      _likedOffset = 0;
      _likedHasMore = true;
      _likedIds.clear();
    }

    if (!_likedHasMore) return;

    await _fetchBatch(
      state: "liked",
      fetcher: () => _contentService.getLikedPosts(token, _limit, _likedOffset),
      targetIds: _likedIds,
      onComplete: (count, hasMore) {
        _likedOffset += count;
        _likedHasMore = hasMore;
      },
    );
  }

  Future<void> searchPosts(String searchQuery, List<Tag> tags, DateTime? startDate, DateTime? endDate, {bool refresh = false}) async {
    if (_isSearchLoading) return;

    if (refresh) {
      _searchOffset = 0;
      _searchHasMore = true;
      _searchedIds.clear();
    }

    if (!_searchHasMore) return;

    await _fetchBatch(
      state: "search",
      fetcher: () => _contentService.searchPosts(searchQuery, _limit, _searchOffset, tags, startDate, endDate),
      targetIds: _searchedIds,
      onComplete: (count, hasMore) {
        _searchOffset += count;
        _searchHasMore = hasMore;
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
    required String state,
    required Future<List<Post>> Function() fetcher,
    required List<String> targetIds,
    required void Function(int count, bool hasMore) onComplete,
  }) async {

    switch(state) {
      case "feed":
        _isFeedLoading = true;
        _feedError = null;
        break;
      case "profile":
        _isProfileLoading = true;
        _profileError = null;
        break;
      case "liked":
        _isLikedLoading = true;
        _likedError = null;
        break;
      case "search":
        _isSearchLoading = true;
        _searchError = null;
        break;
    }
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
      switch(state) {
        case "feed":
          _feedError = e.toString();
          break;
        case "profile":
          _profileError = e.toString();
          break;
        case "liked":
          _likedError = e.toString();
          break;
        case "search":
          _searchError = e.toString();
          break;
      }
    } finally {
      switch(state) {
        case "feed":
          _isFeedLoading = false;
          break;
        case "profile":
         _isProfileLoading = false;
          break;
        case "liked":
          _isLikedLoading = false;
          break;
        case "search":
          _isSearchLoading = false;
          break;
      }
      notifyListeners();
    }
  }
}