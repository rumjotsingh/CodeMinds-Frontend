"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/authContext";
import { store } from "./../redux/store";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/Component/Navbar";
import FooterWrapper from "@/Component/FooterWrapper";
import { ThemeProvider } from "next-themes";

// custom theme file

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
          >
            <Provider store={store}>
              <AuthProvider>
                <Navbar />
                <Toaster position="top-center" />
                {children}
                <FooterWrapper />
              </AuthProvider>
            </Provider>
          </GoogleOAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
