// src/components/MenuBar.tsx
"use client";

import { useRouter } from "next/navigation";

export default function MenuBar() {
  const router = useRouter();

  const handleLogout = async () => {
    console.log("Click handleLogout");
    try {
      // Use a relative path so it works both locally and in prod,
      // and include credentials so the cookie is sent along.
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        // After the server clears the cookie, go to /login
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