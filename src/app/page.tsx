// src/app/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const cookieStore = await cookies();
  const session = cookieStore.get("ncusession");
  
  // 如果 own‐cookie 不存在，就直接去 Portal OAuth2
  if (!session) {
    // 建立授權 URL
    const authUrl = new URL("https://portal.ncu.edu.tw/oauth2/authorization");
    authUrl.searchParams.set("client_id", process.env.NEXT_PUBLIC_NCU_CLIENT_ID!);
    authUrl.searchParams.set(
      "redirect_uri",
      process.env.NEXT_PUBLIC_NCU_REDIRECT_URI!
    );
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set(
      "scope",
      [
        "id",
        "identifier",
        "chinese-name",
        "english-name",
        "gender",
        "birthday",
        "personal-id",
        "student-id",
        "academy-records",
        "faculty-records",
        "email",
        "mobile-phone"
      ].join(" ")
    );
    // 直接跳到 Portal，使用者只要在 Portal 已登入就不會再要帳密
    redirect(authUrl.toString());
  }

  // 解析 own‐cookie
  const { name, email, dept } = JSON.parse(session.value) as {
    id: number;
    name: string;
    email: string;
    dept?: string;
  };

  // 取得現在時間
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = now.getMonth() + 1;
  const dd = now.getDate();
  const hh = now.getHours();
  const min = now.getMinutes();

  // 判斷是否資管系學生
  const isIMStudent = (dept ?? "").includes("資訊管理學系");

  return (
    <main className="flex flex-col items-center justify-center min-h-screen space-y-4">
      {isIMStudent ? (
        <h1 className="text-2xl font-bold">
          歡迎 {name} 蒞臨資管系，今天日期是 {yyyy}年{mm}月{dd}日
        </h1>
      ) : (
        <h1 className="text-2xl font-bold">
          歡迎 {name} 參觀資管系，現在時間是 {hh}點{min}分
        </h1>
      )}
      <p className="text-sm text-gray-500">({email})</p>
    </main>
  );
}