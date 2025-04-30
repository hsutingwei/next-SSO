// app/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  // 一定要在 async 函式裡面才可以用 await
  const cookieStore = await cookies();
  const session = cookieStore.get("ncusession");

  if (!session) {
    // 沒登入就跳到 /login
    redirect("/login");
  }

  // 有 session 再 parse 出來
  const user = JSON.parse(session.value) as {
    id: number;
    name: string;
    email: string;
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">歡迎，{user.name}！</h1>
      <p className="mt-2 text-gray-600">信箱：{user.email}</p>
    </main>
  );
}