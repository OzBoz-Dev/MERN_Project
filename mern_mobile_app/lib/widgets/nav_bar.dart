import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:chip_in/pages/feed/feed_page.dart';
import 'package:chip_in/pages/messages/messages_page.dart';
import 'package:chip_in/pages/my-bag/my_bag_page.dart';
import 'package:chip_in/pages/profile/profile_page.dart';
import 'package:chip_in/providers/auth_provider.dart';
import 'package:chip_in/providers/navigation_provider.dart';
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
    'My Bag',
    'Messages'
  ];

  @override
  void initState() {
    super.initState();
    _pages = [
      FeedPage(),
      MyBagPage(),
      MessagesPage()
    ];

  }
  
  @override
  Widget build(BuildContext context) {

    // Contains page controller
    final navProvider = context.watch<NavigationProvider>();

    // Contains user info (username)
    final authProvider = context.watch<AuthProvider>();
    
    return Scaffold(
      extendBody: false,
      appBar: AppBar(
        title: Text(_appBarTitles[navProvider.selectedIndex],),
        centerTitle: true,
        actions: [
          IconButton(
            onPressed: () {
              if(authProvider.username != null) {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => ProfilePage(
                      username: authProvider.username!,
                      isUser: true, // Allows edits and logout
                    )
                  )
                );
              }
              else {
                return;
              }
            },
            icon: Icon(TablerIcons.user_circle)
          )
        ],
      ),
      bottomNavigationBar: NavigationBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.transparent,
        shadowColor: Colors.black,
        elevation: 1,
        onDestinationSelected: navProvider.onNavItemTapped,
        selectedIndex: navProvider.selectedIndex,
        destinations: [
          const NavigationDestination(
            icon: Icon(TablerIcons.home, color: Color(0xFFFFA500),),
            selectedIcon: Icon(TablerIcons.home, color: Colors.white,),
            label: "Feed"
          ),
          const NavigationDestination(
            icon: ImageIcon(
              AssetImage("assets/bag.png"),
              color: Color(0xFFFFA500),
            ),
            selectedIcon: ImageIcon(
              AssetImage("assets/bag.png"),
              color: Colors.white,
            ),
            label: "My Bag"
          ),
          const NavigationDestination(
            icon: Icon(TablerIcons.message, color: Color(0xFFFFA500),),
            selectedIcon: Icon(TablerIcons.message, color: Colors.white,),
            label: "Messages",
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