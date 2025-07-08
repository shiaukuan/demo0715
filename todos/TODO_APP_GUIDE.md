# Todo List 應用程式使用指南

一個基於 Next.js 15、Supabase 和 TypeScript 構建的現代化待辦事項管理應用程式。提供完整的任務管理系統，包含即時更新、用戶認證和響應式設計。

## ✨ 功能特色

- ✅ **用戶認證** - 使用 Supabase Auth 進行安全登入/註冊
- ✅ **個人待辦事項管理** - 每個用戶都有自己的私人待辦事項清單
- ✅ **即時更新** - 界面立即更新，與服務器同步
- ✅ **搜索與篩選** - 按標題/描述搜索待辦事項，按狀態篩選
- ✅ **行內編輯** - 直接在清單中編輯待辦事項
- ✅ **統計資訊** - 追蹤總計、進行中和已完成的待辦事項
- ✅ **響應式設計** - 在桌面和移動設備上都能正常運行
- ✅ **暗黑/明亮模式** - 支援主題切換
- ✅ **提示通知** - 所有操作都有用戶反饋

## 🛠️ 技術堆棧

- **前端**: Next.js 15 (App Router)、TypeScript、Tailwind CSS
- **後端**: Supabase (PostgreSQL、認證、即時功能)
- **UI 元件**: shadcn/ui + Radix UI
- **圖示**: Lucide React
- **通知**: Sonner
- **樣式**: 使用 CSS 變量的 Tailwind CSS

## 📋 環境要求

開始使用前，請確保您已安裝：

- Node.js 18+ 
- Supabase 帳戶和專案
- Git（用於克隆儲存庫）

## 🚀 安裝與設定

### 1. 克隆儲存庫

```bash
git clone <your-repository-url>
cd todos
```

### 2. 安裝依賴

```bash
npm install
```

### 3. 設定環境變數

在根目錄創建 `.env.local` 文件：

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

