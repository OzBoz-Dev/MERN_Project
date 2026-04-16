import 'package:flutter/foundation.dart';
import 'package:mern_mobile_app/services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();

  bool _isLoading = false;
  String? _error;
  String? _token;
  String? _username;

  bool get isLoading => _isLoading;
  String? get error => _error;
  String? get token => _token;
  String? get username => _username;
  bool get isAuthenticated => _token != null;

  void clearError() {
    _error = null;
    notifyListeners();
  }

  /// Attempt to restore a previously-saved token on app start
  void tryAutoLogin() {
    // Try to get stored token
    _token = _authService.getToken();
    // Try to get stored username
    _username = _authService.getUsername();
    notifyListeners();
  }


  Future<void> signup({
    required String username,
    required String email,
    required String password,
    required String firstName,
    required String lastName,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _authService.signup(
        username: username,
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      );
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _isLoading = false;
      _error = e.toString().replaceFirst('Exception: ', '');
      notifyListeners();
    }
  }

  Future<void> login({
    required String email,
    required String password,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final data = await _authService.login(
        email: email,
        password: password,
      );
      _token = data['token'];
      _username = data['user']?['username'];
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _isLoading = false;
      _error = e.toString().replaceFirst('Exception: ', '');
      notifyListeners();
    }
  }

  Future<void> resendVerification(String email) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _authService.resendVerification(email);
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _isLoading = false;
      _error = e.toString().replaceFirst('Exception: ', '');
      notifyListeners();
    }
  }

  Future<void> fetchCurrentUser() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final data = await _authService.getMe();
      _username = data['user']?['username'];
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _isLoading = false;
      _error = e.toString().replaceFirst('Exception: ', '');
      notifyListeners();
    }
  }

  // Logout - clears token and username
  Future<void> logout() async {
    await _authService.clearToken();
    await _authService.clearUsername();
    _token = null;
    _username = null;
    _error = null;
    notifyListeners();
  }
}