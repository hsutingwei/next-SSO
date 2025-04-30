// app/login/page.tsx
"use client";

export default function LoginPage() {
  const handleLogin = () => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_NCU_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_NCU_REDIRECT_URI!,
      response_type: "code",
      scope: [
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
      ].join(" "),
    });
    window.location.assign(
      `https://portal.ncu.edu.tw/oauth2/authorization?${params.toString()}`
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="mb-6 text-3xl font-bold">請先登入中央大學帳號</h2>
      <button
        onClick={handleLogin}
        className="px-6 py-3 font-semibold border rounded-lg hover:bg-gray-100"
      >
        登入 NCU SSO
      </button>
    </div>
  );
}