import { expect, test } from '@playwright/test'

// 🎯 サンプルテスト: Playwright が正しくセットアップされているか確認
// このテストは非常にシンプルで、ブラウザを起動せずに即座に PASS します。
// 将来的にブラウザ E2E テストを書く際のひな形としても利用できます。

test('sample: 1 + 1 = 2', () => {
  expect(1 + 1).toBe(2)
})
