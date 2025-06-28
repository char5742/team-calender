# Team Calendar - チームカレンダー

**Requires Bun 1.2+**

Googleカレンダーと連携し、チームメンバーのスケジュールを視覚的に表示するWebアプリケーション。

## 🚀 特徴

- チームメンバーのカレンダーを横断的に表示
- LLMによる予定の自動ラベリング
- コンテンツ主導のシンプルな設計
- Astro + Nanostoreによる軽量な実装

## 🛠️ 技術スタック

- **フレームワーク**: Astro
- **状態管理**: Nanostore
- **ビルドツール**: Bun
- **コード品質**: Biome (Linter/Formatter)
- **テスト**: Bun標準
- **Git Hooks**: Lefthook

## 📋 必要要件

- Bun 1.2以上

## 🔧 セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-org/team-calendar.git
cd team-calendar
```

### 2. 依存関係のインストール

```bash
bun install
```

### 3. 環境変数の設定

```bash
# 環境変数ファイルを作成
cat > .env << EOF
# Google Calendar API
GOOGLE_CALENDAR_API_KEY=your-api-key

# LLM API (予定の自動ラベリング用)
LLM_API_KEY=your-llm-api-key
LLM_API_ENDPOINT=https://api.example.com/v1
EOF
```

### 4. 開発サーバーの起動

```bash
bun dev
```

## 🏃‍♂️ 開発

### テストの実行

```bash
# 単体テストの実行
bun test

# テストをウォッチモードで実行
bun test:watch
```

### コード品質チェック

```bash
# Lintとフォーマットチェック
bun run check

# 自動修正
bun run lint:fix
bun run format
```

## 📁 プロジェクト構造

```
src/
├── pages/              # Astroページ
├── components/         # Astroコンポーネント
├── layouts/           # レイアウトコンポーネント
├── stores/            # Nanostoreストア
├── lib/               # ユーティリティ関数
└── loaders/           # Live Content Collections ローダー
```

## 🧪 開発フロー

このプロジェクトはTDD（テスト駆動開発）を採用しています。

### 基本的な開発サイクル

1. **RED**: 失敗するテストを書く
2. **GREEN**: テストを通す最小限の実装をする
3. **REFACTOR**: コードをリファクタリングする

## 🎯 Git Commit規約

Conventional Commitsに従います：

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの意味に影響しない変更
- `refactor`: バグ修正や機能追加を伴わないコード変更
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやツールの変更

例: `feat(calendar): Googleカレンダー連携機能を追加`

## 📄 ライセンス

[MIT License](LICENSE)
