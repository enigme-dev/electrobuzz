import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/core/components/theme-provider";
import NextAuthProvider from "@/core/components/next-auth-provider";
import Header from "@/core/components/header";
import TanstackQueryProvider from "@/core/components/tanstack-query";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Axara",
  description: "Simple blog site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>
            <TanstackQueryProvider>
              <header>
                <Header />
              </header>
              <main>{children}</main>
            </TanstackQueryProvider>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
