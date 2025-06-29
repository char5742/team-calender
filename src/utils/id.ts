/**
 * 安全なユニークIDを生成する
 * crypto.randomUUID()を優先的に使用し、利用できない場合はフォールバック
 */
export const generateId = (prefix?: string): string => {
  let uniqueId: string

  try {
    // crypto.randomUUID()が利用可能な場合（ブラウザとNode.js 14.17+）
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      uniqueId = crypto.randomUUID()
    } else {
      // フォールバック: タイムスタンプ + ランダム値
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(2, 15)
      const randomPart2 = Math.random().toString(36).substring(2, 15)
      uniqueId = `${timestamp}-${random}-${randomPart2}`
    }
  } catch (_error) {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    uniqueId = `${timestamp}-${random}`
  }

  return prefix ? `${prefix}-${uniqueId}` : uniqueId
}

/**
 * グループID専用の生成関数
 */
export const generateGroupId = (): string => {
  return generateId('group')
}

/**
 * フォームID専用の生成関数
 */
export const generateFormId = (): string => {
  return generateId('form')
}

/**
 * モーダルID専用の生成関数
 */
export const generateModalId = (): string => {
  return generateId('modal')
}
