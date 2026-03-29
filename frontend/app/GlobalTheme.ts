import { createTheme, MantineThemeOverride } from "@mantine/core";

export const designTokens = {
  colors: {
    cardBackground: "#FFFEFB",
    cardBorder: "#ffe082", // yellow border highlight
    cardShadow: "0 2px 8px rgba(0,0,0,0.05)",
    tagBackground: "#f0f0ff", // light purple/blue for tags
    tagText: "#4b4be6",       // blue for tag text
    tagBackgroundAlt: "#eee", // fallback neutral tag background
    tagTextAlt: "#555",       // fallback neutral tag text
    textPrimary: "#2d3748",   // main text
    textSecondary: "#666",    // secondary text
    textMuted: "#999",        // muted/metadata
    buttonPrimary: "#ffa500", // orange for "Express Interest"
    buttonPrimaryText: "#fff",
    buttonSecondary: "#b9b9b9", // for "Message"
    buttonSecondaryText: "#2d3748",
    buttonTertiary: "#e3e8f0",
    buttonTertiaryPress: "#606265",
    badgeBackground: "#f0f0ff",
    badgeText: "#4b4be6",
  },
  fonts: {
    heading: "'Montserrat', 'Arial', sans-serif",
    body: "'Inter', 'Arial', sans-serif",
    fontWeightHeading: 700,
    fontWeightBody: 400,
    fontStyleHeading: "italic", // for the card title
    fontSizeTag: "12px",
    fontSizeBody: "16px",
    fontSizeMeta: "14px",
  },
  borderRadius: {
    card: "12px",
    tag: "8px",
    button: "6px",
  },
  spacing: {
    cardPadding: "24px",
    tagPadding: "4px 12px",
    tagMarginRight: "8px",
  }
};

export const theme = createTheme({
    white: "#FDF8EA",
    primaryColor: 'orange',
    colors: {},
    other: designTokens
})