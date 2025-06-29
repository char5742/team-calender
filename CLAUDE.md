---
description: 
globs: 
alwaysApply: false
---
# Team Calendar - チームカレンダー

## プロジェクト概要

Googleカレンダーと連携し、チームメンバーのスケジュールを視覚的に表示することに特化したWebアプリケーション。個々のカレンダーを横断的に表示することで、チーム全体の動向やリソースの空き状況を直感的に把握し、円滑なチーム運営を支援する。

### 主な機能

1. **グループ管理機能**
   - チームメンバーのグループ作成・編集・削除
   - グループメンバーの追加・削除

2. **チームカレンダービュー**
   - 週単位のタイムライン形式での予定表示
   - メンバーごとの横断的なスケジュール表示
   - 終日予定の特別表示

3. **LLMによる自動ラベリング & ハイライト機能**
   - 予定内容の自動解釈とラベル付与
   - ラベルに基づく視覚的ハイライト
   - カスタマイズ可能なハイライトルール

## 技術スタック

- **フレームワーク**: Astro (SSG、コンテンツ主導アプローチ)
- **状態管理**: Nanostore
- **ランタイム/ビルドツール**: Bun
- **コード品質**: Biome (Linter/Formatter)
- **テスト**: Bun Test (単体・統合)、Playwright (E2E)
- **言語**: TypeScript
- **認証**: Google OAuth 2.0
- **データソース**: Google Calendar API v3

## プロジェクト構造

```
team-calendar/
├── src/
│   ├── pages/         # Astroページ
│   ├── components/    # Astroコンポーネント
│   ├── layouts/       # レイアウトコンポーネント
│   ├── stores/        # Nanostoreストア
│   ├── lib/           # ユーティリティ関数とスキーマ定義
│   └── loaders/       # Live Content Collections ローダー
├── docs/              # ドキュメント
│   ├── adr/          # Architecture Decision Records
│   ├── 仕様書.md
│   └── TDD開発フロー.md
└── tests/            # テストファイル
    └── e2e/          # E2Eテスト
```

## 主要な型定義 (src/lib/schema.ts)

```typescript
// 基本的なID型
export type MemberId = string
export type GroupId = string
export type CalendarEventId = string

// チームメンバー
export interface TeamMember {
  id: MemberId
  name: string
  email: string
  avatarUrl?: string
}

// グループ
export interface Group {
  id: GroupId
  name: string
  memberIds: MemberId[]
}

// カレンダーイベント
export interface CalendarEvent {
  id: CalendarEventId
  ownerId: MemberId
  calendarId: string
  title: string
  description?: string
  start: string  // ISO8601
  end: string    // ISO8601
  allDay: boolean
  color?: string
  label?: EventLabel
  highlightStyle?: HighlightStyle
}

// イベントラベル
export type EventLabel = 
  | 'Meeting'      // 会議
  | 'OutOfOffice'  // 外出
  | 'Vacation'     // 休暇
  | 'DocumentWork' // 資料作成
  | 'Other'
```

## 開発手法

### TDD（テスト駆動開発）

t-wadaさんのTDD手法に従った開発フロー：

1. **RED**: 失敗するテストを書く
2. **GREEN**: テストを通す最小限の実装
3. **REFACTOR**: コードをリファクタリング

### Git Commit規約

Conventional Commitsに従う：
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの意味に影響しない変更
- `refactor`: バグ修正や機能追加を伴わないコード変更
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやツールの変更

## アーキテクチャの特徴

### コンテンツ主導アプローチ (ADR-007)

- **レンダリング**: SSG（静的サイト生成）
- **データ取得**: Live Content Collections のライブローダー
- **更新方法**: 画面リロードで更新
- **構成**: シンプルなHTML、CSS、JS
- **アーキテクチャ**: MPA + View Transitions

### 設計原則

- ビューアーに特化（読み取り専用）
- シンプルで軽量な実装
- パフォーマンス重視
- AIフレンドリーな技術選定

## 開発コマンド

```bash
# 開発サーバー起動
bun dev

# テスト実行
bun test
bun test:watch
bun test:e2e

# コード品質チェック
bun run check      # Lint & Format チェック
bun run lint:fix   # Lint 自動修正
bun run format     # フォーマット

# ビルド
bun build

# プレビュー
bun preview
```

---

## Bun 使用ガイドライン

---
description: Use Bun instead of Node.js, npm, pnpm, or vite.
globs: "*.ts, *.tsx, *.html, *.css, *.js, *.jsx, package.json"
alwaysApply: false
---

Default to using Bun instead of Node.js.

### 基本的な使用方法

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Bun automatically loads .env, so don't use dotenv.

### APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.redis` for Redis. Don't use `ioredis`.
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`.
- `WebSocket` is built-in. Don't use `ws`.
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa.

### Testing

Use `bun test` to run tests.

```ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

### Frontend (このプロジェクトではAstroを使用)

本プロジェクトではAstroを使用していますが、Bunの一般的なフロントエンド開発の例：

Use HTML imports with `Bun.serve()`. Don't use `vite`. HTML imports fully support React, CSS, Tailwind.

Server:

```ts
import index from "./index.html"

Bun.serve({
  routes: {
    "/": index,
    "/api/users/:id": {
      GET: (req) => {
        return new Response(JSON.stringify({ id: req.params.id }));
      },
    },
  },
  // optional websocket support
  websocket: {
    open: (ws) => {
      ws.send("Hello, world!");
    },
    message: (ws, message) => {
      ws.send(message);
    },
    close: (ws) => {
      // handle close
    }
  },
  development: {
    hmr: true,
    console: true,
  }
})
```

HTML files can import .tsx, .jsx or .js files directly and Bun's bundler will transpile & bundle automatically. `<link>` tags can point to stylesheets and Bun's CSS bundler will bundle.

```html
<html>
  <body>
    <h1>Hello, world!</h1>
    <script type="module" src="./frontend.tsx"></script>
  </body>
</html>
```

With the following `frontend.tsx`:

```tsx
import React from "react";

// import .css files directly and it works
import './index.css';

import { createRoot } from "react-dom/client";

const root = createRoot(document.body);

export default function Frontend() {
  return <h1>Hello, world!</h1>;
}

root.render(<Frontend />);
```

Then, run index.ts

```sh
bun --hot ./index.ts
```

For more information, read the Bun API docs in `node_modules/bun-types/docs/**.md`.

---

## 環境変数

必要な環境変数（`.env`ファイルで設定）:

```bash
# Google Calendar API
GOOGLE_CALENDAR_API_KEY=your-api-key

# LLM API (予定の自動ラベリング用)
LLM_API_KEY=your-llm-api-key
LLM_API_ENDPOINT=https://api.example.com/v1
```

## 貢献ガイドライン

1. Issueを作成または既存のIssueを選択
2. featureブランチを作成 (`git checkout -b feature/amazing-feature`)
3. TDDに従って開発
4. Commit規約に従ってコミット (`git commit -m 'feat: 素晴らしい機能を追加'`)
5. ブランチをPush (`git push origin feature/amazing-feature`)
6. Pull Requestを作成

## ライセンス

MIT License

## その他
- biome-ignoreの使用は禁止

## 開発ルール

### コーディング規約
- TypeScriptを使用
- BiomeとBun Testを活用したTDD開発
- コンポーネント駆動開発（Astroコンポーネント）
- biome-ignoreの使用は禁止
  - 2025-01-14: E2Eテストのスキップに使用していたbiome-ignoreを削除
  - テストの実装を改善し、モックデータのリセット制限を受け入れる形で対応