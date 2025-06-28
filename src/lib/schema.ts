// アプリケーションで使用する主要データスキーマを定義する
// 仕様書 (docs/仕様書.md) を参照

/**
 * 各種 ID は現時点では文字列とする (UUID, Google 由来の ID など)
 */
export type MemberId = string
export type GroupId = string
export type CalendarEventId = string

/**
 * ユーザーは名前のみ保持
 */
export interface TeamMember {
  /** メンバー識別子 (Google Account ID など) */
  id: MemberId
  /** 表示名 (Google プロフィール名) */
  name: string
  /** Google アカウントのメールアドレス */
  email: string
  /** プロフィール画像 URL – 任意 */
  avatarUrl?: string
}

/**
 * カレンダーをまとめて表示するためのグループ
 */
export interface Group {
  /** グループ識別子 */
  id: GroupId
  /** 任意のグループ名 */
  name: string
  /** 所属メンバー (TeamMember.id の配列) */
  memberIds: MemberId[]
}

/**
 * LLM により付与されるラベル
 * – 実装時には i18n 対応やユーザー定義ラベルも考慮して enum ではなく union 型とする
 */
export type EventLabel =
  | 'Meeting' // 会議
  | 'OutOfOffice' // 外出
  | 'Vacation' // 休暇
  | 'DocumentWork' // 資料作成
  | 'Other'

/**
 * ハイライト時のスタイル情報
 */
export interface HighlightStyle {
  /** 背景色 (CSS で解釈可能な値 – 例: #ff0000) */
  color: string
  /** アイコンを表す文字列 (例: material-symbols 名称など)。任意 */
  icon?: string
}

/**
 * 予定 (Google Calendar Event) を格納するモデル
 */
export interface CalendarEvent {
  id: CalendarEventId
  /** カレンダー所有者 (TeamMember.id) */
  ownerId: MemberId
  /** Google Calendar API が返す calendarId */
  calendarId: string
  /** 予定タイトル */
  title: string
  /** 予定詳細 (description) – 任意 */
  description?: string
  /** ISO8601 形式の開始日時 */
  start: string
  /** ISO8601 形式の終了日時 */
  end: string
  /** 終日予定かどうか */
  allDay: boolean
  /** Google Calendar が持つ元の色 (hex または colorId) */
  color?: string
  /** LLM によるラベル – 任意 */
  label?: EventLabel
  /** ハイライト用スタイル – 任意 */
  highlightStyle?: HighlightStyle
}

/**
 * ハイライト設定 – ラベルとスタイルのマッピング。
 * ユーザー毎に異なる設定を保持し得るため、設定モデルとは切り離して定義
 */
export interface HighlightRule {
  label: EventLabel
  style: HighlightStyle
}

/**
 * ハイライト設定 (シングルユーザーのローカル設定)
 */
export interface HighlightConfig {
  highlightRules: HighlightRule[]
}

/**
 * 週単位表示に必要な構造体 (UI 層の集計用)
 * – データ取得層ではなく表示ロジック用の構造体として定義
 */
export interface WeeklySchedule {
  /** 週の開始日 (ISO8601, 00:00:00) */
  weekStart: string
  /** 対象グループ */
  groupId: GroupId
  /** 週内の予定 (メンバー毎にグループ化) */
  eventsByMember: Record<MemberId, CalendarEvent[]>
}
