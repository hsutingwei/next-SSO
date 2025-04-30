// src/app/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const cookieStore = await cookies();
  const session = cookieStore.get("ncusession");
  if (!session) redirect("/login");

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