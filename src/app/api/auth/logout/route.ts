// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  try {
    // 1. 確保環境變數正確
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
    if (!APP_URL) {
      console.error("Missing env NEXT_PUBLIC_APP_URL");
      return new NextResponse("Configuration error", { status: 500 });
    }

    // 2. 刪除 own‐cookie，並重導向到 /login（使用生產域名）
    const res = NextResponse.redirect(`${APP_URL}/login`);
    res.cookies.delete({ name: "ncusession", path: "/" });
    return res;
  } catch (err) {
    console.error("Logout Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}