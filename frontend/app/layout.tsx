import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@mantine/core/styles.css";
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
  createTheme,
} from "@mantine/core";
import { NavTabs } from "@/components/NavTabs";

export const metadata: Metadata = {
  title: "My Mantine App",
  description: "Hope I did it right lol",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const theme = createTheme({
  white: "#FDF8EA", // Sets the default light background
  black: "#171717", // Sets the default text color
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <header>
            <NavTabs />
          </header>
          <main>{children}</main>
        </MantineProvider>
      </body>
    </html>
  );
}
