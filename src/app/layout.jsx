import React from "react";
import Head from "next/head";
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
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
          />
        </Head>
        <body suppressHydrationWarning={true}>{children}</body>
      </html>
    </SessionWrapper>
  );
}
