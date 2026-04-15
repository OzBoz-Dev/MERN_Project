import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mern_mobile_app/widgets/animated_grid_background.dart';
import 'package:password_strength_checker/password_strength_checker.dart';

class SignupPage extends StatefulWidget {
  const SignupPage({super.key});

  @override
  State<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {

  // Text controllers
  final _emailController = TextEditingController();
  final _usernameController = TextEditingController();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  // Obscure passwrod
  bool _isPasswordObscured = true;
  bool _isConfirmPasswordObscured = true;

  // Form validity
  final _formKey = GlobalKey<FormState>();
  bool _isFormValid = false; // Controls creat acct button

  // Password strength verification
  final passNotifier = ValueNotifier<PasswordStrength?>(null);

  // Custom rules matching web app
  PasswordStrength? _getPasswordStrength(String pass) {
    if(pass.isEmpty) return null;
    
    // Length
    if(pass.length < 6) return PasswordStrength.weak;

    // Complexity Score
    int score = 0;
    if(RegExp(r'[0-9]').hasMatch(pass)) score++; // Has number
    if(RegExp(r'[a-z]').hasMatch(pass)) score++; // Has lowercase
    if(RegExp(r'[A-Z]').hasMatch(pass)) score++; // Has uppercase
    if(RegExp(r'[!@#$%^&*(),.?":{}|<>]').hasMatch(pass)) score++; // Has special char

    if(score < 2) return PasswordStrength.weak;
    if(score == 2) return PasswordStrength.medium;
    if(score == 3) return PasswordStrength.strong;
    
    return PasswordStrength.secure;
  }

  // For listing out password requirements
  Widget _buildRequirementItem(String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        children: [
          Icon(Icons.check, size: 14, color: Colors.grey[600]),
          const SizedBox(width: 8),
          Text(
            text,
            style: GoogleFonts.montserrat(
              fontSize: 11,
              color: Colors.grey[700],
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: AppBar(title: Text("Sign Up"), centerTitle: true,),
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
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        "Create Account",
                        style: GoogleFonts.montserrat(
                          fontSize: 36,
                          fontWeight: FontWeight.w700
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 24,),
                      Form(
                        key: _formKey,
                        autovalidateMode: AutovalidateMode.onUserInteraction,
                        onChanged: () {
                          setState(() {
                            _isFormValid = _formKey.currentState?.validate() ?? false;
                          });
                        },
                        child: Column(
                          children: [
                            TextFormField(
                              controller: _emailController,
                              style: TextStyle(
                                fontSize: 14
                              ),
                              keyboardType: TextInputType.text,
                              decoration: const InputDecoration(
                                labelText: "Email",
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return "Email is required";
                                }
                                if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) {
                                  return "Enter a valid email";
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: _usernameController,
                              style: TextStyle(
                                fontSize: 14
                              ),
                              keyboardType: TextInputType.text,
                              decoration: const InputDecoration(
                                labelText: "Username",
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return "Username is required";
                                }
                                if (value.length < 3) {
                                  return "Minimum 3 characters";
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 16),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                              children: [
                                Expanded(
                                  child: TextFormField(
                                    controller: _firstNameController,
                                    style: TextStyle(
                                      fontSize: 14
                                    ),
                                    keyboardType: TextInputType.text,
                                    decoration: const InputDecoration(
                                      labelText: "First Name",
                                    ),
                                    validator: (value) {
                                      if(value == null || value.isEmpty) {
                                        return "First name is required";
                                      }
                                      return null;
                                    },
                                  ),
                                ),
                                const SizedBox(width: 8,),
                                Expanded(
                                  child: TextFormField(
                                    controller: _lastNameController,
                                    style: TextStyle(
                                      fontSize: 14
                                    ),
                                    keyboardType: TextInputType.text,
                                    decoration: const InputDecoration(
                                      labelText: "Last Name",
                                    ),
                                    validator: (value) {
                                      if(value == null || value.isEmpty) {
                                        return "Last name is required";
                                      }
                                      return null;
                                    },
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: _passwordController,
                              style: TextStyle(
                                fontSize: 14
                              ),
                              obscureText: _isPasswordObscured,
                              decoration: InputDecoration(
                                labelText: "Password",
                                suffixIcon: IconButton(
                                  onPressed: () {
                                    setState(() {
                                      _isPasswordObscured = !_isPasswordObscured;
                                    });
                                  },
                                  icon: Icon(_isPasswordObscured ? TablerIcons.eye : TablerIcons.eye_off)
                                )
                              ),
                              onChanged: (value) {
                                passNotifier.value = _getPasswordStrength(value);
                                setState(() {});
                              },
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return "Password is required";
                                }
                                if (value.length < 6) {
                                  return "Minimum 6 characters";
                                }
                                if(!RegExp(r'[0-9]').hasMatch(value)) {
                                  return "Password must have a number";
                                }
                                if(!RegExp(r'[a-z]').hasMatch(value)) {
                                  return "Password must have a lowercase letter";
                                }
                                if(!RegExp(r'[A-Z]').hasMatch(value)) {
                                  return "Password must have an uppercase letter";
                                }
                                if(!RegExp(r'[!@#$%^&*(),.?":{}|<>]').hasMatch(value)) {
                                  return "Password must have a special character";
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 16,),
                            TextFormField(
                              controller: _confirmPasswordController,
                              style: TextStyle(
                                fontSize: 14
                              ),
                              obscureText: _isConfirmPasswordObscured,
                              decoration: InputDecoration(
                                labelText: "Confirm Password",
                                suffixIcon: IconButton(
                                  onPressed: () {
                                    setState(() {
                                      _isConfirmPasswordObscured = !_isConfirmPasswordObscured;
                                    });
                                  },
                                  icon: Icon(_isConfirmPasswordObscured ? TablerIcons.eye : TablerIcons.eye_off)
                                )
                              ),
                              validator: (value) {
                                if (value != _passwordController.text) {
                                  return "Passwords do not match";
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 16,),
                            PasswordStrengthChecker(
                              strength: passNotifier,
                            ),
                            const SizedBox(height: 16,),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  "Password Requirements:",
                                  style: GoogleFonts.montserrat(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black87,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                _buildRequirementItem("At least 6 characters"),
                                _buildRequirementItem("An uppercase & a lowercase letter"),
                                _buildRequirementItem("At least one number"),
                                _buildRequirementItem("At least one special character"),
                              ],
                            ),
                            const SizedBox(height: 20),
                            // login button
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton(
                                onPressed: _isFormValid ? () {
                                  final email = _emailController.text;
                                  final username = _usernameController.text;
                                  final password = _passwordController.text;
                
                                  debugPrint("email: $email");
                                  debugPrint("Username: $username");
                                  debugPrint("Password: $password");
                
                                  // TODO: call AuthProvider signup
                                } : null,
                                child: Text("Create Account", style: GoogleFonts.montserrat(fontWeight: FontWeight.bold),),
                              ),
                            ),
                            const SizedBox(height: 20,),
                            GestureDetector(
                              onTap: () {
                                Navigator.pushReplacementNamed(context, '/login');
                              },
                              child: Text(
                                "Have a ChipIn Account? Log In",
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