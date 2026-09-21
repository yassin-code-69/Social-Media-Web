import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "দিগন্ত | আজকের কাজ, আগামীর সমৃদ্ধি",
  description: "একটি আধুনিক ও নির্ভরযোগ্য অনলাইন মাইক্রোটাস্ক এবং আর্নিং প্ল্যাটফর্ম।",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className="font-bengali min-h-screen bg-[#dff0f8] flex flex-col items-center">
        {children}
      </body>
    </html>
  );
}
