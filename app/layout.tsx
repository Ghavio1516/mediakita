// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header"; // Import Header
import Footer from "../components/Footer"; // Import Footer

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata = {
  title: "Media KITA",
  description: "Selamat datang di website Media KITA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        className={` antialiased`}
      >
        <Header />
        <main>{children}</main> {/* Semua halaman akan dirender di sini */}
        <Footer />
      </body>
    </html>
  );
}
