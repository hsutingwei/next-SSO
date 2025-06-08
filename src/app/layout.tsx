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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="min-h-screen w-screen">
        <div className="flex flex-col min-h-screen">
          <MenuBar />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}