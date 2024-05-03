import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/core/components/theme-provider";
import NextAuthProvider from "@/core/components/next-auth-provider";
import Header from "@/core/components/header";
import TanstackQueryProvider from "@/core/components/tanstack-query";
import Footer from "@/core/components/footer";

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
              <header className="w-full">
                <Header />
              </header>
              <main>{children}</main>
              <footer className="fixed bottom-0 left-0 w-full z-50 sm:hidden">
                <Footer />
              </footer>
            </TanstackQueryProvider>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
