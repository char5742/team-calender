import type { Group, TeamMember } from './schema.ts'

// テスト用のストアの型定義
interface TestStore {
  groups: Group[]
  teamMembers: TeamMember[]
  initialized: boolean
}

// グローバルオブジェクトの型拡張
declare global {
  interface Window {
    e2eTestStore?: TestStore
  }
}

// E2Eテストモードの判定と管理
export const isTestMode = () => {
  // 環境変数でE2Eモードを判定
  return (
    import.meta.env.MODE === 'test' ||
    import.meta.env.VITE_TEST_MODE === 'true' ||
    // Playwrightのユーザーエージェントを検出
    (typeof window !== 'undefined' && window.navigator?.userAgent?.includes('Playwright'))
  )
}

// テスト用のストアを初期化
export function initTestStore() {
  if (typeof window === 'undefined') {
    return
  }

  if (!window.e2eTestStore) {
    window.e2eTestStore = {
      groups: [],
      teamMembers: [],
      initialized: false,
    }
  }
}

// テストストアのクリーンアップ
export function clearTestStore() {
  if (typeof window !== 'undefined' && window.e2eTestStore) {
    window.e2eTestStore = undefined
  }
}
