import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

ThemeData lightTheme = ThemeData(
  primarySwatch: Colors.orange, // mantine primaryColor
  scaffoldBackgroundColor: Color(0xFFFDF8EA),
  textTheme: GoogleFonts.montserratTextTheme().apply(
    displayColor: Colors.black, // larger text sizes
    bodyColor: Color(0xFF2d3748) // Body texts
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
      shape: WidgetStatePropertyAll(RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(6)
      )),
    ),
  ),
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ButtonStyle(
      backgroundColor: WidgetStatePropertyAll(Color(0xFFFFA500)),
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
  )
);

ThemeData darkTheme = ThemeData(
  colorScheme: ColorScheme.dark(

  )
);