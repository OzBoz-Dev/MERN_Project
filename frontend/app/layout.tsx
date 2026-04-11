import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
  createTheme
} from "@mantine/core";
import { NavTabs } from "@/components/NavTabs";
import { theme } from './GlobalTheme';

export const metadata: Metadata = {
  icons: {
    icon: '/chip.svg',
    apple: '/chip.png'
  },
  title: {
    template: "%s | ChipIn",
    default: "ChipIn"
  },
  description: "Find and \"Chip In\" on projects!",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// const theme = createTheme({
//   white: "#FDF8EA", // Sets the default light background
//   black: "#171717", // Sets the default text color
// });

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
          <main style={{ paddingTop: 60 }}>
            {children}
          </main>
        </MantineProvider>
      </body>
    </html>
  );
}
