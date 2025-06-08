// src/app/api/auth/callback/route.ts
import { NextRequest, NextResponse } from "next/server";

// 保證用 Node.js runtime（才能用 Buffer、process.env）
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // 1. 取 code
    const code = req.nextUrl.searchParams.get("code");
    if (!code) {
      // 無 code → 導去登入
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // 2. 換 token
    const tokenRes = await fetch("https://portal.ncu.edu.tw/oauth2/token", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.NCU_CLIENT_ID}:${process.env.NCU_CLIENT_SECRET}`
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.NEXT_PUBLIC_NCU_REDIRECT_URI!,
      }),
    });
    if (!tokenRes.ok) throw new Error("換 token 失敗");

    const { access_token } = await tokenRes.json();
    if (!access_token) throw new Error("沒有拿到 access_token");

    // 3. 讀 userinfo
    const userRes = await fetch("https://portal.ncu.edu.tw/apis/oauth/v1/info", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (!userRes.ok) throw new Error("拿 userinfo 失敗");
    const profile = await userRes.json();
    const deptName = profile.academyRecords?.name ?? "";

    // 4. 設 own‐cookie 並導回首頁
    const appUrl = process.env.NEXT_PUBLIC_NCU_DEFAULT_PAGE!;
    const resp = NextResponse.redirect(`${appUrl}/`);
    const cookieValue = JSON.stringify({
      id: profile.id,
      name: profile.chineseName ?? profile.englishName,
      email: profile.email,
      dept: deptName,
    });
    resp.cookies.set({
      name: "ncusession",
      value: cookieValue,
      httpOnly: false,
      path: "/",
      maxAge: 3 * 60 * 60 * 1000
    });

    // 5. 從 req.cookies 讀取舊 cookie 並打印
    const oldSessionCookie = req.cookies.get("ncusession")?.value;
    console.log("Old session cookie:", oldSessionCookie);

    // 6. 打印新的 Set-Cookie header
    console.log("Set-Cookie header:", resp.headers.get("set-cookie"));

    return resp;
  } catch (e) {
    console.error("☢️ OAuth Callback Error:", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}