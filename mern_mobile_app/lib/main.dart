import 'package:flutter/material.dart';
import 'package:mern_mobile_app/providers/navigation_provider.dart';
import 'package:mern_mobile_app/themes/styles.dart';
import 'package:mern_mobile_app/widgets/nav_bar.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => NavigationProvider())
      ],
      child: MainApp(),
    )
  );
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: lightTheme,
      home: NavBar(),
    );
  }
}
