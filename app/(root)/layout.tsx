import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Footer, LeftSidebar, Navbar, RightSidebar } from "@/components/shared";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'VITroubles',
  description: 'A next.js authentication system'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Navbar />

          <main className="flex flex-row">
            <LeftSidebar />

            <section className="main-container">
              <div className="w-full max-w-4xl">
                {children}
              </div>
            </section>

            <RightSidebar />
          </main>

          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
