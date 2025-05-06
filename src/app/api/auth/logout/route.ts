// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  try {
    // 1. 從環境變數取出你真正的 App 根域名
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
    if (!APP_URL) {
      console.error("Missing env NEXT_PUBLIC_APP_URL");
      return new NextResponse("Configuration error", { status: 500 });
    }

    // 2. 刪除自己的 Session Cookie
    const res = NextResponse.redirect(`${APP_URL}/login`);
    res.cookies.delete({ name: "ncusession", path: "/" });

    return res;
  } catch (err) {
    console.error("Logout Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}