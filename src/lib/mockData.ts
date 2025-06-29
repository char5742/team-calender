import { groupsStore, teamMembersStore } from '../stores/groupStore'
import { addWeeks, getWeekStart } from '../utils/dateUtils'
import type { CalendarEvent, Group, TeamMember } from './schema'

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

// モックのカレンダーイベントデータ
export const mockCalendarEvents: CalendarEvent[] = (() => {
  const events: CalendarEvent[] = []
  const now = new Date()
  const thisWeekStart = getWeekStart(now)
  const lastWeekStart = addWeeks(thisWeekStart, -1)
  const nextWeekStart = addWeeks(thisWeekStart, 1)

  // 予定タイプの定義
  const eventTypes = [
    { title: '定例会議', color: '#1976D2', label: 'Meeting' as const },
    { title: 'プロジェクト会議', color: '#1976D2', label: 'Meeting' as const },
    { title: '1on1ミーティング', color: '#1976D2', label: 'Meeting' as const },
    { title: '外出（クライアント訪問）', color: '#388E3C', label: 'OutOfOffice' as const },
    { title: '外出（セミナー参加）', color: '#388E3C', label: 'OutOfOffice' as const },
    { title: '資料作成', color: '#F57C00', label: 'DocumentWork' as const },
    { title: '企画書作成', color: '#F57C00', label: 'DocumentWork' as const },
    { title: '報告書作成', color: '#F57C00', label: 'DocumentWork' as const },
  ]

  // 各メンバーに予定を生成
  mockTeamMembers.forEach((member, _memberIndex) => {
    // 各メンバーに6-8件の予定を生成
    const eventCount = 6 + Math.floor(Math.random() * 3)

    for (let i = 0; i < eventCount; i++) {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]

      // 先週、今週、来週のいずれかの週を選択
      const weekOptions = [lastWeekStart, thisWeekStart, nextWeekStart]
      const selectedWeek = weekOptions[Math.floor(Math.random() * weekOptions.length)]

      // 週内のランダムな日を選択（月〜金）
      const dayOffset = Math.floor(Math.random() * 5) // 0-4 (月-金)
      const eventDate = new Date(selectedWeek)
      eventDate.setDate(eventDate.getDate() + dayOffset)

      // 開始時刻を9-17時の間でランダムに設定
      const startHour = 9 + Math.floor(Math.random() * 8)
      const startMinute = Math.random() < 0.5 ? 0 : 30

      // 予定の長さを30分〜3時間でランダムに設定
      const durationOptions = [0.5, 1, 1.5, 2, 2.5, 3]
      const duration = durationOptions[Math.floor(Math.random() * durationOptions.length)]

      const startDate = new Date(eventDate)
      startDate.setHours(startHour, startMinute, 0, 0)

      const endDate = new Date(startDate)
      endDate.setTime(startDate.getTime() + duration * 60 * 60 * 1000)

      // 17時を超える場合は17時に調整
      if (endDate.getHours() > 17 || (endDate.getHours() === 17 && endDate.getMinutes() > 0)) {
        endDate.setHours(17, 0, 0, 0)
      }

      events.push({
        id: `event-${member.id}-${i + 1}`,
        ownerId: member.id,
        calendarId: `calendar-${member.id}`,
        title: eventType.title,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        allDay: false,
        color: eventType.color,
        label: eventType.label,
        highlightStyle: {
          color: eventType.color,
        },
      })
    }
  })

  // 開始時刻でソート
  events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

  return events
})()

// モックデータをストアに設定する関数
export function loadMockData() {
  teamMembersStore.set(mockTeamMembers)
  groupsStore.set(mockGroups)
  // TODO: CalendarEventのストアを作成後、ここに追加
  // calendarEventsStore.set(mockCalendarEvents)
}
