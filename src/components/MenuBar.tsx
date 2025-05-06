// src/components/MenuBar.tsx
"use client";

import { useRouter } from "next/navigation";

export default function MenuBar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        redirect: "manual",   // 不自動跟隨 307
      });

      if (res.status === 307) {
        // 手動跟隨 Location header
        const to = res.headers.get("location");
        if (to) {
          window.location.href = to;
          return;
        }
      }

      if (res.ok) {
        // 如果 API 改成回 200，也能走到這裡
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
      <span className="font-bold text-xl">My SSO App</span>
      <button
        onClick={handleLogout}
        className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
      >
        登出
      </button>
    </nav>
  );
}