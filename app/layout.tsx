import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalyst6 Demon",
  description: "Persistent-memory prototype for Catalyst6 Demon."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
