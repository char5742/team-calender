// アプリケーションで使用する主要データスキーマを定義する
// 仕様書 (docs/仕様書.md) を参照

import { z } from 'zod'

/**
 * 各種 ID は現時点では文字列とする (UUID, Google 由来の ID など)
 */
export const MemberIdSchema = z.string()
export type MemberId = z.infer<typeof MemberIdSchema>

export const GroupIdSchema = z.string()
export type GroupId = z.infer<typeof GroupIdSchema>

export const CalendarEventIdSchema = z.string()
export type CalendarEventId = z.infer<typeof CalendarEventIdSchema>

/**
 * ユーザーは名前のみ保持
 */
export const TeamMemberSchema = z.object({
  /** メンバー識別子 (Google Account ID など) */
  id: MemberIdSchema,
  /** 表示名 (Google プロフィール名) */
  name: z.string(),
  /** Google アカウントのメールアドレス */
  email: z.string().email(),
})
export type TeamMember = z.infer<typeof TeamMemberSchema>

/**
 * カレンダーをまとめて表示するためのグループ
 */
export const GroupSchema = z.object({
  /** グループ識別子 */
  id: GroupIdSchema,
  /** 任意のグループ名 */
  name: z.string(),
  /** 所属メンバー (TeamMember.id の配列) */
  memberIds: z.array(MemberIdSchema),
})
export type Group = z.infer<typeof GroupSchema>

/**
 * LLM により付与されるラベル
 * – 実装時には i18n 対応やユーザー定義ラベルも考慮して enum ではなく union 型とする
 */
export const EventLabelSchema = z.union([
  z.literal('Meeting'), // 会議
  z.literal('OutOfOffice'), // 外出
  z.literal('Vacation'), // 休暇
  z.literal('DocumentWork'), // 資料作成
  z.literal('Other'),
])
export type EventLabel = z.infer<typeof EventLabelSchema>

/**
 * ハイライト時のスタイル情報
 */
export const HighlightStyleSchema = z.object({
  /** 背景色 (CSS で解釈可能な値 – 例: #ff0000) */
  color: z.string(),
  /** アイコンを表す文字列 (例: material-symbols 名称など)。任意 */
  icon: z.string().optional(),
})
export type HighlightStyle = z.infer<typeof HighlightStyleSchema>

/**
 * 予定 (Google Calendar Event) を格納するモデル
 */
export const CalendarEventSchema = z.object({
  id: CalendarEventIdSchema,
  /** カレンダー所有者 (TeamMember.id) */
  ownerId: MemberIdSchema,
  /** Google Calendar API が返す calendarId */
  calendarId: z.string(),
  /** 予定タイトル */
  title: z.string(),
  /** 予定詳細 (description) – 任意 */
  description: z.string().optional(),
  /** ISO8601 形式の開始日時 */
  start: z.string().datetime(),
  /** ISO8601 形式の終了日時 */
  end: z.string().datetime(),
  /** 終日予定かどうか */
  allDay: z.boolean(),
  /** Google Calendar が持つ元の色 (hex または colorId) */
  color: z.string().optional(),
  /** LLM によるラベル – 任意 */
  label: EventLabelSchema.optional(),
  /** ハイライト用スタイル – 任意 */
  highlightStyle: HighlightStyleSchema.optional(),
})
export type CalendarEvent = z.infer<typeof CalendarEventSchema>

/**
 * ハイライト設定 – ラベルとスタイルのマッピング。
 * ユーザー毎に異なる設定を保持し得るため、設定モデルとは切り離して定義
 */
export const HighlightRuleSchema = z.object({
  label: EventLabelSchema,
  style: HighlightStyleSchema,
})
export type HighlightRule = z.infer<typeof HighlightRuleSchema>

/**
 * ハイライト設定 (シングルユーザーのローカル設定)
 */
export const HighlightConfigSchema = z.object({
  highlightRules: z.array(HighlightRuleSchema),
})
export type HighlightConfig = z.infer<typeof HighlightConfigSchema>

/**
 * 週単位表示に必要な構造体 (UI 層の集計用)
 * – データ取得層ではなく表示ロジック用の構造体として定義
 */
export const WeeklyScheduleSchema = z.object({
  /** 週の開始日 (ISO8601, 00:00:00) */
  weekStart: z.string().datetime(),
  /** 対象グループ */
  groupId: GroupIdSchema,
  /** 週内の予定 (メンバー毎にグループ化) */
  eventsByMember: z.record(MemberIdSchema, z.array(CalendarEventSchema)),
})
export type WeeklySchedule = z.infer<typeof WeeklyScheduleSchema>
