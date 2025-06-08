"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MenuBar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      console.log("Current cookies:", document.cookie);
      const hasSessionCookie = document.cookie
        .split("; ")
        .some((cookie) => {
          const hasNcuSession = cookie.startsWith("ncusession=");
          console.log("Checking cookie:", cookie, "Has ncusession:", hasNcuSession);
          return hasNcuSession;
        });
      console.log("Final isLoggedIn status:", hasSessionCookie);
      setIsLoggedIn(hasSessionCookie);
    };

    // 初始檢查
    checkLoginStatus();

    // 監聽 storage 事件以處理其他分頁的變更
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        // 確保 cookie 被清除
        document.cookie = "ncusession=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        setIsLoggedIn(false);
        router.push("/login");
      } else {
        console.error("Logout failed:", await res.text());
      }
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  return (
    <nav className="w-full bg-gray-800 text-white p-4 flex justify-between items-center">
      <span className="font-bold text-xl">SSO App</span>
      {isLoggedIn && (
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
        >
          登出
        </button>
      )}
    </nav>
  );
}