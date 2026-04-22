import 'package:chip_in/providers/conversation_provider.dart';
import 'package:chip_in/providers/feed_provider.dart';
import 'package:chip_in/providers/profile_post_provider.dart';
import 'package:chip_in/services/socket_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_quill/flutter_quill.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:chip_in/pages/login/login_page.dart';
import 'package:chip_in/pages/signup/signup_page.dart';
import 'package:chip_in/providers/auth_provider.dart';
import 'package:chip_in/providers/navigation_provider.dart';
import 'package:chip_in/services/shared_prefs_service.dart';
import 'package:chip_in/themes/styles.dart';
import 'package:chip_in/widgets/nav_bar.dart';
import 'package:provider/provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Load env
  await dotenv.load(fileName: ".env");
  // Init cache
  await SharedPrefsService.init();

  // Create AuthProvider instance first
  final authProvider = AuthProvider();

  // Attempt auto login
  authProvider.tryAutoLogin();

  // Check token expiration - logout if expired
  if(authProvider.token != null && JwtDecoder.isExpired(authProvider.token!)) {
    authProvider.logout();
  }

  final feedProvider = FeedProvider();
  
  // Conversation Provider takes auth provider & socket service
  final socketService = SocketService();
  final conversationProvider = ConversationProvider(authProvider: authProvider, socketService: socketService);

  // Startup path: kick off the feed load before any widgets exist.
  if (authProvider.username != null) {
    feedProvider.loadFeed(authProvider.username!);
    // Init socket only if logged in
    conversationProvider.initSocket();
  }
  

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => NavigationProvider()),
        ChangeNotifierProvider.value(value: authProvider),
        ChangeNotifierProvider.value(value: feedProvider),
        ChangeNotifierProvider.value(value: conversationProvider),
        ChangeNotifierProvider(create: (_) => ProfilePostProvider())
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
      localizationsDelegates: const [
        FlutterQuillLocalizations.delegate,
      ],
      theme: lightTheme,
      home: Consumer<AuthProvider>(
        builder: (context, auth, _) {
          // Check if we have a token
          if (auth.isAuthenticated) {
            return const NavBar();
          } else {
            return const LoginPage();
          }
        },
      ),
      routes: {
        '/signup': (context) => SignupPage(),
        '/login': (context) => LoginPage(),
      },
    );
  }
}
