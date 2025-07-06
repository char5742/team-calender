import { groupsData } from '../mock/groupsData'
import { teamMembersData } from '../mock/teamMembersData'
import { generateGroupId } from '../utils/id'
import type { Group, TeamMember } from './schema'
import { initTestStore, isTestMode } from './testMode'

/**
 * E2Eテスト専用のデータアダプター
 * テスト環境では window.e2eTestStore を使用し、
 * 本番環境では実際のストアを使用する
 */
export class E2EDataAdapter {
  constructor() {
    if (isTestMode()) {
      initTestStore()
      this.initializeMockData()
    }
  }

  /**
   * テスト環境用のモックデータを初期化
   */
  private initializeMockData(): void {
    if (typeof window === 'undefined' || !window.e2eTestStore) {
      return
    }

    if (!window.e2eTestStore.initialized) {
      window.e2eTestStore.groups = [...groupsData]
      window.e2eTestStore.teamMembers = [...teamMembersData]
      window.e2eTestStore.initialized = true
    }
  }

  // グループ取得
  getGroups(): Group[] {
    if (isTestMode() && typeof window !== 'undefined' && window.e2eTestStore) {
      return window.e2eTestStore.groups || []
    }
    // 本番環境では空配列を返す（Live Collectionを使用するため）
    return []
  }

  // チームメンバー取得
  getTeamMembers(): TeamMember[] {
    if (isTestMode() && typeof window !== 'undefined' && window.e2eTestStore) {
      return window.e2eTestStore.teamMembers || []
    }
    // 本番環境では空配列を返す（Live Collectionを使用するため）
    return []
  }

  // グループ作成 (members)
  createGroup(name: string, members: TeamMember[]): Group {
    const newGroup: Group = {
      id: generateGroupId(),
      name,
      members,
    } as unknown as Group

    if (isTestMode() && typeof window !== 'undefined' && window.e2eTestStore) {
      window.e2eTestStore.groups = [...window.e2eTestStore.groups, newGroup]
    }

    return newGroup
  }

  // グループ更新
  updateGroup(id: string, data: { name: string; members: TeamMember[] }): void {
    if (isTestMode() && typeof window !== 'undefined' && window.e2eTestStore) {
      window.e2eTestStore.groups = window.e2eTestStore.groups.map((g) =>
        g.id === id ? { ...g, ...data } : g,
      )
    }
  }

  // グループ削除
  deleteGroup(id: string): void {
    if (isTestMode() && typeof window !== 'undefined' && window.e2eTestStore) {
      window.e2eTestStore.groups = window.e2eTestStore.groups.filter((g) => g.id !== id)
    }
  }
}

// シングルトンインスタンス
export const dataAdapter = new E2EDataAdapter()
