import 'package:flutter/material.dart';

class NavigationProvider with ChangeNotifier {
  late final PageController controller;
  int _selectedIndex = 0;
  
  NavigationProvider([this._selectedIndex = 0]) {
    controller = PageController(initialPage: _selectedIndex);
  }

  int get selectedIndex => _selectedIndex;

  void onNavItemTapped(int index) {
    if(_selectedIndex != index) {
      _selectedIndex = index;
      controller.jumpToPage(index);
    }
    notifyListeners();
  }

  void onPageChanged(int index) {
    _selectedIndex = index;
    notifyListeners();
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }
}
