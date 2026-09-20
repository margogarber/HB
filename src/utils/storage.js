import { gameData } from '../data/gameData'

const KEY = gameData.storageKey

/** Начальное состояние прогресса (готово к сохранению в localStorage). */
export function createDefaultProgress() {
  return {
    currentStep: 0, // 0 = intro, 1–6 = этапы, 7 = письмо
    completedStages: [],
    flowersCollected: 0,
    drafts: {
      memory: null,
      puzzle: null,
      bouquet: null,
    },
    bouquet: null,
    letterOpened: false,
    updatedAt: null,
  }
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return createDefaultProgress()
    const parsed = JSON.parse(raw)
    const base = createDefaultProgress()
    return {
      ...base,
      ...parsed,
      drafts: {
        ...base.drafts,
        ...(parsed.drafts || {}),
      },
    }
  } catch {
    return createDefaultProgress()
  }
}

export function saveProgress(progress) {
  try {
    const payload = {
      ...progress,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem(KEY, JSON.stringify(payload))
    return payload
  } catch {
    return progress
  }
}

export function clearProgress() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
