import { defineLiveCollection } from 'astro:content'
import type { LiveDataCollection, LiveDataEntry } from 'astro'
import type { LiveLoader, LoadCollectionContext } from 'astro/loaders'
import groupsJson from './data/groups.json'
import type { CalendarEvent, Group, TeamMember } from './lib/schema'
import { generateWeeklyEvents } from './mock/dynamicEvents'
import { teamMembersData } from './mock/teamMembersData'

// 週次で変化するイベントを生成
function loadEventsDynamic() {
  return generateWeeklyEvents()
}

// カレンダーイベントのダミーデータを返すローダー
const eventsLoader: LiveLoader<CalendarEvent> = {
  name: 'events',
  loadCollection: async (
    _context: LoadCollectionContext<never>,
  ): Promise<LiveDataCollection<CalendarEvent>> => {
    const events = loadEventsDynamic()
    return {
      entries: events.map((event) => ({
        id: event.id,
        data: event,
      })),
    }
  },
  loadEntry: async (context): Promise<LiveDataEntry<CalendarEvent>> => {
    const events = loadEventsDynamic()
    const ctx = context as { id?: string; slug?: string }
    const id = ctx.id ?? ctx.slug ?? ''
    const event = events.find((evt) => evt.id === id)
    if (!event) {
      throw new Error(`Event with id ${id} not found`)
    }
    return {
      id: event.id,
      data: event,
    }
  },
}

// グループローダー
const groupsLoader: LiveLoader<Group> = {
  name: 'groups',
  loadCollection: async (): Promise<LiveDataCollection<Group>> => {
    const groups: Group[] = groupsJson as unknown as Group[]
    return {
      entries: groups.map((g) => ({ id: g.id, data: g })),
    }
  },
  loadEntry: async (context): Promise<LiveDataEntry<Group>> => {
    const groups: Group[] = groupsJson as unknown as Group[]
    const ctx = context as { id?: string; slug?: string }
    const id = ctx.id ?? ctx.slug ?? ''
    const group = groups.find((g) => g.id === id)
    if (!group) {
      throw new Error(`Group ${id} not found`)
    }
    return { id: group.id, data: group }
  },
}

// チームメンバーローダー
const teamMembersLoader: LiveLoader<TeamMember> = {
  name: 'teamMembers',
  loadCollection: async (): Promise<LiveDataCollection<TeamMember>> => {
    const members = teamMembersData
    return { entries: members.map((m) => ({ id: m.id, data: m })) }
  },
  loadEntry: async (context): Promise<LiveDataEntry<TeamMember>> => {
    const members = teamMembersData
    const ctx = context as { id?: string; slug?: string }
    const id = ctx.id ?? ctx.slug ?? ''
    const member = members.find((m) => m.id === id)
    if (!member) {
      throw new Error(`Member ${id} not found`)
    }
    return { id: member.id, data: member }
  },
}

const events = defineLiveCollection({
  type: 'live',
  loader: eventsLoader,
})

const groups = defineLiveCollection({ type: 'live', loader: groupsLoader })
const teamMembers = defineLiveCollection({ type: 'live', loader: teamMembersLoader })

export const collections = { events, groups, teamMembers }
