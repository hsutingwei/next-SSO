import { NextAuthOptions } from "next-auth"
import { OAuthConfig } from "next-auth/providers"

type AcademyRecords = {
    name: string;
    studySystemNo: string;
    degreeKindNo: string;
    didGroup: string;
    grad: string;
    studentStatus: string;
  };
  
  type Profile = {
    id: number;
    identifier: string;
    accountType: "STUDENT" | "FACULTY" | "STAFF" | string; // 根據可能的值擴展
    chineseName: string;
    englishName: string;
    gender: "1" | "2" | string; // 假設 "1" 代表男性，"2" 代表女性
    birthday: string; // 可能需要轉換格式
    personalId: string;
    studentId?: string; // 可能不是所有帳戶都有 studentId，所以加上可選
    email: string;
    emailVerified: boolean;
    mobilePhone: string;
    mobilePhoneVerified: boolean;
    academyRecords?: AcademyRecords; // 可能不是所有帳戶都有學籍資訊
  };
  

export const authConfig: NextAuthOptions = {
    providers: [
        {
            id: "ncu",
            name: "NCU OAuth",
            type: "oauth",
            version: "2.0",
            clientId: process.env.NCU_CLIENT_ID,
            clientSecret: process.env.NCU_CLIENT_SECRET,
            authorization: {
                url: "https://openid.ncu.edu.tw/auth",
                params: { scope: ['id', 'identifier', 'chinese-name', 'english-name', 'gender', 'birthday', 'personal-id', 'student-id', 'academy-records', 'faculty-records', 'email', 'mobile-phone'] }, // 根據中央大學的 API 設定
            },
            token: "https://portal.ncu.edu.tw/oauth2/token",
            userinfo: "https://portal.ncu.edu.tw/apis/oauth/v1/info",
            profile(profile: Profile) {
                return {
                    id: profile.id, // OpenID Connect 規範的唯一 ID
                    name: profile.chineseName,
                    email: profile.email,
                }
            },
        } as OAuthConfig<Profile>, // 型別斷言
    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                session.user.name = token.id as string // 保持使用者的 ID
            }
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET, // 確保有設定 NEXTAUTH_SECRET
    session: {
        strategy: "jwt", // 使用 JWT 來管理 session
    },
}