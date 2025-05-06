"use client";

import { useRouter } from "next/navigation";

export default function MenuBar() {
  const router = useRouter();

  const handleLogout = async () => {
    // 呼叫 POST /api/auth/logout
    const res = await fetch("/api/auth/logout", { method: "POST" });
    if (res.ok) {
      // 清除完 cookie 後導到 /login
      router.push("/login");
    } else {
      console.error("Logout failed");
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