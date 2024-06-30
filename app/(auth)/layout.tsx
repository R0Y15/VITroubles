import {
    ClerkProvider,
    RedirectToSignIn,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
} from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "../globals.css";

export const metadata = {
    title: 'VITroubles',
    description: 'A next.js authentication system'
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.className} bg-dark-1`}>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    )
}