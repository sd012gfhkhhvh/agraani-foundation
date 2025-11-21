import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agraani Welfare Foundation",
  description: "Empowering women and children through education, skill training, and community development in West Bengal, India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
