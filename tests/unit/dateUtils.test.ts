import { describe, expect, it } from 'bun:test'
import { addWeeks, formatDate, getWeekEnd, getWeekStart } from '../../src/utils/dateUtils.ts'

describe('dateUtils', () => {
  describe('getWeekStart', () => {
    it('月曜日が渡されたらその日をそのまま返す', () => {
      const monday = new Date('2025-01-13') // 月曜日
      const result = getWeekStart(monday)
      expect(result.toISOString().split('T')[0]).toBe('2025-01-13')
    })

    it('週の途中の日付が渡されたらその週の月曜日を返す', () => {
      const thursday = new Date('2025-01-16') // 木曜日
      const result = getWeekStart(thursday)
      expect(result.toISOString().split('T')[0]).toBe('2025-01-13')
    })

    it('日曜日が渡されたらその週の月曜日を返す', () => {
      const sunday = new Date('2025-01-19') // 日曜日
      const result = getWeekStart(sunday)
      expect(result.toISOString().split('T')[0]).toBe('2025-01-13')
    })
  })

  describe('getWeekEnd', () => {
    it('日曜日が渡されたらその日をそのまま返す', () => {
      const sunday = new Date('2025-01-19') // 日曜日
      const result = getWeekEnd(sunday)
      expect(result.toISOString().split('T')[0]).toBe('2025-01-19')
    })

    it('週の途中の日付が渡されたらその週の日曜日を返す', () => {
      const thursday = new Date('2025-01-16') // 木曜日
      const result = getWeekEnd(thursday)
      expect(result.toISOString().split('T')[0]).toBe('2025-01-19')
    })

    it('月曜日が渡されたらその週の日曜日を返す', () => {
      const monday = new Date('2025-01-13') // 月曜日
      const result = getWeekEnd(monday)
      expect(result.toISOString().split('T')[0]).toBe('2025-01-19')
    })
  })

  describe('formatDate', () => {
    it('YYYY-MM-DD形式でフォーマットできる', () => {
      const date = new Date('2025-01-16')
      const result = formatDate(date, 'YYYY-MM-DD')
      expect(result).toBe('2025-01-16')
    })

    it('MM/DD形式でフォーマットできる', () => {
      const date = new Date('2025-01-16')
      const result = formatDate(date, 'MM/DD')
      expect(result).toBe('01/16')
    })

    it('M月D日形式でフォーマットできる', () => {
      const date = new Date('2025-01-16')
      const result = formatDate(date, 'M月D日')
      expect(result).toBe('1月16日')
    })

    it('YYYY年M月D日形式でフォーマットできる', () => {
      const date = new Date('2025-01-16')
      const result = formatDate(date, 'YYYY年M月D日')
      expect(result).toBe('2025年1月16日')
    })
  })

  describe('addWeeks', () => {
    it('1週間追加できる', () => {
      const date = new Date('2025-01-16')
      const result = addWeeks(date, 1)
      expect(result.toISOString().split('T')[0]).toBe('2025-01-23')
    })

    it('2週間追加できる', () => {
      const date = new Date('2025-01-16')
      const result = addWeeks(date, 2)
      expect(result.toISOString().split('T')[0]).toBe('2025-01-30')
    })

    it('負の週数で過去の日付を取得できる', () => {
      const date = new Date('2025-01-16')
      const result = addWeeks(date, -1)
      expect(result.toISOString().split('T')[0]).toBe('2025-01-09')
    })

    it('0を渡したら同じ日付を返す', () => {
      const date = new Date('2025-01-16')
      const result = addWeeks(date, 0)
      expect(result.toISOString().split('T')[0]).toBe('2025-01-16')
    })
  })
})
