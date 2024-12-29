import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SessionProvider } from "next-auth/react";
export const metadata = {
  title: "Maithil Milan",
  description:
    "Find your perfect Maithil match. Maithil Milan is the world's largest online matrimony portal " +
    "exclusively for Maithils. We connect Maithils from around the world, helping them find their " +
    "perfect match and stay connected to their roots.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Navbar />
          {children}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
