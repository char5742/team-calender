import { atom, computed } from 'nanostores'
import { mockCalendarEvents } from '../lib/mockData'
import type { CalendarEvent, WeeklySchedule } from '../lib/schema'
import { groupsStore, selectedGroupIdStore } from './groupStore'

// 現在の週の開始日（月曜日）を管理するストア
function getCurrentMonday(): Date {
  // sessionStorageから保存された週を取得
  if (typeof window !== 'undefined') {
    const savedWeek = sessionStorage.getItem('currentWeekStart')
    if (savedWeek) {
      return new Date(savedWeek)
    }
  }

  const now = new Date()
  const dayOfWeek = now.getDay()
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek // 日曜日は0なので、-6日して月曜日に
  const monday = new Date(now)
  monday.setDate(now.getDate() + diff)
  monday.setHours(0, 0, 0, 0)
  monday.setMilliseconds(0)
  return monday
}

export const currentWeekStartStore = atom<string>(getCurrentMonday().toISOString())

// ストアの値が変更されたらsessionStorageに保存
currentWeekStartStore.subscribe((value) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('currentWeekStart', value)
  }
})

// 次の週に進む
export function nextWeek() {
  const current = new Date(currentWeekStartStore.get())
  current.setDate(current.getDate() + 7)
  currentWeekStartStore.set(current.toISOString())
}

// 前の週に戻る
export function previousWeek() {
  const current = new Date(currentWeekStartStore.get())
  current.setDate(current.getDate() - 7)
  currentWeekStartStore.set(current.toISOString())
}

// グループIDから週間スケジュールを取得する関数
export function getWeeklySchedule(
  groupId: string,
  calendarEvents: CalendarEvent[],
): WeeklySchedule | null {
  const groups = groupsStore.get()
  const group = groups.find((g) => g.id === groupId)

  if (!group) {
    return null
  }

  const weekStart = currentWeekStartStore.get()
  const weekStartDate = new Date(weekStart)
  const weekEndDate = new Date(weekStartDate)
  weekEndDate.setDate(weekEndDate.getDate() + 7)

  // メンバーごとに予定をグループ化
  const eventsByMember: Record<string, CalendarEvent[]> = {}

  // グループのメンバー全員分の空配列を初期化
  for (const memberId of group.memberIds) {
    eventsByMember[memberId] = []
  }

  // 週内の予定をフィルタリングしてメンバーごとに振り分け
  for (const event of calendarEvents) {
    // このイベントのオーナーがグループメンバーかチェック
    if (!group.memberIds.includes(event.ownerId)) {
      continue
    }

    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)

    // 週内の予定かチェック（開始時刻が週内にあるか、または終了時刻が週内にあるか）
    if (
      (eventStart >= weekStartDate && eventStart < weekEndDate) ||
      (eventEnd > weekStartDate && eventEnd <= weekEndDate) ||
      (eventStart < weekStartDate && eventEnd > weekEndDate)
    ) {
      eventsByMember[event.ownerId].push(event)
    }
  }

  return {
    weekStart,
    groupId,
    eventsByMember,
  }
}

// 選択されたグループの週間スケジュールを返すcomputed store
export const weeklyScheduleStore = computed(
  [selectedGroupIdStore, currentWeekStartStore],
  (selectedGroupId, _weekStart) => {
    if (!selectedGroupId) {
      return null
    }

    // 実際の実装では、ここでAPIからデータを取得するか、
    // 別のストアからカレンダーイベントを取得する
    // 現時点ではモックデータを使用
    return getWeeklySchedule(selectedGroupId, mockCalendarEvents)
  },
)
