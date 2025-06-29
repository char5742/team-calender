import type { Group, TeamMember } from './schema'

// テスト用のストアの型定義
interface TestStore {
  groups: Group[]
  teamMembers: TeamMember[]
  initialized: boolean
}

// グローバルオブジェクトの型拡張
declare global {
  interface Window {
    __E2E_TEST_STORE__?: TestStore
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

// テストモードでのみモックデータを使用するためのネームスペース
export const TEST_NAMESPACE = '__E2E_TEST_STORE__' as const

// テスト用のストアを初期化
export const initTestStore = () => {
  if (typeof window === 'undefined') {
    return
  }

  if (!window.__E2E_TEST_STORE__) {
    window.__E2E_TEST_STORE__ = {
      groups: [],
      teamMembers: [],
      initialized: false,
    }
  }
}

// テストストアのクリーンアップ
export const cleanupTestStore = () => {
  if (typeof window !== 'undefined' && window.__E2E_TEST_STORE__) {
    window.__E2E_TEST_STORE__ = undefined
  }
}
