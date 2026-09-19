import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DaraLearn",
  description: "Learn with the right tutor.",
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
