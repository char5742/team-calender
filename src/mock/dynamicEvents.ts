import eventBlueprints from '../data/eventBlueprints.json'
import { type CalendarEvent, CalendarEventSchema } from '../lib/schema'
import { getWeekStart } from '../utils/dateUtils'
import { teamMembersData as teamMembers } from './teamMembersData'

/**
 * Generate CalendarEvents for the given week (Monday–Sunday).
 *
 * The data MUST remain completely deterministic.  The only dynamic
 * part allowed is the **date** which is calculated from the provided
 * `weekStartDate` (or "now" if omitted).  All other fields – title,
 * colours, durations, ordering – are fixed and never change between
 * runs so that snapshot tests remain stable.
 *
 * ─────────────────────────────────────────────────────────
 * Event specification (per team member)
 *   1. "Sprint Planning"  : Monday   09:00 → 10:30  (#1976D2)
 *   2. "Weekly Sync"      : Wednesday 13:00 → 14:00  (#F57C00)
 *
 * If additional determinism is required in the future simply extend the
 * `FIXED_EVENT_BLUEPRINTS` array below – **never** introduce randomness.
 */
export function generateWeeklyEvents(weekStartDate?: Date): CalendarEvent[] {
  // 1. Normalise the supplied date (or today) to the Monday of that week.
  const resolvedWeekStart = getWeekStart(weekStartDate ?? new Date()) // Monday 00:00

  // 2. Fixed blueprints – external JSON describes the **shape** of each event.
  type EventBlueprint = {
    ownerId: string
    dayOffset: number
    /** If allDay is true, start/end times will be set to full day */
    allDay?: boolean
    startHour?: number
    startMinute?: number
    durationMinutes?: number
    title: string
    description?: string
    label?: 'Meeting' | 'OutOfOffice' | 'Vacation' | 'DocumentWork' | 'Other'
    color?: string
    highlightStyle?: {
      color: string
      icon?: string
    }
  }

  const fixedEventBlueprints: EventBlueprint[] = eventBlueprints as EventBlueprint[]

  // 3. Create events for every team-member using the blueprints above.
  const events: CalendarEvent[] = []

  let seq = 0
  for (const blueprint of fixedEventBlueprints) {
    // Verify owner exists — fallback skip if not found to keep integrity.
    const member = teamMembers.find((m) => m.id === blueprint.ownerId)
    if (!member) continue

    const start = new Date(resolvedWeekStart)
    start.setDate(start.getDate() + blueprint.dayOffset)

    if (blueprint.allDay) {
      start.setHours(0, 0, 0, 0)
    } else {
      // Default to 9:00 if time not provided
      const sh = blueprint.startHour ?? 9
      const sm = blueprint.startMinute ?? 0
      start.setHours(sh, sm, 0, 0)
    }

    const end = new Date(start)
    if (blueprint.allDay) {
      end.setHours(23, 59, 59, 999)
    } else {
      const duration = blueprint.durationMinutes ?? 60
      end.setMinutes(start.getMinutes() + duration)
    }

    events.push({
      id: `event-${seq++}`,
      ownerId: member.id,
      calendarId: `calendar-${member.id}`,
      title: blueprint.title,
      description: blueprint.description,
      start: start.toISOString(),
      end: end.toISOString(),
      allDay: Boolean(blueprint.allDay),
      color: blueprint.color,
      label: blueprint.label,
      highlightStyle: blueprint.highlightStyle,
    })
  }

  // 4. Runtime validation – guarantees schema adherence.
  return CalendarEventSchema.array().parse(events)
}
