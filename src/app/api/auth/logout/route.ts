// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  try {
    // 清除 own‐cookie
    const res = NextResponse.json({ success: true }, { status: 200 });
    res.cookies.delete({ name: "ncusession", path: "/" });
    return res;
  } catch (err) {
    console.error("Logout Error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
