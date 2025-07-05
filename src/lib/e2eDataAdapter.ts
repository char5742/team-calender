import { groupsData } from '../mock/groupsData'
import { teamMembersData } from '../mock/teamMembersData'
import { groupsStore, teamMembersStore } from '../stores/groupStore'
import { generateGroupId } from '../utils/id'
import type { Group, TeamMember } from './schema'
import { initTestStore, isTestMode } from './testMode'

// E2Eテスト用のデータアダプター
export class E2EDataAdapter {
  private static instance: E2EDataAdapter

  private constructor() {
    if (isTestMode() && typeof window !== 'undefined') {
      initTestStore()
      this.initializeMockData()
    }
  }

  static getInstance(): E2EDataAdapter {
    if (!E2EDataAdapter.instance) {
      E2EDataAdapter.instance = new E2EDataAdapter()
    }
    return E2EDataAdapter.instance
  }

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
    return groupsStore.get()
  }

  // チームメンバー取得
  getTeamMembers(): TeamMember[] {
    if (isTestMode() && typeof window !== 'undefined' && window.e2eTestStore) {
      return window.e2eTestStore.teamMembers || []
    }
    return teamMembersStore.get()
  }

  // グループ作成
  createGroup(name: string, memberIds: string[]): Group {
    const newGroup: Group = {
      id: generateGroupId(),
      name,
      memberIds,
    }

    if (isTestMode() && typeof window !== 'undefined' && window.e2eTestStore) {
      window.e2eTestStore.groups = [...window.e2eTestStore.groups, newGroup]
    } else {
      // 本番環境では実際のストアを使用
      const currentGroups = groupsStore.get()
      groupsStore.set([...currentGroups, newGroup])
    }

    return newGroup
  }

  // グループ更新
  updateGroup(id: string, data: { name: string; memberIds: string[] }): void {
    if (isTestMode() && typeof window !== 'undefined' && window.e2eTestStore) {
      window.e2eTestStore.groups = window.e2eTestStore.groups.map((g) =>
        g.id === id ? { ...g, ...data } : g,
      )
    } else {
      // 本番環境では実際のストアを使用
      const currentGroups = groupsStore.get()
      groupsStore.set(currentGroups.map((g) => (g.id === id ? { ...g, ...data } : g)))
    }
  }

  // グループ削除
  deleteGroup(id: string): void {
    if (isTestMode() && typeof window !== 'undefined' && window.e2eTestStore) {
      window.e2eTestStore.groups = window.e2eTestStore.groups.filter((g) => g.id !== id)
    } else {
      // 本番環境では実際のストアを使用
      const currentGroups = groupsStore.get()
      groupsStore.set(currentGroups.filter((g) => g.id !== id))
    }
  }
}

// シングルトンインスタンスをエクスポート
export const dataAdapter = E2EDataAdapter.getInstance()
