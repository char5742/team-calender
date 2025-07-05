import type { Group } from '../lib/schema'

export const groupsData: Group[] = [
  { id: 'group-1', name: '開発チーム', memberIds: ['member-1', 'member-2', 'member-3'] },
  { id: 'group-2', name: '営業チーム', memberIds: ['member-4', 'member-5'] },
  { id: 'group-3', name: 'マーケティングチーム', memberIds: ['member-4', 'member-5', 'member-6'] },
  { id: 'group-4', name: 'プロジェクトA', memberIds: ['member-1', 'member-4', 'member-5'] },
]
