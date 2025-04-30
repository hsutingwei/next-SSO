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
    const userRes = await fetch(
      "https://portal.ncu.edu.tw/apis/oauth/v1/info",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    if (!userRes.ok) throw new Error("拿 userinfo 失敗");

    const profile = await userRes.json();

    // 4. 設 own‐cookie 並導回首頁
    const resp = NextResponse.redirect(new URL("/", req.url));
    resp.cookies.set({
      name: "ncusession",
      value: JSON.stringify({
        id: profile.id,
        name: profile.chineseName ?? profile.englishName,
        email: profile.email,
      }),
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return resp;

  } catch (e) {
    console.error("☢️ OAuth Callback Error:", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}