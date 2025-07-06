import { type CalendarEvent, CalendarEventSchema } from '../lib/schema'
import { getWeekStart } from '../utils/dateUtils'
import { teamMembersData as teamMembers } from './teamMembersData'

/**
 * Generate CalendarEvents for the current week (Monday-Sunday) for demo purposes.
 * Each team member gets 2 random events between 09:00-17:00.
 */
export function generateWeeklyEvents(weekStartDate?: Date): CalendarEvent[] {
  // Resolve the week start date. If a date is provided we normalise it to the start of that week (Monday).
  // Otherwise, we fall back to the current date.
  const resolvedWeekStart = weekStartDate ?? new Date()
  const weekStart = getWeekStart(resolvedWeekStart) // Monday 00:00

  const events: CalendarEvent[] = []
  let seq = 0

  const eventTypes = [
    { title: 'Meeting', color: '#1976D2' },
    { title: 'Document Work', color: '#F57C00' },
    { title: 'Client Visit', color: '#388E3C' },
  ]

  for (const member of teamMembers) {
    for (let i = 0; i < 2; i++) {
      const dayOffset = Math.floor(Math.random() * 5) // Mon-Fri
      const startHour = 9 + Math.floor(Math.random() * 8)
      const startMinute = Math.random() < 0.5 ? 0 : 30

      const start = new Date(weekStart)
      start.setDate(start.getDate() + dayOffset)
      start.setHours(startHour, startMinute, 0, 0)

      const durationHours = 0.5 + Math.floor(Math.random() * 4) // 0.5-3.5h
      const end = new Date(start)
      end.setTime(start.getTime() + durationHours * 60 * 60 * 1000)

      const type = eventTypes[Math.floor(Math.random() * eventTypes.length)]

      events.push({
        id: `event-${seq++}`,
        ownerId: member.id,
        calendarId: `calendar-${member.id}`,
        title: type.title,
        start: start.toISOString(),
        end: end.toISOString(),
        allDay: false,
        color: type.color,
      })
    }
  }

  // Validate before returning
  return CalendarEventSchema.array().parse(events)
}
