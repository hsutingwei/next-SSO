# next-SSO

這是一個基於 Next.js 13 App Router 的示範專案，展示如何與**中央大學 (NCU) OAuth2**整合實現單點登入 (SSO)。

## 主要功能

- **Next.js 13 App Router**：採用檔案路由與 Server Components。  
- **NCU OAuth2 SSO 整合**：透過自訂 API Route (`/api/auth/callback`) 完成 OAuth2 流程。  
- **自動重定向**：針對未驗證使用者，自動導向至中央 Portal 授權頁。  
- **Session 管理**：使用安全的 `ncusession` HttpOnly cookie 保存登入狀態。  
- **個性化問候**：  
  - 資管系學生：顯示「歡迎 XXX 蒞臨資管系，今天日期是 YYYY年MM月DD日」  
  - 其他訪客：顯示「歡迎 XXX 參觀資管系，現在時間是 HH點MM分」  
- **環境變數驅動**：所有金鑰與端點均透過 `.env.local` 配置。  
- **Tailwind CSS**：採用公用類別快速美化樣式。

## 快速上手

### 前置需求

- Node.js >= 18  
- npm 或 yarn

### 安裝步驟

1. **Clone 專案**
   ```bash
   git clone https://github.com/hsutingwei/next-SSO.git
   cd next-SSO

2. **安裝相依套件**
    ```bash
    複製
    編輯
    npm install
    # 或
    yarn install

3. **撰寫環境變數**
    在專案根目錄建立 .env.local：

    ```env
    NEXT_PUBLIC_NCU_CLIENT_ID=
    NEXT_PUBLIC_NCU_REDIRECT_URI=
    NCU_CLIENT_ID=
    NCU_CLIENT_SECRET=

4. **啟動開發伺服器**
    ```bash
    npm run dev -- --turbo=false
    # 或
    yarn dev --turbo=false
    在瀏覽器開啟 http://localhost:3000。

5. **專案結構**
    ```python
    src/
    ├─ app/
    │  ├─ api/
    │  │  └─ auth/
    │  │     └─ callback/
    │  │        └─ route.ts        # OAuth2 callback 處理程式
    │  ├─ login/
    │  │  └─ page.tsx              # 登入觸發頁面
    │  └─ page.tsx                 # 首頁 (保護路由)
    ├─ styles/
    │  └─ globals.css              # 全域樣式
    ├─ tailwind.config.js          # Tailwind 設定
    ├─ tsconfig.json               # TypeScript 設定
    └─ package.json                # 相依與指令

### 運作流程
1. 使用者造訪 / → app/page.tsx 檢查 ncusession cookie。

2. 若不存在 own‐cookie → redirect('/login')，由 /login 觸發 OAuth2 授權端點。

3. 使用者於中央 Portal 驗證帳密 → Portal 帶 ?code=... 重導回 /api/auth/callback。

4. Callback 處理程式以該 code 換取 access_token，再呼叫 userinfo API 取得使用者資料。

5. 設定 own‐cookie 並 302 重導至 /。

6. / 讀取 own‐cookie，並顯示個性化問候訊息。

### 自訂化建議
- Scope 權限：在 scope 參數中調整所需的欄位，依實際需求增減。
- Cookie 設定：可在 route.ts 中調整 maxAge、path、secure 與 sameSite 等選項。
- 樣式擴充：在 tailwind.config.js 中新增自訂主題，或在組件中使用更多 Tailwind 公用類別。