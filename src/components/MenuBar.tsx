// src/components/MenuBar.tsx
"use client";

import { useRouter } from "next/navigation";

export default function MenuBar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
        const APP_URL = process.env.NEXT_PUBLIC_NCU_DEFAULT_PAGE;
        const res = await fetch(`${APP_URL}/api/auth/logout`, { method: "POST" });
        if (res.ok) {
            // 成功後導回 /login
            router.push("/login");
        } else {
            console.error("Logout failed", await res.text());
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