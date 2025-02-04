import React from "react";
import "./globals.css";

export const metadata = {
  title: "CMW",
  description: "Cipta Mandiri Wirasakti",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
