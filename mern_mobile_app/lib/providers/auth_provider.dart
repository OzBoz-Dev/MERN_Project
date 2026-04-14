import 'package:flutter/material.dart';

class AuthProvider with ChangeNotifier {
  bool _isLoggedIn = false;
  bool get isLoggedIn => _isLoggedIn;

  // Future<void> checkLoginStatus() async {
  //   // Example: check token from storage
  //   await Future.delayed(Duration(seconds: 1));
  //   _isLoggedIn = false; // or true if token exists
  //   notifyListeners();
  // }
}