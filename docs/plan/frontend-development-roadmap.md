# フロントエンド開発ロードマップ

本ドキュメントは、チームカレンダーアプリのフロントエンド開発における具体的なタスクロードマップです。  
各Issueを順番に消化することで、段階的に機能を完成させることができます。

## 前提条件

1. Bunのバージョン固定は `.bun-version` でのみ行う（Voltaなどは使用しない）
2. CI（GitHub Actions）は使用せず、**lefthook** でローカル品質チェックを自動化
3. LLMラベリングはBE側で完結するため、FEでは一切考慮しない
4. 外部ライブラリのドキュメント参照には **Context7** を活用

---

## マイルストーン 0 ― プロジェクト下準備（Code Quality & Hook 基盤）

| # | タイトル | 概要 | 受け入れ基準 |
|---|----------|------|-------------|
| M0-1 | chore: `.bun-version` 追加と Bun 導入 | `.bun-version` に `1.1.x`（最新安定）を記載<br/>README 最上部に "Requires Bun 1.1+" を追記 | `bun -v` が `.bun-version` と一致 |
| M0-2 | chore: Biome Lint / Format 設定 | `biome.json` にプロジェクト標準ルール（strict, importOrder など）記載 | `bunx biome check .` でエラー 0<br/>`bunx biome format --write` で差分 0 |
| M0-3 | chore: Playwright インストール & 初期サンプル | `bun add -D @playwright/test`<br/>`bunx playwright install --with-deps`<br/>`tests/e2e/sample.spec.ts` にデフォルトテストを生成 | サンプルテストがPASS |
| M0-4 | chore: lefthook 設定ファイル作成 | pre-commitフックでlint/unit/e2eを実行する設定を追加 | `lefthook run pre-commit` 実行で３コマンドすべてグリーン |
| M0-5 | docs: ADR 追加 ― Context7 利用方針 | `docs/adr/008-context7-docs.md` に外部ライブラリ参照方針を記載 | ADRレビュー完了 |

### lefthook設定例
```yaml
pre-commit:
  commands:
    lint:
      run: bunx biome check .
    unit:
      run: bun test
    e2e:
      run: bunx playwright test --config=playwright.config.ts --project=chromium --reporter=list
```

---

## マイルストーン 1 ― MVP：単一カレンダー週表示（Mock）

| # | タイトル | 概要 | 受け入れ基準 |
|---|----------|------|-------------|
| M1-1 | mock: 固定 Event JSON 作成 | `tests/mocks/events.single-week.json` へ 7 日分サンプル作成 | 型に準拠すること (ts-json-schema-generator で検証) |
| M1-2 | feat: `CalendarServiceMock` 実装 | API: `getWeeklyEvents(startDate: Date): Promise<Event[]>`<br/>戻り値は (M1-1) の JSON を読み込んで返却 | 単体テスト: 呼び出しで必ず同配列が返る |
| M1-3 | feat: `WeekTimeline.vue` 骨格 | Composition API + CSS Grid レイアウト<br/>1 行・24 時間スロット・灰色ブロック描画 | Story: `Timeline/SingleWeekSkeleton` |
| M1-4 | feat: 週送りナビゲーション | コンポーネント `<WeekNavigator>`<br/>左/右クリックで ±1wk 更新 | Story: クリックで Timeline が切替 |
| M1-5 | test: Playwright ― MVP フロー | ページロード → 「次週」→「前週」クリック → screenshot diff = 0 | `tests/e2e/mvp.spec.ts` PASS |
| M1-6 | docs: Mock データ切替方法 | README に `.env` の `USE_MOCK=true` を明記 | ドキュメントレビュー完了 |

### Event型定義
```typescript
type Event = {
  id: string
  title: string
  start: string // ISO
  end: string   // ISO
  allDay: boolean
  colorId: number
}
```

---

## マイルストーン 2 ― グループ機能 & 複数カレンダー（Mock）

