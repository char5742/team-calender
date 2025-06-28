# Architecture Decision Records (ADR)

このディレクトリには、プロジェクトの重要な設計決定を記録します。

## ADRとは

Architecture Decision Record（ADR）は、プロジェクトにおける重要な設計上の決定を文書化したものです。
なぜその決定を下したのか、どのような選択肢があったのか、その結果どうなったのかを記録します。

## ADR一覧

- [ADR-002: テスト駆動開発（TDD）の採用](./002-test-driven-development.md)
- [ADR-003: YAGNI原則に基づく最小限の設定](./003-yagni-principle.md)
- [ADR-004: 二段階CIによる品質管理](./004-two-stage-ci.md)
- [ADR-005: 技術スタックの選定](./005-technology-stack.md)
- [ADR-006: 厳格なコード品質管理](./006-strict-code-quality.md)
- [ADR-007: Astroによるコンテンツ主導アプローチ](./007-astro-content-driven-approach.md)

## ADRテンプレート

```markdown
# ADR-XXX: [タイトル]

## ステータス

[提案中 | 採用 | 廃止 | 置き換え]

## コンテキスト

[なぜこの決定が必要なのか、背景情報]

## 決定

[実際に決定した内容]

## 選択肢

[検討した他の選択肢]

## 結果

[この決定によってもたらされる結果、トレードオフ]
``` 