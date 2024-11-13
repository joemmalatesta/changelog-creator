import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from './providers'
import Navbar from "./components/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Changelog Creator",
  description: "Create changelogs for your GitHub repositories",
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased px-32 mx-auto my-10 dark:bg-dark bg-light`}
        >
        <Providers>
            <Navbar/>
            {children}
          <p className={`p-3 text-center text-sm`}>
            Created by <a href="https://joemmalatesta.com" className=" underline underline-offset-2 hover:underline-offset-4 transition-all">Joe Malatesta</a>
          </p>
        </Providers>
      </body>
    </html>
  )
}