| # | タイトル | 概要 | 受け入れ基準 |
|---|----------|------|-------------|
| M2-1 | feat: `GroupStore` (nanostores) | State: `groups: Group[]`, `currentGroupId: string \| null`<br/>Actions: `create`, `update`, `remove`, `setCurrent`<br/>Persistence: LocalStorage | 型エラーなし、CRUD動作確認 |
| M2-2 | feat: `GroupForm.vue` | 必須: name, memberEmails (comma separated)<br/>Error 表示: red text below input<br/>Emit: `save(group)` | バリデーション動作確認 |
| M2-3 | feat: `GroupList.vue` | 一覧・選択・削除 (trash icon)<br/>選択時 `GroupStore.setCurrent` 呼び出し | Storybook で動作確認 |
| M2-4 | mock: `CalendarServiceMock` 拡張 | `events.<member>.json` を読み分ける<br/>メンバー email が存在しない場合は空配列 | 単体テストでマッピング確認 |
| M2-5 | feat: `MultiWeekTimeline.vue` | `props: eventsByMember: Record<string, Event[]>`<br/>行頭に member プレースホルダ (initials) | Story: `Timeline/MultiMember` で 3 人分可視 |
| M2-6 | test: Playwright ― グループ CRUD | 新規グループ作成 → 表示 → メンバー追加 → 行増加確認 | `tests/e2e/group.spec.ts` PASS |
| M2-7 | docs: グループ機能ガイド | `docs/howto/groups.md` に GIF 付き操作例 | ドキュメントレビュー完了 |

---

## マイルストーン 3 ― UI/UX 改善（色 / 詳細 / 終日帯 / A11y）

| # | タイトル | 概要 | 受け入れ基準 |
|---|----------|------|-------------|
| M3-1 | feat: `colorMap.ts` | Google colorId (1–11) → HSL color 定義 | Unit test: 全 11 件マップあり |
| M3-2 | feat: Event 詳細ポップオーバー | `v-tooltip` or 自前 popper<br/>Hover でタイトル・時間・説明表示 | Story snapshot 用 Playwright screenshot test |
| M3-3 | feat: 終日予定帯 | `allDay` イベントはスロット上端に帯 (height 20px)<br/>Overflow 時スクロールバー表示 | Storybook で表示確認 |
| M3-4 | feat: メンバー画像プレースホルダ | `<Avatar :name="John Smith"/>` → "JS" 円形アイコン<br/>アクセシビリティ: `role="img" aria-label="John Smith avatar"` | レイアウト崩れなし |
| M3-5 | chore: レスポンシブ & A11y | 幅 < 768px: 横スクロール (snap)<br/>Lighthouse A11y 90↑, contrast pass | Lighthouse スコア確認 |
| M3-6 | test: Playwright ― UI 回帰 | 375px と 1440px で screenshot 比較 | `tests/e2e/ui.spec.ts` PASS |

---

## 運用方針

1. **lefthook** がすべての品質ゲート
   - commit 前に lint → unit → playwright の順で即時フィードバック

2. **Context7** で公式ドキュメントを常に参照
   - 例: "Vue 3 Transition Group" を実装前に `context7` で検索し URL をコメントに添付

3. **TDD & YAGNI** は ADR に従い継続
   - 必要な Mock のみ実装し、未確定 BE 仕様は追加しない

4. **LLM** は BE で完結
   - FE では「`label`, `highlightColor`, `icon` が既に入った Event DTO を受け取る」前提
   - FE での LLM モック／設定 UI は一切作らない

---

## 補足

このリストを GitHub Issue として順番に登録・消化すれば、  
Bun + lefthook によるローカルフローのみで高品質な FE が段階的に完成します。

各マイルストーンは、1〜2週間のスプリントで完了することを想定しています。  
実装時は必ず上から順番に着手し、各タスクの完了基準を満たしてから次に進んでください。 