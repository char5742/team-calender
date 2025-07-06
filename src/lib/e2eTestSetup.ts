import { groupsData } from '../mock/groupsData'
import { teamMembersData } from '../mock/teamMembersData'

// E2Eテスト用のグローバル設定
declare global {
  interface Window {
    e2eTestMode: boolean
    e2eMockData: {
      groups: typeof groupsData
      teamMembers: typeof teamMembersData
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
    window.e2eTestMode = true
    window.e2eMockData = {
      groups: [...groupsData],
      teamMembers: [...teamMembersData],
    }
  }
}

// E2Eテスト環境かどうかを判定
export function isE2ETestMode(): boolean {
  return typeof window !== 'undefined' && window.e2eTestMode === true
}

// E2Eテスト用のモックデータを取得
export function getE2EMockData() {
  if (isE2ETestMode() && window.e2eMockData) {
    return {
      groups: [...window.e2eMockData.groups],
      teamMembers: [...window.e2eMockData.teamMembers],
    }
  }
  return null
}
