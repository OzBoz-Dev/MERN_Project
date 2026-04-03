import 'package:flutter/material.dart';
import 'package:mern_mobile_app/themes/styles.dart';
import 'package:mern_mobile_app/pages/feed/feed_page.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: lightTheme,
      home: FeedPage()
    );
  }
}
