/** Перемешивание Фишера–Йетса (копия массива). */
export function shuffle(list) {
  const result = [...list]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/** Случайная позиция в процентах внутри безопасной зоны. */
export function randomSafePercent({
  minX = 8,
  maxX = 82,
  minY = 10,
  maxY = 78,
} = {}) {
  const x = minX + Math.random() * (maxX - minX)
  const y = minY + Math.random() * (maxY - minY)
  return { x, y }
}

export function pickRandom(list) {
  if (!list?.length) return ''
  return list[Math.floor(Math.random() * list.length)]
}
