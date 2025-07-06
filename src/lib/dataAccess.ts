import { addWeeks, getWeekStart } from '../utils/dateUtils'
import type { CalendarEvent, Group, MemberId, TeamMember, WeeklySchedule } from './schema'

/**
 * グループとメンバー情報を結合した型
 */
export interface GroupWithMembers extends Group {
  members: TeamMember[]
}

/**
 * グループIDから該当するグループを取得
 */
export function findGroupById(groups: Group[], groupId: string): Group | undefined {
  return groups.find((g) => g.id === groupId)
}

/**
 * チームメンバーIDから該当するメンバーを取得
 */
export function findMemberById(members: TeamMember[], memberId: string): TeamMember | undefined {
  return members.find((m) => m.id === memberId)
}

/**
 * グループとメンバー情報を結合して返す
 */
export function getGroupWithMembers(group: Group, teamMembers: TeamMember[]): GroupWithMembers {
  const members = group.memberIds
    .map((memberId) => findMemberById(teamMembers, memberId))
    .filter((member): member is TeamMember => member !== undefined)

  return {
    ...group,
    members,
  }
}

/**
 * すべてのグループにメンバー情報を結合して返す
 */
export function getAllGroupsWithMembers(
  groups: Group[],
  teamMembers: TeamMember[],
): GroupWithMembers[] {
  return groups.map((group) => getGroupWithMembers(group, teamMembers))
}

/**
 * 現在の週の開始日（月曜日）を計算
 */
export function getCurrentWeekStart(): string {
  const now = new Date()
  const monday = getWeekStart(now)
  return monday.toISOString()
}

/**
 * 次の週へ移動
 */
export function getNextWeekStart(currentWeekStart: string): string {
  const current = new Date(currentWeekStart)
  return addWeeks(current, 1).toISOString()
}

/**
 * 前の週へ移動
 */
export function getPreviousWeekStart(currentWeekStart: string): string {
  const current = new Date(currentWeekStart)
  return addWeeks(current, -1).toISOString()
}

/**
 * 指定されたグループIDの週間スケジュールを取得
 */
export function getWeeklySchedule(
  groupId: string,
  groups: Group[],
  _teamMembers: TeamMember[],
  calendarEvents: CalendarEvent[],
  weekStart: string,
): WeeklySchedule | null {
  const group = findGroupById(groups, groupId)
  if (!group) {
    return null
  }

  const weekStartDate = new Date(weekStart)
  const weekEndDate = addWeeks(weekStartDate, 1)

  // グループメンバーのイベントのみをフィルタリング
  const memberEvents = calendarEvents.filter((event) => {
    const eventStart = new Date(event.start)
    return (
      group.memberIds.includes(event.ownerId) &&
      eventStart >= weekStartDate &&
      eventStart < weekEndDate
    )
  })

  // メンバーごとにイベントをグループ化
  const eventsByMember: Record<MemberId, CalendarEvent[]> = {}
  for (const memberId of group.memberIds) {
    eventsByMember[memberId] = memberEvents
      .filter((event) => event.ownerId === memberId)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
  }

  return {
    weekStart,
    groupId,
    eventsByMember,
  }
}

/**
 * 指定された週の日付範囲を計算
 */
export function getWeekDateRange(weekStart: string): { start: Date; end: Date } {
  const start = new Date(weekStart)
  const end = addWeeks(start, 1)
  return { start, end }
}

/**
 * 日付を週の開始日に正規化
 */
export function normalizeToWeekStart(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return getWeekStart(d).toISOString()
}
