import { mockGroups, mockTeamMembers } from './mockData'

// E2Eテスト用のグローバル設定
declare global {
  interface Window {
    __E2E_TEST_MODE__: boolean
    __E2E_MOCK_DATA__: {
      groups: typeof mockGroups
      teamMembers: typeof mockTeamMembers
    }
  }
}

// E2Eテスト環境の検出と初期化
export function initE2ETestEnvironment(): void {
  if (typeof window === 'undefined') {
    return
  }

  // Playwrightのユーザーエージェントを検出
  const isPlaywright = window.navigator?.userAgent?.includes('Playwright')
  const isTestMode = import.meta.env.VITE_TEST_MODE === 'true'

  if (isPlaywright || isTestMode) {
    window.__E2E_TEST_MODE__ = true
    window.__E2E_MOCK_DATA__ = {
      groups: [...mockGroups],
      teamMembers: [...mockTeamMembers],
    }
  }
}

// E2Eテスト環境かどうかを判定
export function isE2ETestMode(): boolean {
  return typeof window !== 'undefined' && window.__E2E_TEST_MODE__ === true
}

// E2Eテスト用のモックデータを取得
export function getE2EMockData() {
  if (isE2ETestMode() && window.__E2E_MOCK_DATA__) {
    return {
      groups: [...window.__E2E_MOCK_DATA__.groups],
      teamMembers: [...window.__E2E_MOCK_DATA__.teamMembers],
    }
  }
  return null
}
