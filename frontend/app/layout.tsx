import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlantGuard AI — Plant Disease Detection",
  description: "Detect plant diseases instantly using deep learning",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}