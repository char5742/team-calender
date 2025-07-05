import { atom } from 'nanostores'
import type { CalendarEvent } from '../lib/schema'

export const calendarEventsStore = atom<CalendarEvent[]>([])

// サーバーサイドレンダリング時にライブコレクションから読み込んでストアにセット
if (import.meta.env.SSR) {
  ;(async () => {
    const { getLiveCollection } = await import('astro:content')
    const res = await getLiveCollection('events')
    const eventsArr = Array.isArray(res) ? res : (res?.entries ?? [])
    const events = eventsArr.map(
      (entry: { data: unknown }): CalendarEvent => entry.data as CalendarEvent,
    )
    calendarEventsStore.set(events)
  })()
}
