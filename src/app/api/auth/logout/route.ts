// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
    const APP_URL = process.env.NEXT_PUBLIC_NCU_DEFAULT_PAGE!;
    // 1) 刪除 own‐cookie，2) 回傳 307 並導向相對路徑 /login
    const res = NextResponse.redirect(`${APP_URL}/login`, 307);
    res.cookies.delete({ name: "ncusession", path: "/" });
    return res;
}
