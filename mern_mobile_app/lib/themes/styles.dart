import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

ThemeData lightTheme = ThemeData(
   useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: const Color(0xFFFFA500),
      brightness: Brightness.light,
    ),
  primaryColor: Color(0xFFFFA500),
  scaffoldBackgroundColor: Color(0xFFFDF8EA),
  textTheme: GoogleFonts.montserratTextTheme().apply(
    displayColor: Colors.black, // larger text sizes
    bodyColor: Color(0xFF2d3748) // Body texts
  ),
  appBarTheme: AppBarThemeData(
    backgroundColor: Colors.white,
    surfaceTintColor: Colors.transparent,
    shadowColor: Colors.black,
    elevation: 1,
  ),
  cardTheme: CardThemeData(
    color: Color(0xFFFFFEFB),
    elevation: 2,
    shadowColor: Color.fromRGBO(0, 0, 0, 0.05),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12)
    )
  ),
  iconButtonTheme: IconButtonThemeData(
    style: ButtonStyle(
      backgroundColor: WidgetStatePropertyAll(Colors.transparent),
      foregroundColor: WidgetStatePropertyAll(Color(0xFFFFA500)),
    ),
  ),
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ButtonStyle(
      backgroundColor: WidgetStateColor.resolveWith(
        (states) {
          if(states.contains(WidgetState.disabled)) {
            return Color(0xFFB9B9B9);
          }
          else {
            return Color(0xFFFFA500);
          }
        }
      ),
      foregroundColor: WidgetStatePropertyAll(Colors.white),
      shape: WidgetStatePropertyAll(RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(6)
      )),
    ),
  ),
  textButtonTheme: TextButtonThemeData(
    style: ButtonStyle(
      backgroundColor: WidgetStatePropertyAll(Color(0xFFB9B9B9)),
      foregroundColor: WidgetStatePropertyAll(Colors.white),
      shape: WidgetStatePropertyAll(RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(6)
      )),
    ),
  ),
  outlinedButtonTheme: OutlinedButtonThemeData(
    style: ButtonStyle(
      backgroundColor: WidgetStatePropertyAll(Color(0xFFe3e8f0)),
      foregroundColor: WidgetStatePropertyAll(Color(0xFF2d3748)),
      shape: WidgetStatePropertyAll(RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(6)
      )),
    ),
  ),
  navigationBarTheme: NavigationBarThemeData(
    indicatorColor: Color(0xFFFFA500),
    indicatorShape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(6)
    ),
    surfaceTintColor: Colors.transparent,
    overlayColor: WidgetStatePropertyAll(
      Color(0xFFFFA500).withAlpha(50)
    )
  ),
  inputDecorationTheme: InputDecorationThemeData(
    isDense: true,
    filled: true,
    fillColor: Color(0xFFFDF8EA),
    labelStyle: TextStyle(
      fontSize: 14
    ),
    floatingLabelStyle: WidgetStateTextStyle.resolveWith(
      (states) {
        if (states.contains(WidgetState.error)) {
          return const TextStyle(color: Colors.red);
        }
        return const TextStyle(color: Color(0xFFFFA500));
      }
    ),
    enabledBorder: OutlineInputBorder(
      borderSide: BorderSide(
        color: Colors.grey[300]!
      )
    ),
    focusedBorder: OutlineInputBorder(
      borderSide: BorderSide(
        color: Color(0xFFFFA500)
      )
    ),
    errorBorder: OutlineInputBorder(
      borderSide: BorderSide(
        color: Colors.red
      )
    ),
    focusedErrorBorder: OutlineInputBorder(
      borderSide: BorderSide(
        color: Colors.red
      )
    ),
  ),
  textSelectionTheme: TextSelectionThemeData(
    cursorColor: Color(0xFFFFA500),
    selectionHandleColor: Color(0xFFFFA500),
    selectionColor: Colors.grey[400],
  )
);

ThemeData darkTheme = ThemeData(
  colorScheme: ColorScheme.dark(

  )
);