import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const appUrl = process.env.NEXT_PUBLIC_NCU_DEFAULT_PAGE!;
        const res = NextResponse.redirect(`${appUrl}/login`);
        // 刪除 Session Cookie
        res.cookies.delete({ name: "ncusession", path: "/" });
        return res;
    } catch (e) {
        console.error("Logout Error:", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}