import 'package:flutter/material.dart';
import 'package:mern_mobile_app/pages/login/login_page.dart';
import 'package:mern_mobile_app/pages/profile/profile_page.dart';
import 'package:mern_mobile_app/pages/signup/signup_page.dart';
import 'package:mern_mobile_app/providers/auth_provider.dart';
import 'package:mern_mobile_app/providers/navigation_provider.dart';
import 'package:mern_mobile_app/services/shared_prefs_service.dart';
import 'package:mern_mobile_app/themes/styles.dart';
import 'package:mern_mobile_app/widgets/nav_bar.dart';
import 'package:provider/provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Init cache
  await SharedPrefsService.init();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => NavigationProvider()),
        ChangeNotifierProvider(create: (_) => AuthProvider())
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
      initialRoute: '/', // Lead user to sign up before using
      routes: {
        '/': (context) => NavBar(),
        '/signup': (context) => SignupPage(),
        '/login': (context) => LoginPage(),
        '/profile': (context) => ProfilePage()
      },
    );
  }
}
