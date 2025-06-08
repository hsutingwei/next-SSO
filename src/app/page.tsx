"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [content, setContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    // 檢查是否有 session cookie
    const hasSessionCookie = document.cookie
      .split("; ")
      .some((cookie) => cookie.startsWith("ncusession="));

    if (!hasSessionCookie) {
      router.replace("/login");
      return;
    }

    // 取得 cookie 中的用戶資訊
    const sessionCookie = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("ncusession="));
    
    if (!sessionCookie) {
      router.replace("/login");
      return;
    }

    const sessionData = JSON.parse(decodeURIComponent(sessionCookie.split("=")[1]));
    const { name, email, dept } = sessionData;

    // 更新頁面內容
    const pageContent = createPageContent(name, email, dept);
    setContent(pageContent);
  }, [router]);

  const createPageContent = (name: string, email: string, dept?: string) => {
    // 取得現在時間
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = now.getMonth() + 1;
    const dd = now.getDate();
    const hh = now.getHours();
    const min = now.getMinutes();

    // 判斷是否資管系學生
    const isIMStudent = (dept ?? "").includes("資訊管理學系");

    return (
      <main className="flex flex-col items-center justify-center min-h-screen space-y-4">
        {isIMStudent ? (
          <h1 className="text-2xl font-bold">
            歡迎 {name} 蒞臨資管系，今天日期是 {yyyy}年{mm}月{dd}日
          </h1>
        ) : (
          <h1 className="text-2xl font-bold">
            歡迎 {name} 參觀資管系，現在時間是 {hh}點{min}分
          </h1>
        )}
        <p className="text-sm text-gray-500">({email})</p>
      </main>
    );
  };

  // 渲染當前內容
  return content;
}