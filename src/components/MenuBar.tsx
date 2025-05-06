// src/components/MenuBar.tsx
"use client";
import { useRouter } from "next/navigation";

export default function MenuBar() {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
      redirect: "manual",  // ★ 不自动跟随 307
    });

    if (res.status === 307) {
      // 手动读取 Location header，然后 window.location
      const to = res.headers.get("location");
      if (to) {
        window.location.href = to;
        return;
      }
    }

    if (res.ok) {
      // （如果你改成返回 JSON 而不是 307，就会走到这里）
      router.push("/login");
    } else {
      console.error("Logout failed:", await res.text());
    }
  };

  return (
    <nav>
      {/* ... */}
      <button onClick={handleLogout} className="px-3 py-1 bg-red-600 rounded hover:bg-red-700">
        登出
      </button>
    </nav>
  );
}