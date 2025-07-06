import groupsJson from '../data/groups.json'
import type { Group } from '../lib/schema'

// Re-export groups from JSON for backward compatibility in tests/e2e
export const groupsData: Group[] = groupsJson as unknown as Group[]
