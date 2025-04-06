import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AppProvider from "./_components/AppProvider";

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

export const metadata = {
  title: "WorkTrack - Collaborative Task Management",
  description:
    "WorkTrack is a powerful project management tool designed to help teams and individuals streamline task organization, enhance collaboration, and boost productivity.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >  <AppProvider>
          <Toaster position="bottom-right" reverseOrder={false} />

        {children}
        </AppProvider>
        
      </body>
    </html>
  );
}
