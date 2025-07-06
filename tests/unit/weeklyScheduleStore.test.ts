import { beforeEach, describe, expect, it } from 'bun:test'
import {
  getCurrentWeekStart,
  getNextWeekStart,
  getPreviousWeekStart,
  getWeeklySchedule,
  normalizeToWeekStart,
} from '../../src/lib/dataAccess.ts'
import { generateWeeklyEvents } from '../../src/mock/dynamicEvents.ts'
import { groupsData } from '../../src/mock/groupsData.ts'
import { teamMembersData } from '../../src/mock/teamMembersData.ts'

const groups = groupsData
const teamMembers = teamMembersData
let calendarEvents = generateWeeklyEvents(new Date(getCurrentWeekStart()))

describe('dataAccess utilities', () => {
  beforeEach(() => {
    // 各テストの前にイベントを再生成
    const monday = new Date()
    monday.setDate(monday.getDate() - monday.getDay() + 1) // 月曜日に設定
    monday.setHours(0, 0, 0, 0)

    // 週開始日に合わせたイベントを再生成
    calendarEvents = generateWeeklyEvents(monday)
  })

  describe('getCurrentWeekStart', () => {
    it('現在の週の開始日（月曜日）を返すこと', () => {
      const weekStart = new Date(getCurrentWeekStart())
      expect(weekStart.getDay()).toBe(1) // 月曜日は1
      expect(weekStart.getHours()).toBe(0)
      expect(weekStart.getMinutes()).toBe(0)
      expect(weekStart.getSeconds()).toBe(0)
    })
  })

  describe('getNextWeekStart', () => {
    it('次の週の開始日を返すこと', () => {
      const currentWeek = '2025-06-30T00:00:00.000Z' // 月曜日
      const nextWeek = getNextWeekStart(currentWeek)
      expect(nextWeek).toBe('2025-07-07T00:00:00.000Z')
    })
  })

  describe('getPreviousWeekStart', () => {
    it('前の週の開始日を返すこと', () => {
      const currentWeek = '2025-07-07T00:00:00.000Z' // 月曜日
      const prevWeek = getPreviousWeekStart(currentWeek)
      expect(prevWeek).toBe('2025-06-30T00:00:00.000Z')
    })
  })

  describe('normalizeToWeekStart', () => {
    it('任意の日付を週の開始日（月曜日）に正規化すること', () => {
      // 水曜日
      const wednesday = new Date('2025-07-02T15:30:00.000Z')
      const normalized = normalizeToWeekStart(wednesday)
      expect(normalized).toBe('2025-06-30T00:00:00.000Z')
    })

    it('文字列の日付も正規化できること', () => {
      const dateStr = '2025-07-05T12:00:00.000Z' // 土曜日
      const normalized = normalizeToWeekStart(dateStr)
      expect(normalized).toBe('2025-06-30T00:00:00.000Z')
    })
  })

  describe('getWeeklySchedule', () => {
    it('指定したグループIDの週間スケジュールを取得できること', () => {
      const groupId = groups[0].id
      const weekStart = '2025-06-30T00:00:00.000Z'

      const schedule = getWeeklySchedule(groupId, groups, teamMembers, calendarEvents, weekStart)

      expect(schedule).toBeDefined()
      expect(schedule?.groupId).toBe(groupId)
      expect(schedule?.weekStart).toBe(weekStart)
      expect(schedule?.eventsByMember).toBeDefined()
    })

    it('存在しないグループIDの場合はnullを返すこと', () => {
      const schedule = getWeeklySchedule(
        'non-existent-id',
        groups,
        teamMembers,
        calendarEvents,
        '2025-06-30T00:00:00.000Z',
      )
      expect(schedule).toBeNull()
    })

    it('メンバーごとに予定が正しくグループ化されること', () => {
      const groupId = groups[0].id
      const _group = groups[0]
      const weekStart = '2025-06-30T00:00:00.000Z'

      const schedule = getWeeklySchedule(groupId, groups, teamMembers, calendarEvents, weekStart)

      expect(schedule).toBeDefined()
      if (schedule) {
        // グループのメンバー分のエントリがあること
        const memberIds = Object.keys(schedule.eventsByMember)
        expect(memberIds.length).toBeGreaterThan(0)

        // 各メンバーの予定が週内のものだけであること
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekEnd.getDate() + 7)

        for (const memberId of memberIds) {
          const events = schedule.eventsByMember[memberId]
          for (const event of events) {
            const eventStart = new Date(event.start)
            expect(eventStart >= new Date(weekStart)).toBe(true)
            expect(eventStart < weekEnd).toBe(true)
          }
        }
      }
    })

    it('グループに所属しないメンバーの予定は含まれないこと', () => {
      const groupId = groups[0].id
      const group = groups[0]
      const weekStart = '2025-06-30T00:00:00.000Z'

      const schedule = getWeeklySchedule(groupId, groups, teamMembers, calendarEvents, weekStart)

      expect(schedule).toBeDefined()
      if (schedule) {
        const memberIds = Object.keys(schedule.eventsByMember)
        // グループのメンバーIDのみが含まれること
        const groupMemberIds = group.members.map((m) => m.id)
        for (const memberId of memberIds) {
          expect(groupMemberIds).toContain(memberId)
        }
      }
    })
  })
})
