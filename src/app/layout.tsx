import type { Metadata } from "next";
import { phosphate, montserrat, spaceGrotesk } from "./fonts";
import NavBarWrapper from "../components/NavBarWrapper";
import TopBlurMask from "../components/TopBlurMask";
import GSAPInit from "../components/GSAPInit";
import CustomCursor from "../components/CustomCursor";
import { ThemeProvider } from "../context/ThemeContext";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Andrew Mindy | Designer + Builder",
  description: "I turn ambiguous growth problems into systems that scale — from $3M to $20M revenue growth, 17-point close rate improvements, and 1,000+ hours saved per year.",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "Andrew Mindy | Designer + Builder",
    description: "I turn ambiguous growth problems into systems that scale — from $3M to $20M revenue growth, 17-point close rate improvements, and 1,000+ hours saved per year.",
    url: 'https://andrewmindy.com',
    siteName: 'Andrew Mindy',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Andrew Mindy — Designer + Builder + Systems Thinker' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Andrew Mindy | Designer + Builder",
    description: "I turn ambiguous growth problems into systems that scale.",
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${phosphate.variable} ${montserrat.variable} ${spaceGrotesk.variable}`}>
        <ThemeProvider>
          <CustomCursor />
          <GSAPInit />
          <TopBlurMask />
          <NavBarWrapper />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
