"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

    try {
      const cookieValue = sessionCookie.split("=")[1];
      console.log("Raw cookie value:", cookieValue);
      
      const decodedValue = decodeURIComponent(cookieValue);
      console.log("Decoded cookie value:", decodedValue);
      
      const sessionData = JSON.parse(decodedValue);
      console.log("Parsed session data:", sessionData);
      console.log("Gender value:", sessionData.gender);
      console.log("Gender type:", typeof sessionData.gender);
      
      const { name, email, dept, gender } = sessionData;
      
      // 更新頁面內容
      const pageContent = createPageContent(name, email, dept, gender);
      setContent(pageContent);
    } catch (error) {
      console.error("Error parsing cookie:", error);
    }
  }, [router]);

  const createPageContent = (name: string, email: string, dept?: string, gender?: string) => {
    // 取得現在時間
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = now.getMonth() + 1;
    const dd = now.getDate();
    const hh = now.getHours();
    const min = now.getMinutes();

    // 判斷是否資管系學生
    const isIMStudent = (dept ?? "").includes("資訊管理學系");
    
    // 除錯性別判斷邏輯
    const genderUpper = gender?.toUpperCase();

    return (
      <main className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="flex flex-col items-center space-y-4">
          <Image
            src={genderUpper === "1" ? "/man.png" : "/woman.png"}
            alt={genderUpper === "1" ? "Male Avatar" : "Female Avatar"}
            width={100}
            height={100}
            priority
          />
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
        </div>
      </main>
    );
  };

  // 渲染當前內容
  return content;
}