import type { Metadata } from "next";
import { phosphate, montserrat, spaceGrotesk } from "./fonts";
import NavBarWrapper from "../components/NavBarWrapper";
import TopBlurMask from "../components/TopBlurMask";
import GSAPInit from "../components/GSAPInit";
import CustomCursor from "../components/CustomCursor";
import { ThemeProvider } from "../context/ThemeContext";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Andrew Mindy | Design Portfolio",
  description: "Portfolio of Andrew Mindy - Design, Innovation, and Creativity.",
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
