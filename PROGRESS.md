# 專案進度紀錄（Vercel + Supabase 版）

本檔案記錄將原 Flask 專案遷移至 Next.js + Supabase 的目前進展、變更內容、環境設定與後續待辦。可作為之後繼續作業的參考。

更新時間：請以 Git 記錄與本檔案內容為準。

## 總覽
- 已在專案根目錄新增 Next.js（App Router）專案，並整合 Supabase 用於認證與資料儲存。
- 頁面功能：
  - 首頁清單/搜尋：`/`
  - 新增單字：`/words/new`
  - 編輯/刪除單字：`/words/[id]`
  - 複習介面（批次、隱藏/顯示、困難標記）：`/review`
  - Email 魔法連結登入：`/login`
- AI 快速查詢：提供 `/api/ai` API（OpenAI 或 Gemini）供新增單字頁一鍵帶入建議內容。
- 匯入工具：從 `data/vocabulary.json` 匯入到 Supabase 的指令 `npm run import:json`。
- 舊 Flask 程式仍在 repo 中，但部署到 Vercel 時只會使用根目錄的 Next.js 專案。

## 新增/更新的檔案與目錄
- `package.json`：Next.js 專案設定與 scripts（`dev`/`build`/`start`/`import:json`）。
- `next.config.mjs`：Next.js 設定。
- `.env.example`：環境變數樣板（含 Supabase 與 AI 相關）。
- `tsconfig.json`：TypeScript 設定。
- `app/`：Next.js App Router 目錄
  - `layout.tsx`：全域 Layout，導入 `NavBar`。
  - `globals.css`：基本樣式。
  - `page.tsx`：首頁（單字清單 + 搜尋 + 前往編輯）。
  - `login/page.tsx`：Email Magic Link 登入。
  - `words/new/page.tsx`：新增單字頁（含 AI 快速查詢、登入檢查）。
  - `words/[id]/page.tsx`：編輯/刪除單字頁（含登入檢查）。
  - `review/page.tsx`：複習頁（每批 20 筆、隱藏/顯示、困難標記會回寫 `is_difficult`）。
  - `api/ai/route.ts`：AI 查詢 API（OpenAI/Gemini）。
- `components/NavBar.tsx`：導覽列（顯示登入 email、登出按鈕）。
- `lib/supabaseClient.ts`：Supabase client 初始化（建置期以 placeholder 值避免錯誤；實際執行需環境變數）。
- `supabase.sql`：資料表與 RLS 政策 SQL（可在 Supabase SQL Editor 執行）。
- `scripts/import_from_json.js`：匯入本機 JSON（以 Service Role Key 寫入指定使用者）。
- `README.md`：新增「Vercel + Supabase 部署」章節與 AI/匯入補充說明。

## Supabase 結構與權限
- 資料表：`public.words`
  - 欄位：
    - `id uuid` PK，`default gen_random_uuid()`
    - `user_id uuid` 參照 `auth.users(id)`，`on delete cascade`
    - `word text not null`
    - `chinese_meaning text not null`
    - `english_meaning text`
    - `phonetic text`
    - `example_sentence text`
    - `synonyms text[]`
    - `antonyms text[]`
    - `is_difficult boolean default false`
    - `created_at timestamptz default now()`
    - `updated_at timestamptz default now()`，透過 trigger 自動更新
  - 唯一索引：`(user_id, word)`（每位使用者各自唯一）
  - RLS（Row Level Security）：
    - select/insert/update/delete 僅限 `auth.uid() = user_id`
- 必要 extension：`pgcrypto`（供 `gen_random_uuid()`）

## 環境變數
- 前端（Vercel 與本機 `.env.local`）：
  - `NEXT_PUBLIC_SUPABASE_URL`（Supabase Project URL）
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`（Supabase anon key）
  - `NEXT_PUBLIC_SITE_URL`（本地：`http://localhost:3000`；正式：你的域名）
  - 可選 AI：`OPENAI_API_KEY` 或 `GOOGLE_API_KEY`
- 本機匯入（不要放在前端）：
  - `SUPABASE_URL`、`SUPABASE_SERVICE_ROLE_KEY`、`IMPORT_TARGET_USER_ID`

## 本機開發與建置驗證
- `npm install`
- `npm run dev` → 確認頁面與登入流程
- `npm run build` → 已在本機驗證可通過（為避免建置期缺環境變數報錯，`lib/supabaseClient.ts` 在無變數時使用 placeholder 值；實際運行請務必提供正確環境變數）

輸出（摘要）：
- Route (app): `/`, `/login`, `/review`, `/words/new`, 動態 `/words/[id]`，API route `/api/ai`

## 匯入舊資料
- 前提：先用 email 在 `/login` 登入一次以產生使用者；到 Supabase → Authentication → Users 查詢你的 `user_id`。
- 設定環境變數並執行：
  - PowerShell：
    - `$env:SUPABASE_URL="https://xxxxx.supabase.co"`
    - `$env:SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"`
    - `$env:IMPORT_TARGET_USER_ID="<your-user-id>"`
    - `npm run import:json`
  - CMD：
    - `set SUPABASE_URL=...`
    - `set SUPABASE_SERVICE_ROLE_KEY=...`
    - `set IMPORT_TARGET_USER_ID=...`
    - `npm run import:json`

## 目前已知限制 / 待辦
- [可選] AI 快速查詢的 prompt/模型可再優化，並將同義/反義詞填入 UI（目前未顯示在表單）。
- [可選] 首頁目前未強制登入；為符合 RLS（未登入查不到資料），可在首頁加上登入提示或改為保護頁。
- [可選] 新增同義詞/反義詞的編輯 UI 與清單篩選。
- [可選] 加上使用者頭像、個人設定頁（例如預設 AI 提供者）。
- [可選] 增加 E2E/單元測試。

## 部署摘要（Vercel）
1. Supabase 建立專案 → SQL Editor 執行 `supabase.sql` → Auth 啟用 Email + 設定 Redirect URLs。
2. 取得 `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`。
3. Vercel 新增專案（Import 此 repo），設定環境變數（含 `NEXT_PUBLIC_SITE_URL`）。
4. Deploy；完成後先到 `/login` 用 Email 收信登入。
5. `/words/new` 新增單字，`/review` 進行複習。

---

如需回溯或擴充，建議先閱讀本檔案與 README 新增章節，並依 TODO 項目逐步完成。
