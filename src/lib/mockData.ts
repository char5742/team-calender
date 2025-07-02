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

  // 一般的な予定タイプの定義
  const generalEventTypes = [
    { title: '定例会議', color: '#1976D2', label: 'Meeting' as const },
    { title: 'プロジェクト会議', color: '#1976D2', label: 'Meeting' as const },
    { title: '1on1ミーティング', color: '#1976D2', label: 'Meeting' as const },
    { title: '外出（クライアント訪問）', color: '#388E3C', label: 'OutOfOffice' as const },
    { title: '外出（セミナー参加）', color: '#388E3C', label: 'OutOfOffice' as const },
    { title: '資料作成', color: '#F57C00', label: 'DocumentWork' as const },
    { title: '企画書作成', color: '#F57C00', label: 'DocumentWork' as const },
    { title: '報告書作成', color: '#F57C00', label: 'DocumentWork' as const },
  ]

  // 営業専用の予定タイプの定義
  const salesEventTypes = [
    { title: '新規顧客訪問', color: '#388E3C', label: 'OutOfOffice' as const },
    { title: '既存顧客フォロー', color: '#388E3C', label: 'OutOfOffice' as const },
    { title: '商談（初回）', color: '#388E3C', label: 'OutOfOffice' as const },
    { title: '商談（クロージング）', color: '#388E3C', label: 'OutOfOffice' as const },
    { title: 'プレゼンテーション', color: '#388E3C', label: 'OutOfOffice' as const },
    { title: '見積書作成', color: '#F57C00', label: 'DocumentWork' as const },
    { title: '提案書作成', color: '#F57C00', label: 'DocumentWork' as const },
    { title: '営業会議', color: '#1976D2', label: 'Meeting' as const },
    { title: '売上報告会議', color: '#1976D2', label: 'Meeting' as const },
    { title: '営業戦略会議', color: '#1976D2', label: 'Meeting' as const },
    { title: 'テレアポ', color: '#9C27B0', label: 'Other' as const },
    { title: 'メール営業', color: '#9C27B0', label: 'Other' as const },
    { title: '展示会参加', color: '#388E3C', label: 'OutOfOffice' as const },
    { title: '競合調査', color: '#795548', label: 'Other' as const },
    { title: '顧客データ整理', color: '#795548', label: 'Other' as const },
    { title: 'CRM入力', color: '#795548', label: 'Other' as const },
    { title: '営業研修', color: '#00BCD4', label: 'Other' as const },
    { title: '製品勉強会', color: '#00BCD4', label: 'Other' as const },
  ]

  // 営業チームメンバーのIDを定義
  const salesTeamMemberIds = ['member-4', 'member-5']

  // 各メンバーに予定を生成
  mockTeamMembers.forEach((member, _memberIndex) => {
    // 営業チームメンバーかどうかで予定数と種類を変える
    const isSalesTeam = salesTeamMemberIds.includes(member.id)
    const eventCount = isSalesTeam
      ? 30 + Math.floor(Math.random() * 21)
      : 6 + Math.floor(Math.random() * 3) // 営業チームは30-50件、他は6-8件
    const eventTypes = isSalesTeam ? [...generalEventTypes, ...salesEventTypes] : generalEventTypes

    // 営業チーム用の時間帯別の予定タイプ
    const morningEventTypes = [
      { title: '朝礼', color: '#1976D2', label: 'Meeting' as const },
      { title: '営業ミーティング', color: '#1976D2', label: 'Meeting' as const },
      { title: 'メールチェック・返信', color: '#795548', label: 'Other' as const },
      { title: '当日のスケジュール確認', color: '#795548', label: 'Other' as const },
    ]

    const lunchEventTypes = [
      { title: 'ランチミーティング', color: '#4CAF50', label: 'Meeting' as const },
      { title: '接待ランチ', color: '#4CAF50', label: 'Meeting' as const },
    ]

    const eveningEventTypes = [
      { title: '日報作成', color: '#F57C00', label: 'DocumentWork' as const },
      { title: '翌日の準備', color: '#795548', label: 'Other' as const },
      { title: '見積もり最終確認', color: '#F57C00', label: 'DocumentWork' as const },
      { title: '接待（夕食）', color: '#4CAF50', label: 'Meeting' as const },
    ]

    for (let i = 0; i < eventCount; i++) {
      // 営業チームは営業専用の予定を優先的に選択
      let eventType: (typeof eventTypes)[number]
      if (isSalesTeam && Math.random() < 0.7) {
        // 70%の確率で営業専用の予定を選択
        eventType = salesEventTypes[Math.floor(Math.random() * salesEventTypes.length)]
      } else {
        eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
      }

      // 先週、今週、来週のいずれかの週を選択
      const weekOptions = [lastWeekStart, thisWeekStart, nextWeekStart]
      const selectedWeek = weekOptions[Math.floor(Math.random() * weekOptions.length)]

      // 週内のランダムな日を選択（月〜金）
      const dayOffset = Math.floor(Math.random() * 5) // 0-4 (月-金)
      const eventDate = new Date(selectedWeek)
      eventDate.setDate(eventDate.getDate() + dayOffset)

      // 営業チームは朝早くから夜遅くまで活動
      let startHour: number, startMinute: number, duration: number

      if (isSalesTeam) {
        // 時間帯に応じて予定タイプを選択
        const hourRand = Math.random()
        if (hourRand < 0.15 && i % 5 === 0) {
          // 朝の予定（8-9時）
          startHour = 8
          startMinute = Math.random() < 0.5 ? 0 : 30
          duration = 0.5
          eventType = morningEventTypes[Math.floor(Math.random() * morningEventTypes.length)]
        } else if (hourRand < 0.25 && i % 7 === 0) {
          // ランチタイムの予定（12-13時）
          startHour = 12
          startMinute = 0
          duration = 1
          eventType = lunchEventTypes[Math.floor(Math.random() * lunchEventTypes.length)]
        } else if (hourRand < 0.35 && i % 6 === 0) {
          // 夕方～夜の予定（17-20時）
          startHour = 17 + Math.floor(Math.random() * 3)
          startMinute = 0
          duration = [1, 1.5, 2, 3][Math.floor(Math.random() * 4)]
          eventType = eveningEventTypes[Math.floor(Math.random() * eveningEventTypes.length)]
        } else {
          // 通常の営業時間（8-19時）
          startHour = 8 + Math.floor(Math.random() * 11)
          startMinute = Math.random() < 0.5 ? 0 : 30

          // 外出系の予定は長めに設定
          if (eventType.label === 'OutOfOffice') {
            duration = [2, 2.5, 3, 3.5, 4][Math.floor(Math.random() * 5)]
          } else {
            duration = [0.5, 1, 1.5, 2][Math.floor(Math.random() * 4)]
          }
        }
      } else {
        // 他のチームは9-17時
        startHour = 9 + Math.floor(Math.random() * 8)
        startMinute = Math.random() < 0.5 ? 0 : 30
        duration = [0.5, 1, 1.5, 2, 2.5, 3][Math.floor(Math.random() * 6)]
      }

      const startDate = new Date(eventDate)
      startDate.setHours(startHour, startMinute, 0, 0)

      const endDate = new Date(startDate)
      endDate.setTime(startDate.getTime() + duration * 60 * 60 * 1000)

      // 営業チームは20時まで、他は17時まで
      const maxHour = isSalesTeam ? 20 : 17
      if (
        endDate.getHours() > maxHour ||
        (endDate.getHours() === maxHour && endDate.getMinutes() > 0)
      ) {
        endDate.setHours(maxHour, 0, 0, 0)
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

    // 営業チームには全日予定も追加
    if (isSalesTeam) {
      // 全日予定のバリエーションを増やす
      const allDayEvents = [
        { title: '地方出張（大阪）', color: '#D32F2F', label: 'OutOfOffice' as const },
        { title: '地方出張（名古屋）', color: '#D32F2F', label: 'OutOfOffice' as const },
        { title: '地方出張（福岡）', color: '#D32F2F', label: 'OutOfOffice' as const },
        { title: '展示会（東京ビッグサイト）', color: '#D32F2F', label: 'OutOfOffice' as const },
        { title: '展示会（幕張メッセ）', color: '#D32F2F', label: 'OutOfOffice' as const },
        { title: '営業合宿', color: '#D32F2F', label: 'Other' as const },
        { title: '年次顧客カンファレンス', color: '#D32F2F', label: 'OutOfOffice' as const },
        { title: '社内研修（終日）', color: '#9C27B0', label: 'Other' as const },
        { title: '健康診断', color: '#607D8B', label: 'Other' as const },
        { title: '有給休暇', color: '#00BCD4', label: 'Vacation' as const },
        { title: '半日有給（午前）', color: '#00BCD4', label: 'Vacation' as const },
        { title: '半日有給（午後）', color: '#00BCD4', label: 'Vacation' as const },
      ]

      const weekOptions = [lastWeekStart, thisWeekStart, nextWeekStart]
      weekOptions.forEach((week) => {
        // 各週に2-3件の全日予定を追加
        const allDayCount = 2 + Math.floor(Math.random() * 2)
        for (let j = 0; j < allDayCount; j++) {
          if (Math.random() < 0.7) {
            // 70%の確率で全日予定を追加
            const dayOffset = Math.floor(Math.random() * 5)
            const eventDate = new Date(week)
            eventDate.setDate(eventDate.getDate() + dayOffset)

            const allDayEvent = allDayEvents[Math.floor(Math.random() * allDayEvents.length)]

            // 半日有給の場合は時間を設定
            let isHalfDay = false
            let halfDayStart: Date | undefined, halfDayEnd: Date | undefined
            if (allDayEvent.title.includes('半日有給（午前）')) {
              isHalfDay = true
              halfDayStart = new Date(eventDate)
              halfDayStart.setHours(9, 0, 0, 0)
              halfDayEnd = new Date(eventDate)
              halfDayEnd.setHours(13, 0, 0, 0)
            } else if (allDayEvent.title.includes('半日有給（午後）')) {
              isHalfDay = true
              halfDayStart = new Date(eventDate)
              halfDayStart.setHours(13, 0, 0, 0)
              halfDayEnd = new Date(eventDate)
              halfDayEnd.setHours(18, 0, 0, 0)
            }

            events.push({
              id: `event-${member.id}-allday-${week.toISOString()}-${j}`,
              ownerId: member.id,
              calendarId: `calendar-${member.id}`,
              title: allDayEvent.title,
              start: isHalfDay
                ? halfDayStart?.toISOString() || eventDate.toISOString()
                : eventDate.toISOString(),
              end: isHalfDay
                ? halfDayEnd?.toISOString() || eventDate.toISOString()
                : eventDate.toISOString(),
              allDay: !isHalfDay,
              color: allDayEvent.color,
              label: allDayEvent.label,
              highlightStyle: {
                color: allDayEvent.color,
              },
            })
          }
        }
      })

      // 定期的な予定も追加（毎週月曜の朝礼など）
      const recurringEvents = [
        {
          title: '週次営業会議',
          dayOfWeek: 1,
          hour: 9,
          duration: 1,
          color: '#1976D2',
          label: 'Meeting' as const,
        },
        {
          title: '週次売上レビュー',
          dayOfWeek: 5,
          hour: 16,
          duration: 1,
          color: '#1976D2',
          label: 'Meeting' as const,
        },
      ]

      weekOptions.forEach((week) => {
        recurringEvents.forEach((recurring) => {
          const eventDate = new Date(week)
          eventDate.setDate(eventDate.getDate() + recurring.dayOfWeek - 1) // 月曜は1

          const startDate = new Date(eventDate)
          startDate.setHours(recurring.hour, 0, 0, 0)

          const endDate = new Date(startDate)
          endDate.setTime(startDate.getTime() + recurring.duration * 60 * 60 * 1000)

          events.push({
            id: `event-${member.id}-recurring-${week.toISOString()}-${recurring.title}`,
            ownerId: member.id,
            calendarId: `calendar-${member.id}`,
            title: recurring.title,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            allDay: false,
            color: recurring.color,
            label: recurring.label,
            highlightStyle: {
              color: recurring.color,
            },
          })
        })
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
