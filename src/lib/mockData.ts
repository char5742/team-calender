import { groupsStore, teamMembersStore } from '../stores/groupStore'
import type { Group, TeamMember } from './schema'

// モックのチームメンバーデータ
export const mockTeamMembers: TeamMember[] = [
  {
    id: 'member-1',
    name: '山田太郎',
    email: 'yamada@example.com',
  },
  {
    id: 'member-2',
    name: '佐藤花子',
    email: 'sato@example.com',
  },
  {
    id: 'member-3',
    name: '鈴木一郎',
    email: 'suzuki@example.com',
  },
  {
    id: 'member-4',
    name: '田中美咲',
    email: 'tanaka@example.com',
  },
  {
    id: 'member-5',
    name: '高橋健太',
    email: 'takahashi@example.com',
  },
  {
    id: 'member-6',
    name: '渡辺 由美',
    email: 'watanabe@example.com',
  },
]

// モックのグループデータ
export const mockGroups: Group[] = [
  {
    id: 'group-1',
    name: '開発チーム',
    memberIds: ['member-1', 'member-2', 'member-3'],
  },
  {
    id: 'group-2',
    name: '営業チーム',
    memberIds: ['member-4', 'member-5'],
  },
  {
    id: 'group-3',
    name: 'マーケティングチーム',
    memberIds: ['member-4', 'member-5', 'member-6'],
  },
  {
    id: 'group-4',
    name: 'プロジェクトA',
    memberIds: ['member-1', 'member-4', 'member-5'],
  },
]

// モックデータをストアに設定する関数
export function loadMockData() {
  teamMembersStore.set(mockTeamMembers)
  groupsStore.set(mockGroups)
}
