// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // 讀出請求的 origin（line: http://localhost:8080 或 https://你自己的域名）
  const origin = req.nextUrl.origin;
  // 建立一個重導向到 /login 的回應
  const res = NextResponse.redirect(new URL("/login", origin));
  // 刪除我們設定的 Session Cookie
  res.cookies.delete("ncusession", { path: "/" });
  return res;
}