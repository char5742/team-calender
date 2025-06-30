# Modern CSS Architecture

このディレクトリには、チームカレンダーアプリケーションのスタイルシステムが含まれています。

## アーキテクチャ概要

Modern CSS の最新機能を活用したレイヤードアーキテクチャを採用しています：

- **@layer** による明示的なカスケード管理
- **oklch色空間** による一貫した色管理
- **相対カラー機能** によるテーマカラーの動的生成
- **カスタムメディアクエリ** によるレスポンシブ対応
- **CSS変数** によるトークンシステム

## ディレクトリ構造

```
styles/
├── globals.css          # エントリーポイント、レイヤー定義
├── reset.css           # ブラウザのデフォルトスタイルをリセット
├── tokens/             # デザイントークン
│   ├── tokens.css      # トークンのエントリーポイント
│   ├── color.css       # カラーシステム（oklch）
│   ├── typography.css  # フォント、テキストスタイル
│   ├── spacing.css     # スペーシングシステム
│   ├── elevation.css   # シャドウ、z-index
│   └── animation.css   # アニメーション、トランジション
├── base/               # 基本要素のスタイル
│   ├── base.css       # HTML要素の基本スタイル
│   └── form.css       # フォーム要素のスタイル
├── components/         # コンポーネント固有のスタイル
│   ├── components.css # コンポーネントのエントリーポイント
│   ├── button.css     # ボタンスタイル
│   ├── card.css       # カードレイアウト
│   └── modal.css      # モーダル、ポップオーバー
└── utilities/          # ユーティリティクラス
    └── utilities.css  # 汎用ユーティリティ

```

## レイヤー構成

CSSカスケードレイヤーの優先順位（低→高）：

1. **reset** - ブラウザのデフォルトスタイルをリセット
2. **tokens** - デザイントークン（CSS変数）
3. **base** - HTML要素の基本スタイル
4. **components** - 再利用可能なコンポーネント
5. **utilities** - ユーティリティクラス（最高優先度）

## カラーシステム

### oklch色空間

より自然で一貫性のある色管理のため、oklch色空間を採用：

```css
/* 明度(L) 彩度(C) 色相(H) */
--color-primary-500: oklch(60 0.24 250);
```

### 相対カラー機能

基準色から派生色を自動生成：

```css
/* ライトモード */
--color-primary-400: oklch(from var(--color-primary-500) calc(l + 10) c h);
--color-primary-600: oklch(from var(--color-primary-500) calc(l - 10) c h);

/* ダークモード - 明度を反転 */
--color-primary-400: oklch(from var(--color-primary-500) calc(90 - l + 10) c h);
```

## 使用方法

### HTML/Astroでの使用

Layout.astroがglobals.cssをインポートしています。個別のコンポーネントでの追加インポートは不要です。

```astro
---
import Layout from '../layouts/Layout.astro'
---

<Layout title="ページタイトル">
  <!-- コンテンツ -->
</Layout>
```

### CSS変数の使用

```css
.my-component {
  color: var(--color-text-primary);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) var(--easing-in-out);
}
```

### ユーティリティクラス

必要最小限のユーティリティクラスを提供：

```html
<div class="minimal-card">
  <p class="visual-secondary">補助テキスト</p>
  <button class="minimal-hover">ホバーエフェクト付きボタン</button>
</div>
```

## ダークモード対応

CSS変数による自動切り替え：

```css
/* ライトモード（デフォルト） */
:root {
  --color-background: oklch(100 0 0);
  --color-text-primary: oklch(10 0 0);
}

/* ダークモード */
html.dark {
  --color-background: oklch(8 0 0);
  --color-text-primary: oklch(95 0 0);
}
```

## パフォーマンス最適化

- @layerによる効率的なカスケード管理
- CSS変数による動的な値の再利用
- 未使用スタイルの削除による軽量化
- モジュール化による必要な部分のみの読み込み

## 移行ガイド

旧システム（design-system.css）からの移行：

1. すべてのページでLayout.astroを使用
2. design-system.cssへの直接参照を削除
3. animations.cssへの直接参照を削除
4. CSS変数名は変更なし（互換性維持）

## 今後の計画

- コンテナクエリの導入
- カスケードレイヤーの更なる最適化
- スコープ付きスタイルの検討
- CSS Nestingの段階的導入 