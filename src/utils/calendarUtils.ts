import type { CalendarEvent } from '../lib/schema.ts'

// 指定週の開始日を基準に、イベントを 7 要素の配列に整理する
export function organizeEventsByDay(events: CalendarEvent[], weekStartDate: Date) {
  const eventsByDay: CalendarEvent[][] = Array.from({ length: 7 }, () => [])

  for (const event of events) {
    const eventStart = new Date(event.start)
    const dayDiff = Math.floor(
      (eventStart.getTime() - weekStartDate.getTime()) / (1000 * 60 * 60 * 24),
    )

    if (dayDiff >= 0 && dayDiff < 7) {
      eventsByDay[dayDiff].push(event)
    }
  }

  return eventsByDay
}

// イベントタイトルやラベルからタイプを判定する
export function getEventType(event: CalendarEvent): string {
  if (event.label) {
    return event.label.toLowerCase()
  }

  if (event.title.includes('会議') || event.title.includes('ミーティング')) {
    return 'meeting'
  }

  return 'work'
}
