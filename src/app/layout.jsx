import React from "react";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";

export const metadata = {
  title: "CMW",
  description: "Cipta Mandiri Wirasakti",
};

export default function RootLayout({ children }) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body suppressHydrationWarning={true}>{children}</body>
      </html>
    </SessionWrapper>
  );
}
