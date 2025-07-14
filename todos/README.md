# PUNK TODO 應用程式 🎸

一個基於 Next.js 和 Supabase 構建的朋克風格待辦事項管理應用程式。

## 🎨 設計風格

這個應用程式採用了獨特的朋克/復古風格設計，靈感來自街頭文化和朋克音樂場景：

- **配色方案**: 使用大膽的紅色漸層背景配合高對比度的黑白色調
- **字體設計**: 使用 Google Fonts 的朋克風格字體（Barrio、Nosifer、Rye）
- **視覺效果**: 
  - 無圓角的方形設計
  - 粗黑邊框 (3-4px)
  - 立體陰影效果
  - 輕微的旋轉效果
  - 飛濺裝飾元素
- **交互體驗**: 按鈕懸停上移、點擊下壓等動畫效果

## 功能特色

- 🔐 使用者認證與授權
- ✅ 待辦事項 CRUD 操作
- 🎨 獨特的朋克風格 UI 設計
- 📷 圖片上傳功能
- 🔍 搜索和篩選功能
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
- **Supabase Storage** - 檔案存儲與圖片管理
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
│   │   ├── fonts.css           # 朋克風格字體配置
│   │   ├── grunge-styles.module.css  # 朋克風格樣式模組
│   │   ├── layout.tsx          # 朋克風格布局
│   │   └── page.tsx            # 主要 Todo 頁面
│   ├── actions/                 # Server Actions
│   │   └── todos.ts            # Todo 相關的 Server Actions
│   ├── globals.css              # 全域樣式
│   ├── layout.tsx               # 根布局
│   └── page.tsx                 # 首頁
├── components/                   # React 元件
│   ├── ui/                      # 基礎 UI 元件
│   ├── tutorial/                # 教學元件
│   ├── auth-button.tsx          # 認證按鈕
│   ├── login-form.tsx           # 登入表單
│   ├── sign-up-form.tsx         # 註冊表單
│   ├── theme-switcher.tsx       # 主題切換器
│   ├── todo-app.tsx             # 主要 Todo 應用程式組件
│   ├── todo-form.tsx            # 朋克風格 Todo 表單
│   ├── todo-item.tsx            # 朋克風格 Todo 項目
│   ├── todo-list.tsx            # 朋克風格 Todo 列表
│   ├── image-upload.tsx         # 圖片上傳組件
│   └── image-display.tsx        # 圖片顯示組件
├── lib/                         # 工具程式庫
│   ├── supabase/               # Supabase 設定
│   │   ├── client.ts           # 客戶端配置
│   │   ├── server.ts           # 伺服器端配置
│   │   └── middleware.ts       # 中介軟體配置
│   ├── database.types.ts        # 資料庫類型定義
│   ├── storage.ts              # 儲存功能
│   ├── storage-client.ts       # 儲存客戶端
│   ├── image-utils.ts          # 圖片處理工具
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

## 圖片上傳功能

全新的圖片管理系統，讓您的待辦事項更加豐富：

### 📸 **主要特色**
- **拖放上傳** - 支援拖拉檔案到上傳區域
- **即時預覽** - 上傳前即可預覽圖片
- **多格式支援** - JPEG、PNG、WebP、GIF
- **檔案大小限制** - 最大 5MB
- **安全存儲** - 使用 Supabase Storage 與 RLS 政策

### 🎯 **功能包含**
- **新增圖片** - 創建待辦事項時可添加圖片
- **查看圖片** - 縮圖顯示，點擊可全螢幕查看
- **更新圖片** - 為現有待辦事項添加或替換圖片
- **刪除圖片** - 移除圖片但保留文字內容
- **自動清理** - 刪除待辦事項時自動清理關聯圖片

### 🔒 **安全機制**
- **用戶隔離** - 每個用戶只能訪問自己的圖片
- **行級安全** - 資料庫層級的存取控制
- **檔案驗證** - 嚴格的檔案類型和大小檢查

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

### 朋克風格主題

應用程式採用獨特的朋克風格設計，具有以下特色：

- **自定義 CSS 模組**: `app/protected/grunge-styles.module.css` 包含所有朋克風格樣式
- **字體配置**: `app/protected/fonts.css` 定義了朋克風格字體
- **顏色配置**: 
  - 主背景: 紅色漸層 (#C41E3A 到 #FF4444)
  - 組件背景: 黑色漸層 (#000 到 #1a1a1a)
  - 邊框: 粗黑邊框 (3-4px)
  - 陰影: 立體陰影效果

### UI 元件

雖然項目使用了 shadcn/ui 作為基礎，但大部分組件都被重新設計為朋克風格：

- **TodoForm**: 使用原生 HTML 元素搭配朋克風格樣式
- **TodoItem**: 黑色背景、彩色按鈕、立體效果
- **TodoList**: 統計標籤和搜索功能的朋克風格重新設計

要新增新的 shadcn/ui 元件：

```bash
npx shadcn@latest add [component-name]
```

### 資料庫架構

應用程式包含以下主要資料表：

#### **todos 表格**
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key to auth.users)
- title (TEXT, Required)
- description (TEXT, Optional)
- image_url (TEXT, Optional) - 存儲圖片的 URL
- completed (BOOLEAN, Default: false)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### **Storage Bucket**
- **todo-images** - 存儲用戶上傳的圖片
- 檔案路徑格式：`{user_id}/{todo_id}/{filename}`
- 支援的格式：JPEG, PNG, WebP, GIF
- 大小限制：5MB

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