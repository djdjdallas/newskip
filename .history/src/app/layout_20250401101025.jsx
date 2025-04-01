// File: app/layout.jsx
import { Inter } from "next/font/google";
import "/Users/dominickhill/new-skipfurther/src/app/globals.css"; // Use relative path
import Footer from "./components/nav/Footer";
import MainNav from "./components/nav/MainNav";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SkipFurther - Marketplace for Waitlist Spots",
  description:
    "Buy and sell positions in exclusive waitlists for hyped drops, events, and tech products.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}
      >
        <MainNav />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
