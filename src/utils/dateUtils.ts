/**
 * 指定された日付の週の開始日（月曜日）を取得する
 * @param date 基準となる日付
 * @returns 週の開始日（月曜日）
 */
export function getWeekStart(date: Date): Date {
  const result = new Date(date)
  const day = result.getDay()
  // 日曜日は0なので、月曜日を基準に調整
  const diff = day === 0 ? -6 : 1 - day
  result.setDate(result.getDate() + diff)
  result.setHours(0, 0, 0, 0)
  return result
}

/**
 * 指定された日付の週の終了日（日曜日）を取得する
 * @param date 基準となる日付
 * @returns 週の終了日（日曜日）
 */
export function getWeekEnd(date: Date): Date {
  const result = new Date(date)
  const day = result.getDay()
  // 日曜日は0なので、そのまま使用
  const diff = day === 0 ? 0 : 7 - day
  result.setDate(result.getDate() + diff)
  result.setHours(23, 59, 59, 999)
  return result
}

/**
 * 日付を指定されたフォーマットで文字列化する
 * @param date フォーマットする日付
 * @param format フォーマット文字列
 * @returns フォーマットされた日付文字列
 */
export function formatDate(date: Date, format: string): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  let result = format
  // 長いパターンから先に置換する
  result = result.replace('YYYY', year.toString())
  result = result.replace('MM', month.toString().padStart(2, '0'))
  result = result.replace('DD', day.toString().padStart(2, '0'))
  // 短いパターンは後で置換
  result = result.replace('M', month.toString())
  result = result.replace('D', day.toString())

  return result
}

/**
 * 指定された週数を日付に加算する
 * @param date 基準となる日付
 * @param weeks 加算する週数（負数も可）
 * @returns 週数を加算した新しい日付
 */
export function addWeeks(date: Date, weeks: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + weeks * 7)
  return result
}
