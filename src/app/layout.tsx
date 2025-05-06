// src/app/layout.tsx
import MenuBar from "@/components/MenuBar";

export const metadata = { title: "My SSO App" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        <MenuBar />
        {children}
      </body>
    </html>
  );
}