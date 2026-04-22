import 'package:chip_in/providers/feed_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:chip_in/providers/auth_provider.dart';
import 'package:chip_in/widgets/animated_grid_background.dart';
import 'package:provider/provider.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {

  // Text controllers
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  // Obscure passwrod
  bool _isPasswordObscured = true;

  // Form validation
  final _formKey = GlobalKey<FormState>();
  bool _isFormValid = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AnimatedGridBackground(
        backgroundColor: Color(0xFFFDF8EA),
        child: Center(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(8),
              child: Card(
                color: Theme.of(context).cardTheme.color!.withAlpha(255),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: BorderSide(
                    color: Colors.grey[300]!,
                    width: 1,
                  ),
                ),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 36),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        "Welcome Back",
                        style: GoogleFonts.montserrat(
                          fontSize: 36,
                          fontWeight: FontWeight.w700
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 48,),
                      Form(
                        key: _formKey,
                        onChanged: () {
                          setState(() {
                            _isFormValid = _formKey.currentState?.validate() ?? false;
                          });
                        },
                        child: Column(
                            children: [
                              TextFormField(
                                controller: _emailController,
                                validator: (value) {
                                  if(value == null || value.isEmpty) {
                                    return "Email is required";
                                  }
                                  return null;
                                },
                                style: TextStyle(
                                  fontSize: 14
                                ),
                                keyboardType: TextInputType.text,
                                decoration: const InputDecoration(
                                  labelText: "Email",
                                  prefixIcon: Icon(TablerIcons.mail),
                                ),
                              ),
                              const SizedBox(height: 16),
                              TextFormField(
                                controller: _passwordController,
                                validator: (value) {
                                  if(value == null || value.isEmpty) {
                                    return "Password is required";
                                  }
                                  return null;
                                },
                                style: TextStyle(
                                  fontSize: 14
                                ),
                                obscureText: _isPasswordObscured,
                                decoration: InputDecoration(
                                  labelText: "Password",
                                  prefixIcon: Icon(TablerIcons.password),
                                  suffixIcon: IconButton(
                                    onPressed: () {
                                      setState(() {
                                        _isPasswordObscured = !_isPasswordObscured;
                                      });
                                    },
                                    icon: Icon(_isPasswordObscured ? TablerIcons.eye : TablerIcons.eye_off)
                                  )
                                ),
                              ),
                              const SizedBox(height: 20),
                              // login button
                              Consumer<AuthProvider>(
                                builder: (context, authProvider, child) {
                                  if(authProvider.error != null) {
                                    WidgetsBinding.instance.addPostFrameCallback((_) {
                                      // Show error message
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(
                                          content: Text(
                                            authProvider.error!,
                                            style: GoogleFonts.montserrat(
                                              color: Colors.white
                                            ),
                                          ),
                                          backgroundColor: Colors.red,
                                        )
                                      );
                                      // Then clear it for another attempt
                                      authProvider.clearError();
                                    });
                                  }
                                  if(authProvider.isLoading) {
                                    return const SizedBox(
                                      width: double.infinity,
                                      child: ElevatedButton(
                                        onPressed: null,
                                        child: SizedBox(
                                          width: 18,
                                          height: 18,
                                          child: CircularProgressIndicator(
                                            color: Colors.white,
                                          ),
                                        ),
                                      )
                                    );
                                  }
                                  else {
                                    return SizedBox(
                                      width: double.infinity,
                                      child: ElevatedButton(
                                        onPressed: _isFormValid ? () async {
                                          final email = _emailController.text.trim();
                                          final password = _passwordController.text.trim();

                                          // Post provider which will load the feed
                                          final posts = context.read<FeedProvider>();

                                          await authProvider.login(email: email, password: password);

                                          if (authProvider.isAuthenticated) {
                                            posts.loadFeed(authProvider.username!);
                                          }

                                          if (!context.mounted) return;

                                          // No error after login - go to main page
                                          if (authProvider.error == null) {
                                            Navigator.pushReplacementNamed(context, '/');
                                          }
                                        }: null,
                                        child: Text("Log In", style: GoogleFonts.montserrat(fontWeight: FontWeight.bold),),
                                      ),
                                    );
                                  }
                                }
                              ),
                              const SizedBox(height: 20,),
                              GestureDetector(
                                onTap: () {
                                  Navigator.pushReplacementNamed(context, '/signup');
                                },
                                child: Text(
                                  "Don't have an account? Sign up",
                                  style: GoogleFonts.montserrat(
                                    fontSize: 12,
                                    decoration: TextDecoration.underline,
                                    decorationColor: Theme.of(context).primaryColor,
                                    color: Theme.of(context).primaryColor
                                  ),
                                ),
                              )
                            ],
                          ),
                      )
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      )
    );
  }
}