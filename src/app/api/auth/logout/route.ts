// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// 在參數名前加上底線，避免 @typescript-eslint/no-unused-vars 錯誤
export async function POST(_req: NextRequest) {
  try {
    // 從環境變數讀取你的生產站點域名
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;
    const res = NextResponse.redirect(`${APP_URL}/login`);
    // 刪除 own‐cookie
    res.cookies.delete({ name: "ncusession", path: "/" });
    return res;
  } catch (err) {
    console.error("Logout Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}