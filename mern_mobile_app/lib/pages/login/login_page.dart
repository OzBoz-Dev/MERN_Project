import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mern_mobile_app/widgets/animated_grid_background.dart';

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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Log In"), centerTitle: true,),
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
                        child: Column(
                            children: [
                              TextFormField(
                                controller: _emailController,
                                keyboardType: TextInputType.text,
                                decoration: const InputDecoration(
                                  labelText: "Email",
                                  prefixIcon: Icon(TablerIcons.mail),
                                ),
                              ),
                              const SizedBox(height: 16),
                              TextFormField(
                                controller: _passwordController,
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
                              SizedBox(
                                width: double.infinity,
                                child: ElevatedButton(
                                  onPressed: () {
                                    final email = _emailController.text;
                                    final password = _passwordController.text;
                  
                                    debugPrint("email: $email");
                                    debugPrint("Password: $password");
                  
                                    // TODO: call AuthProvider login
                                  },
                                  child: Text("Login", style: GoogleFonts.montserrat(fontWeight: FontWeight.bold),),
                                ),
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