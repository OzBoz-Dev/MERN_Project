import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:mern_mobile_app/pages/feed/feed_page.dart';
import 'package:mern_mobile_app/pages/messages/messages_page.dart';
import 'package:mern_mobile_app/pages/my-projects/my_projects_page.dart';
import 'package:mern_mobile_app/providers/navigation_provider.dart';
import 'package:provider/provider.dart';

class NavBar extends StatefulWidget {
  const NavBar({super.key});

  @override
  State<NavBar> createState() => _NavBarState();
}

class _NavBarState extends State<NavBar> {

  // List of pages for the navigation bar
  late List<Widget> _pages;

  final List<String> _appBarTitles = [
    'Feed',
    'My Projects',
    'Messages'
  ];

  @override
  void initState() {
    super.initState();
    _pages = [
      FeedPage(),
      MyProjectsPage(),
      MessagesPage()
    ];

  }
  
  @override
  Widget build(BuildContext context) {
    // Contains page controller
    final navProvider = context.watch<NavigationProvider>();
    
    return Scaffold(
      extendBody: false,
      appBar: AppBar(title: Text(_appBarTitles[navProvider.selectedIndex],), centerTitle: true,),
      bottomNavigationBar: NavigationBar(
        onDestinationSelected: navProvider.onNavItemTapped,
        selectedIndex: navProvider.selectedIndex,
        destinations: [
          NavigationDestination(
            icon: Icon(TablerIcons.home),
            selectedIcon: Icon(TablerIcons.home, color: Colors.white,),
            label: "Feed"
          ),
          NavigationDestination(
            icon: Icon(TablerIcons.code),
            selectedIcon: Icon(TablerIcons.code, color: Colors.white,),
            label: "My Projects"
          ),
          NavigationDestination(
            icon: Icon(TablerIcons.message),
            selectedIcon: Icon(TablerIcons.message, color: Colors.white,),
            label: "Messages"
          ),
        ],
        
      ),
      body: PageView(
        controller: navProvider.controller,
        onPageChanged: navProvider.onPageChanged,
        children: _pages,
      ),
    );
  }
}