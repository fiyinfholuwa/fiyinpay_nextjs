import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Horizon Banking App",
  description: "A simple, modern banking dashboard.",
  icons: {
    icon: '/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"><body>{children}</body></html>
  );
}
