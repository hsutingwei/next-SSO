import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
try {
const origin = req.nextUrl.origin;
const res = NextResponse.redirect(new URL("/login", origin));
// 刪除 Session Cookie
res.cookies.delete({ name: "ncusession", path: "/" });
return res;
} catch (e) {
console.error("Logout Error:", e);
return new NextResponse("Internal Server Error", { status: 500 });
}
}