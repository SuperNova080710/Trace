import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "./route-motion.css";

export const metadata: Metadata = {
  title: "TRACE | 오리온의 개발 기록",
  description: "문제를 추적하고, 과정을 기록하고, 성장의 근거를 연결하는 오리온의 포트폴리오.",
  applicationName: "TRACE",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#090d1b",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        {/* The browser must see the opt-in before revealing the destination. */}
        <style media="(prefers-reduced-motion: no-preference)">
          {"@view-transition { navigation: auto; }"}
        </style>
      </head>
      <body>{children}</body>
    </html>
  );
}
