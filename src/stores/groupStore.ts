import { atom } from 'nanostores'
import { mockGroups, mockTeamMembers } from '../lib/mockData'
import type { Group, TeamMember } from '../lib/schema'

// グループ一覧のストア
export const groupsStore = atom<Group[]>([])

// チームメンバー一覧のストア
export const teamMembersStore = atom<TeamMember[]>([])

// CSRでストアが空の場合、モックデータで初期化
// これにより編集フォームがクライアント側でも正しく動作する
if (typeof window !== 'undefined') {
  if (groupsStore.get().length === 0) {
    groupsStore.set(mockGroups)
  }
  if (teamMembersStore.get().length === 0) {
    teamMembersStore.set(mockTeamMembers)
  }
}

// 選択中のグループIDのストア
export const selectedGroupIdStore = atom<string | null>(null)

// ローディング状態のストア
export const isLoadingStore = atom<boolean>(false)

// エラー状態のストア
export const errorStore = atom<string | null>(null)

// エラーメッセージをクリアする関数
export function clearError() {
  errorStore.set(null)
}

// グループにメンバー情報を含めた型
export interface GroupWithMembers extends Group {
  members: TeamMember[]
}

// グループIDからメンバー情報を含むグループを取得する関数
export function getGroupWithMembers(groupId: string): GroupWithMembers | null {
  const groups = groupsStore.get()
  const teamMembers = teamMembersStore.get()

  const group = groups.find((g) => g.id === groupId)
  if (!group) {
    return null
  }

  const members = teamMembers.filter((member) => group.memberIds.includes(member.id))

  return {
    ...group,
    members,
  }
}

// すべてのグループにメンバー情報を含めて取得する関数
export function getAllGroupsWithMembers(): GroupWithMembers[] {
  const groups = groupsStore.get()
  const teamMembers = teamMembersStore.get()

  return groups.map((group) => {
    const members = teamMembers.filter((member) => group.memberIds.includes(member.id))

    return {
      ...group,
      members,
    }
  })
}

// 新しいグループを作成する関数
export function createGroup(name: string, memberIds: string[]): Group | null {
  try {
    isLoadingStore.set(true)
    errorStore.set(null)

    // 入力検証
    if (!name || name.trim() === '') {
      throw new Error('グループ名を入力してください')
    }
    if (!memberIds || memberIds.length === 0) {
      throw new Error('メンバーを1人以上選択してください')
    }

    const newGroup: Group = {
      id: crypto.randomUUID(), // ブラウザのAPIを使用してUUIDを生成
      name: name.trim(),
      memberIds,
    }

    const currentGroups = groupsStore.get()
    groupsStore.set([...currentGroups, newGroup])

    return newGroup
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'グループの作成に失敗しました'
    errorStore.set(errorMessage)
    return null
  } finally {
    isLoadingStore.set(false)
  }
}

// グループを更新する関数
export function updateGroup(groupId: string, updates: Partial<Omit<Group, 'id'>>): boolean {
  try {
    isLoadingStore.set(true)
    errorStore.set(null)

    // 入力検証
    if (updates.name !== undefined && (!updates.name || updates.name.trim() === '')) {
      throw new Error('グループ名を入力してください')
    }
    if (updates.memberIds !== undefined && (!updates.memberIds || updates.memberIds.length === 0)) {
      throw new Error('メンバーを1人以上選択してください')
    }

    const currentGroups = groupsStore.get()
    const index = currentGroups.findIndex((g) => g.id === groupId)

    if (index === -1) {
      throw new Error('指定されたグループが見つかりません')
    }

    const updatedGroup = {
      ...currentGroups[index],
      ...updates,
      name: updates.name ? updates.name.trim() : currentGroups[index].name,
    }

    const newGroups = [...currentGroups]
    newGroups[index] = updatedGroup
    groupsStore.set(newGroups)

    return true
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'グループの更新に失敗しました'
    errorStore.set(errorMessage)
    return false
  } finally {
    isLoadingStore.set(false)
  }
}

// グループを削除する関数
export function deleteGroup(groupId: string): boolean {
  try {
    isLoadingStore.set(true)
    errorStore.set(null)

    const currentGroups = groupsStore.get()
    const newGroups = currentGroups.filter((g) => g.id !== groupId)

    if (newGroups.length === currentGroups.length) {
      throw new Error('指定されたグループが見つかりません')
    }

    groupsStore.set(newGroups)

    // 選択中のグループが削除された場合はnullにリセット
    if (selectedGroupIdStore.get() === groupId) {
      selectedGroupIdStore.set(null)
    }

    return true
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'グループの削除に失敗しました'
    errorStore.set(errorMessage)
    return false
  } finally {
    isLoadingStore.set(false)
  }
}
