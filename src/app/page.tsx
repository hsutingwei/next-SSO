"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Profile 型別定義
interface AcademyRecords {
  name?: string;
  studySystemNo?: string;
  degreeKindNo?: string;
  didGroup?: string;
  grad?: string;
  studentStatus?: string;
}

interface Profile {
  id?: string | number;
  identifier?: string;
  accountType?: string;
  chineseName?: string;
  englishName?: string;
  gender?: string;
  studentId?: string;
  email?: string;
  emailVerified?: boolean;
  academyRecords?: AcademyRecords;
  name?: string;
  dept?: string;
}

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
      const decodedValue = decodeURIComponent(cookieValue);
      const profile = JSON.parse(decodedValue);
      setContent(createPageContent(profile));
    } catch (error) {
      console.error("Error parsing cookie:", error);
    }
  }, [router]);

  // profile: 由 portal 取得的完整物件
  const createPageContent = (profile: Profile) => {
    const { name, email, dept, gender, identifier, accountType, academyRecords } = profile;
    // 取得現在時間
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = now.getMonth() + 1;
    const dd = now.getDate();
    const hh = now.getHours();
    const min = now.getMinutes();

    // 判斷是否資管系學生
    const isIMStudent = (dept ?? academyRecords?.name ?? "").includes("資訊管理學系");
    // 除錯性別判斷邏輯
    const genderUpper = gender?.toUpperCase();

    return (
      <main className="flex items-center justify-center min-h-[calc(100vh-64px)] w-full bg-gray-50">
        <div className="relative flex flex-col md:flex-row items-center justify-center bg-white rounded-xl shadow-lg p-6 md:p-10 gap-8 max-w-2xl w-full">
          <div className="relative w-full flex flex-col items-center mb-2 md:mb-0" style={{ height: '8rem' }}>
            {/* 藍色長方形背景：只在手機顯示 */}
            <div className="absolute top-0 left-0 w-full h-3/4 bg-blue-500 rounded-t-xl md:hidden" />
            <div className="absolute left-1/2 top-1/4 transform -translate-x-1/2 z-10">
              <Image
                src={genderUpper === "1" ? "/man.png" : "/woman.png"}
                alt={genderUpper === "1" ? "Male Avatar" : "Female Avatar"}
                width={112}
                height={112}
                priority
                className="w-28 h-28 object-contain rounded-full border-4 border-gray-200"
              />
            </div>
          </div>
          {/* 右側資訊 */}
          <div className="flex flex-col gap-3 w-full relative z-10">
            {/* 姓名 */}
            <div className="text-2xl md:text-3xl font-bold text-gray-800">{name}</div>
            {/* 自我介紹 */}
            <div className="text-base md:text-lg text-gray-600">
              {isIMStudent ? (
                <span>
                  歡迎 {name} 蒞臨資管系，今天日期是 {yyyy}年{mm}月{dd}日
                </span>
              ) : (
                <span>
                  歡迎 {name} 參觀資管系，現在時間是 {hh}點{min}分
                </span>
              )}
            </div>
            {/* 學號、身分、系別 */}
            <div className="flex flex-col gap-1 text-sm md:text-base text-gray-700 mt-2">
              {identifier && (
                <div><span className="font-semibold">學號：</span>{identifier}</div>
              )}
              {accountType && (
                <div><span className="font-semibold">身分：</span>{accountType}</div>
              )}
              {(academyRecords?.name || dept) && (
                <div><span className="font-semibold">系別：</span>{academyRecords?.name || dept}</div>
              )}
              {email && (
                <div><span className="font-semibold">Email：</span>{email}</div>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  };

  // 渲染當前內容
  return content;
}