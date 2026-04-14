import 'package:flutter/material.dart';

class SignupPage extends StatelessWidget {
  const SignupPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Sign Up"), centerTitle: true,),
      body: const Center(
        child: Text("Sign Up Page"),
      )
    );
  }
}