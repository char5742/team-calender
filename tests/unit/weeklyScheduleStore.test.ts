import { beforeEach, describe, expect, it } from 'bun:test'
import { generateWeeklyEvents } from '../../src/mock/dynamicEvents'
import { groupsData } from '../../src/mock/groupsData'
import { groupsStore, selectedGroupIdStore } from '../../src/stores/groupStore'
import {
  currentWeekStartStore,
  getWeeklySchedule,
  nextWeek,
  previousWeek,
  weeklyScheduleStore,
} from '../../src/stores/weeklyScheduleStore'

const groups = groupsData
const calendarEvents = generateWeeklyEvents()

describe('weeklyScheduleStore', () => {
  beforeEach(() => {
    // 各テストの前にストアをリセット
    const monday = new Date()
    monday.setDate(monday.getDate() - monday.getDay() + 1) // 月曜日に設定
    monday.setHours(0, 0, 0, 0)
    currentWeekStartStore.set(monday.toISOString())
    selectedGroupIdStore.set(null)
    groupsStore.set([])
  })

  describe('currentWeekStartStore', () => {
    it('現在の週の開始日を保持できること', () => {
      const testDate = new Date('2025-06-30T00:00:00.000Z')
      currentWeekStartStore.set(testDate.toISOString())
      expect(currentWeekStartStore.get()).toBe(testDate.toISOString())
    })

    it('初期値が現在週の月曜日であること', () => {
      // 新しいストアインスタンスで確認
      const currentDate = new Date()
      const monday = new Date(currentDate)
      monday.setDate(monday.getDate() - monday.getDay() + 1)
      monday.setHours(0, 0, 0, 0)

      const weekStart = new Date(currentWeekStartStore.get())
      expect(weekStart.getDay()).toBe(1) // 月曜日は1
      expect(weekStart.getHours()).toBe(0)
      expect(weekStart.getMinutes()).toBe(0)
      expect(weekStart.getSeconds()).toBe(0)
    })
  })

  describe('nextWeek', () => {
    it('次の週に進めること', () => {
      const currentWeek = new Date('2025-06-30T00:00:00.000Z') // 月曜日
      currentWeekStartStore.set(currentWeek.toISOString())

      nextWeek()

      const nextWeekDate = new Date(currentWeekStartStore.get())
      expect(nextWeekDate.toISOString()).toBe('2025-07-07T00:00:00.000Z')
    })
  })

  describe('previousWeek', () => {
    it('前の週に戻れること', () => {
      const currentWeek = new Date('2025-07-07T00:00:00.000Z') // 月曜日
      currentWeekStartStore.set(currentWeek.toISOString())

      previousWeek()

      const prevWeekDate = new Date(currentWeekStartStore.get())
      expect(prevWeekDate.toISOString()).toBe('2025-06-30T00:00:00.000Z')
    })
  })

  describe('getWeeklySchedule', () => {
    beforeEach(() => {
      groupsStore.set(groups)
    })

    it('指定したグループIDの週間スケジュールを取得できること', () => {
      const groupId = groups[0].id
      const weekStart = '2025-06-30T00:00:00.000Z'
      currentWeekStartStore.set(weekStart)

      const schedule = getWeeklySchedule(groupId, calendarEvents)

      expect(schedule).toBeDefined()
      expect(schedule?.groupId).toBe(groupId)
      expect(schedule?.weekStart).toBe(weekStart)
      expect(schedule?.eventsByMember).toBeDefined()
    })

    it('存在しないグループIDの場合はnullを返すこと', () => {
      const schedule = getWeeklySchedule('non-existent-id', calendarEvents)
      expect(schedule).toBeNull()
    })

    it('メンバーごとに予定が正しくグループ化されること', () => {
      const groupId = groups[0].id
      const _group = groups[0]
      const weekStart = '2025-06-30T00:00:00.000Z'
      currentWeekStartStore.set(weekStart)

      const schedule = getWeeklySchedule(groupId, calendarEvents)

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
  })

  describe('weeklyScheduleStore', () => {
    beforeEach(() => {
      groupsStore.set(groups)
    })

    it('選択されたグループの週間スケジュールが取得できること', () => {
      const groupId = groups[0].id
      selectedGroupIdStore.set(groupId)

      const schedule = weeklyScheduleStore.get()

      expect(schedule).toBeDefined()
      expect(schedule?.groupId).toBe(groupId)
    })

    it('グループが選択されていない場合はnullを返すこと', () => {
      selectedGroupIdStore.set(null)

      const schedule = weeklyScheduleStore.get()

      expect(schedule).toBeNull()
    })

    it('選択グループが変更されたら週間スケジュールも更新されること', () => {
      const groupId1 = groups[0].id
      const groupId2 = groups[1].id

      selectedGroupIdStore.set(groupId1)
      const schedule1 = weeklyScheduleStore.get()
      expect(schedule1?.groupId).toBe(groupId1)

      selectedGroupIdStore.set(groupId2)
      const schedule2 = weeklyScheduleStore.get()
      expect(schedule2?.groupId).toBe(groupId2)
    })

    it('週が変更されたら週間スケジュールも更新されること', () => {
      const groupId = groups[0].id
      selectedGroupIdStore.set(groupId)

      const week1 = '2025-06-30T00:00:00.000Z'
      currentWeekStartStore.set(week1)
      const schedule1 = weeklyScheduleStore.get()
      expect(schedule1?.weekStart).toBe(week1)

      nextWeek()
      const schedule2 = weeklyScheduleStore.get()
      expect(schedule2?.weekStart).toBe('2025-07-07T00:00:00.000Z')
    })
  })
})
