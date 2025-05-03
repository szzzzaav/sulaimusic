import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/navBar";
import { Player } from "@/components/player/player";
import { SongContextProvider } from "@/hooks/songContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sulaimusic",
  description: "Sulaimusic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SongContextProvider>
          <div className="w-full h-full flex flex-col items-center justify-center">
            <NavBar />
            {children}
            <Player />
          </div>
        </SongContextProvider>
      </body>
    </html>
  );
}
