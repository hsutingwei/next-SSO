// src/app/layout.tsx
import "./globals.css";
import MenuBar from "@/components/MenuBar";

export const metadata = { 
  title: "My SSO App",
};

// 防止快取
export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <head>
        <meta httpEquiv="Cache-Control" content="no-store, no-cache, must-revalidate, proxy-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body>
        <MenuBar />
        {children}
      </body>
    </html>
  );
}