獲取這些值的方式：
1. 前往 [Supabase 控制台](https://app.supabase.com)
2. 選擇您的專案
3. 前往 Settings > API
4. 複製 Project URL 和 anon/public key

### 4. 資料庫設定

應用程式使用 Supabase MCP (Model Context Protocol) 進行資料庫操作。資料庫架構會在您首次運行應用程式時自動創建。

**資料庫架構：**
- `todos` 表格，包含欄位：id, user_id, title, description, completed, created_at, updated_at
- 行級安全性 (RLS) 政策，確保用戶只能訪問自己的待辦事項
- 自動時間戳更新

### 5. 運行應用程式

```bash
# 開發模式
npm run dev

# 生產版本構建
npm run build

# 啟動生產服務器
npm run start
```

應用程式將在 `http://localhost:3000` 上運行

## 📱 使用方法

### 1. 認證

#### 註冊新帳戶
1. 訪問 `http://localhost:3000`
2. 點擊「註冊」創建新帳戶
3. 輸入您的電子郵件和密碼
4. 檢查您的電子郵件以獲取確認鏈接

#### 登入
1. 前往 `/auth/login`
2. 輸入您的憑據
3. 您將被重定向到受保護的待辦事項頁面

### 2. 管理待辦事項

#### 創建待辦事項
1. 登入後，您將看到 `/protected` 頁面上的待辦事項控制台
2. 使用頂部的「新增待辦事項」表單
3. 輸入標題（必填）和描述（可選）
4. 點擊「新增待辦事項」或按 Enter 鍵

#### 查看待辦事項
- 您的所有待辦事項都顯示在主要清單中
- 查看統計資訊：總計、進行中和已完成的待辦事項
- 待辦事項按創建日期排序（最新的在前）

#### 編輯待辦事項
1. 點擊任何待辦事項上的編輯圖示 (✏️)
2. 直接在行內編輯標題和/或描述
3. 點擊保存圖示 (💾) 或按 Enter 鍵保存
4. 點擊取消圖示 (❌) 或按 Escape 鍵取消

#### 完成待辦事項
- 點擊任何待辦事項旁邊的複選框將其標記為完成/未完成
- 已完成的待辦事項將顯示刪除線文本和「已完成」標記

#### 刪除待辦事項
- 點擊任何待辦事項上的垃圾桶圖示 (🗑️) 刪除它
- 待辦事項將被永久刪除

### 3. 搜索和篩選

#### 搜索
- 使用搜索欄按標題或描述查找待辦事項
- 搜索不區分大小寫，會搜索標題和描述

#### 篩選
- 點擊篩選下拉菜單顯示：
  - **全部**：顯示所有待辦事項
  - **進行中**：僅顯示未完成的待辦事項
  - **已完成**：僅顯示已完成的待辦事項
- 篩選器會顯示每個類別的數量

### 4. 用戶管理

#### 個人資料
- 您的用戶詳細信息顯示在受保護頁面上
- 使用導航中的登出按鈕登出

#### 密碼重置
- 在登入頁面使用「忘記密碼」鏈接
- 輸入您的電子郵件以接收重置鏈接

## 📁 文件結構

```
├── app/
│   ├── actions/
│   │   └── todos.ts              # CRUD 操作的服務器動作
│   ├── auth/                     # 認證頁面
│   ├── protected/
│   │   └── page.tsx              # 主要待辦事項控制台
│   └── layout.tsx                # 帶有主題提供者的根布局
├── components/
│   ├── todo-app.tsx              # 主要待辦事項應用程式元件
│   ├── todo-form.tsx             # 創建待辦事項的表單
│   ├── todo-item.tsx             # 單個待辦事項元件
│   ├── todo-list.tsx             # 帶搜索和篩選的待辦事項清單
│   └── ui/                       # shadcn/ui 元件
├── lib/
│   ├── database.types.ts         # 資料庫的 TypeScript 類型
│   ├── supabase/                 # Supabase 客戶端配置
│   └── utils.ts                  # 工具函數
└── TODO_APP_GUIDE.md             # 此文件
```

## 🧩 關鍵元件

### TodoApp (`components/todo-app.tsx`)
- 帶有狀態管理的主要容器元件
- 處理樂觀更新和錯誤處理
- 連接 UI 元件與服務器動作

### TodoList (`components/todo-list.tsx`)
- 顯示所有待辦事項，包含搜索和篩選功能
- 顯示統計資訊和空狀態
- 處理排序和篩選邏輯

### TodoItem (`components/todo-item.tsx`)
- 單個待辦事項顯示和編輯
- 帶有保存/取消的行內編輯模式
- 切換完成和刪除功能

### TodoForm (`components/todo-form.tsx`)
- 創建新待辦事項的表單
- 驗證和載入狀態
- 鍵盤快捷鍵（Enter 鍵提交）

## 🔧 API 參考

### 服務器動作 (`app/actions/todos.ts`)

#### `getTodos()`
- 獲取當前用戶的所有待辦事項
- 返回：`Promise<Todo[]>`

#### `createTodo(title: string, description?: string)`
- 創建新的待辦事項
- 返回：`Promise<{ success: boolean; error?: string }>`

#### `updateTodo(id: string, updates: Partial<TodoUpdate>)`
- 更新現有待辦事項
- 返回：`Promise<{ success: boolean; error?: string }>`

#### `deleteTodo(id: string)`
- 刪除待辦事項
- 返回：`Promise<{ success: boolean; error?: string }>`

#### `toggleTodo(id: string, completed: boolean)`
- 切換待辦事項完成狀態
- 返回：`Promise<{ success: boolean; error?: string }>`

## 🗄️ 資料庫架構

```sql
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔒 安全功能

- **行級安全性 (RLS)**：用戶只能訪問自己的待辦事項
- **需要認證**：所有待辦事項操作都需要認證
- **CSRF 保護**：服務器動作提供 CSRF 保護
- **輸入驗證**：客戶端和服務器都會驗證所有輸入

## 💻 開發命令

```bash
# 啟動開發服務器
npm run dev

# 生產版本構建
npm run build

# 啟動生產服務器
npm run start

# 運行代碼檢查
npm run lint

# 添加新的 shadcn/ui 元件
npx shadcn@latest add [component-name]
```

## 🚀 部署

此應用程式可以部署到任何支援 Next.js 的平台：

- **Vercel**（推薦）
- **Netlify**
- **Railway**
- **Docker**

確保在您的部署平台中設置環境變數。

## 🔧 故障排除

### 常見問題

1. **資料庫連接錯誤**
   - 檢查您的 Supabase URL 和 API 密鑰
   - 確保您的 Supabase 專案處於活動狀態

2. **認證問題**
   - 驗證電子郵件確認
   - 檢查 Supabase Auth 設定

3. **構建錯誤**
   - 運行 `npm run lint` 檢查代碼問題
   - 確保所有依賴都已安裝

4. **效能問題**
   - 應用程式使用樂觀更新以獲得更好的用戶體驗
   - 服務器動作自動重新驗證資料

### 獲得幫助

如果您遇到問題：
1. 檢查瀏覽器控制台的錯誤消息
2. 驗證您的環境變數
3. 檢查您的 Supabase 專案設定
4. 查看服務器日誌以獲取詳細的錯誤信息

## 📝 使用技巧

### 鍵盤快捷鍵
- **Enter**：在表單中提交新待辦事項
- **Enter**：在編輯模式中保存更改
- **Escape**：取消編輯模式

### 最佳實踐
1. 使用描述性的標題
2. 充分利用描述欄位添加更多詳細信息
3. 定期清理已完成的待辦事項
4. 使用搜索功能快速找到特定的待辦事項

### 效能提示
- 應用程式使用樂觀更新，因此操作感覺即時
- 所有更改都會自動保存到資料庫
- 即時篩選和搜索不會影響效能

## 🎨 自定義

### 主題定制
編輯 `app/globals.css` 中的 CSS 變量以自定義顏色和主題。

### 添加新功能
1. 新增服務器動作到 `app/actions/todos.ts`
2. 創建或修改 React 元件
3. 更新資料庫架構（如需要）
4. 添加適當的 TypeScript 類型

## 📄 授權

此專案採用開源授權，並在 [MIT 授權](LICENSE) 下可用。

## 🤝 貢獻

歡迎貢獻！請隨時提交 Pull Request。

---

**享受使用您的新待辦事項應用程式！** 🎉