# Todo 應用程式

一個基於 Next.js 和 Supabase 構建的現代化待辦事項管理應用程式。

## 功能特色

- 🔐 使用者認證與授權
- ✅ 待辦事項 CRUD 操作
- 🎨 現代化 UI 設計 (shadcn/ui + Tailwind CSS)
- 🌙 暗黑模式支援
- 📱 響應式設計
- 🔄 實時資料同步

## 技術棧

### 前端
- **Next.js 15** - React 全棧框架
- **React 19** - 使用者界面程式庫
- **TypeScript** - 型別安全
- **Tailwind CSS** - 樣式框架
- **shadcn/ui** - UI 元件程式庫
- **Radix UI** - 無樣式 UI 元件
- **Lucide React** - 圖示程式庫
- **next-themes** - 主題切換

### 後端
- **Supabase** - 後端即服務 (BaaS)
- **Supabase Auth** - 使用者認證
- **Supabase Database** - PostgreSQL 資料庫
- **Supabase SSR** - 伺服器端渲染支援

## 專案結構

```
todos/
├── app/                          # Next.js App Router
│   ├── auth/                     # 認證相關頁面
│   │   ├── login/               # 登入頁面
│   │   ├── sign-up/             # 註冊頁面
│   │   ├── forgot-password/     # 忘記密碼頁面
│   │   ├── update-password/     # 更新密碼頁面
│   │   └── confirm/             # 確認頁面
│   ├── protected/               # 受保護的頁面
│   ├── globals.css              # 全域樣式
│   ├── layout.tsx               # 根布局
│   └── page.tsx                 # 首頁
├── components/                   # React 元件
│   ├── ui/                      # 基礎 UI 元件
│   ├── tutorial/                # 教學元件
│   ├── auth-button.tsx          # 認證按鈕
│   ├── login-form.tsx           # 登入表單
│   ├── sign-up-form.tsx         # 註冊表單
│   └── theme-switcher.tsx       # 主題切換器
├── lib/                         # 工具程式庫
│   ├── supabase/               # Supabase 設定
│   │   ├── client.ts           # 客戶端配置
│   │   ├── server.ts           # 伺服器端配置
│   │   └── middleware.ts       # 中介軟體配置
│   └── utils.ts                # 工具函數
├── middleware.ts               # Next.js 中介軟體
├── components.json             # shadcn/ui 配置
├── tailwind.config.ts          # Tailwind CSS 配置
├── tsconfig.json               # TypeScript 配置
├── next.config.ts              # Next.js 配置
└── package.json                # 專案依賴
```

## 開始使用

### 前置需求

- Node.js 18.0 或更高版本
- npm、yarn 或 pnpm
- Supabase 帳戶

### 安裝步驟

1. **複製專案**
   ```bash
   git clone <repository-url>
   cd todos
   ```

2. **安裝依賴**
   ```bash
   npm install
   # 或
   yarn install
   # 或
   pnpm install
   ```

3. **設定環境變數**
   
   建立 `.env.local` 檔案並新增以下內容：
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   您可以在 [Supabase 專案設定](https://app.supabase.com/project/_/settings/api) 中找到這些值。

4. **啟動開發伺服器**
   ```bash
   npm run dev
   # 或
   yarn dev
   # 或
   pnpm dev
   ```

5. **開啟瀏覽器**
   
   前往 [http://localhost:3000](http://localhost:3000) 查看應用程式。

## 可用指令

- `npm run dev` - 啟動開發伺服器
- `npm run build` - 建置生產版本
- `npm run start` - 啟動生產伺服器
- `npm run lint` - 執行 ESLint 檢查

## 認證流程

應用程式包含完整的認證系統：

1. **註冊** - 使用者可以建立新帳戶
2. **登入** - 使用者可以使用帳戶登入
3. **忘記密碼** - 密碼重設功能
4. **受保護頁面** - 需要認證才能訪問的頁面

## 部署

### Vercel 部署

1. 將專案推送到 GitHub
2. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
3. 匯入您的 GitHub 倉庫
4. 設定環境變數
5. 部署

### 其他平台

此應用程式可以部署到任何支援 Next.js 的平台，包括：
- Netlify
- Railway
- Render
- Digital Ocean App Platform

## 自訂化

### 主題

應用程式使用 next-themes 支援明暗主題切換。您可以在 `app/globals.css` 中自訂主題顏色。

### UI 元件

使用 shadcn/ui 元件程式庫。要新增新元件：

```bash
npx shadcn-ui@latest add [component-name]
```

### 資料庫架構

在 Supabase 中設定您的資料庫表格。參考 `lib/supabase/` 目錄中的配置檔案。

## 授權

此專案採用 MIT 授權條款。

## 支援

如有問題或需要協助，請：
1. 查看 [Next.js 文件](https://nextjs.org/docs)
2. 查看 [Supabase 文件](https://supabase.com/docs)
3. 建立 Issue 在此倉庫中

## 貢獻

歡迎貢獻！請先閱讀貢獻指南。

1. Fork 此倉庫
2. 建立功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request