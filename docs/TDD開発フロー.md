# TDD（テスト駆動開発）フロー

このプロジェクトでは、t-wadaさんのTDD手法に従って開発を進めます。

## 基本的な開発サイクル

### 1. RED（失敗するテストを書く）
```bash
# テストファイルを作成
touch src/lib/__tests__/calendar.spec.ts

# テストを実行（失敗することを確認）
bun test
```

### 2. GREEN（テストを通す最小限の実装）
- 最小限のコードでテストを通す
- この段階では設計の美しさは考えない

### 3. REFACTOR（リファクタリング）
- テストが通った状態を維持しながらコードを改善
- DRY原則、SOLID原則に従う

## 開発手順

### 1. ライブラリ関数のテスト
```typescript
// src/lib/__tests__/calendar.spec.ts
import { describe, it, expect } from 'bun:test'
import { formatEventDate } from '../calendar'

describe('formatEventDate', () => {
  it('日付を正しくフォーマットできる', () => {
    // Arrange
    const date = new Date('2024-01-01T10:00:00')
    
    // Act
    const result = formatEventDate(date)
    
    // Assert
    expect(result).toBe('2024年1月1日 10:00')
  })
})
```

### 2. ストアのテスト
```typescript
// src/stores/__tests__/calendar.spec.ts
import { describe, it, expect, beforeEach } from 'bun:test'
import { calendarStore } from '../calendar'

describe('calendarStore', () => {
  beforeEach(() => {
    calendarStore.set({ events: [] })
  })

  it('イベントを追加できる', () => {
    const event = { id: '1', title: 'ミーティング' }
    calendarStore.addEvent(event)
    
    const state = calendarStore.get()
    expect(state.events).toHaveLength(1)
    expect(state.events[0].title).toBe('ミーティング')
  })
})
```

### 3. ローダーのテスト
```typescript
// src/loaders/__tests__/calendar.spec.ts
import { describe, it, expect, mock } from 'bun:test'
import { calendarLoader } from '../calendar'

describe('calendarLoader', () => {
  it('カレンダーデータを読み込める', async () => {
    // Arrange
    const mockFetch = mock(() => Promise.resolve({
      json: () => Promise.resolve({ events: [] })
    }))
    global.fetch = mockFetch
    
    // Act
    const result = await calendarLoader()
    
    // Assert
    expect(mockFetch).toHaveBeenCalled()
    expect(result).toHaveProperty('events')
  })
})
```

## テストの種類

### 1. 単体テスト（Unit Tests）
- **対象**: ライブラリ関数、ストア、ユーティリティ
- **ツール**: Bun Test
- **実行**: `bun test`

### 2. 統合テスト（Integration Tests）
- **対象**: API連携、データローダー
- **ツール**: Bun Test + モック
- **実行**: `bun test:integration`

### 3. E2Eテスト（End-to-End Tests）
- **対象**: ユーザーシナリオ全体
- **ツール**: Playwright
- **実行**: `bun test:e2e`

## CI/CDパイプライン

### コミット時（軽量チェック）
1. Biomeによるフォーマット
2. Biomeによるリント

### プッシュ時（完全チェック）
1. 全テストの実行
2. 型チェック
3. ビルドの確認

## テストのベストプラクティス

### 1. AAA（Arrange-Act-Assert）パターン
```typescript
it('should...', () => {
  // Arrange: テストの準備
  const input = createTestData()
  
  // Act: テスト対象の実行
  const result = functionUnderTest(input)
  
  // Assert: 結果の検証
  expect(result).toBe(expected)
})
```

### 2. テストの独立性
- 各テストは他のテストに依存しない
- テストの実行順序に依存しない

### 3. テストの命名規則
- 日本語で何をテストしているか明確に記述
- `it('〜できる')` または `it('〜の場合、〜になる')`

### 4. モックの使用
- 外部依存はモック化する
- ただし、過度なモック化は避ける

## テストカバレッジ

目標カバレッジ:
- ライブラリ関数: 100%
- ストア: 90%以上
- ローダー: 80%以上
- コンポーネント: 70%以上

カバレッジレポート生成:
```bash
bun test:coverage
``` 