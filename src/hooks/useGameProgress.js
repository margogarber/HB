import { useCallback, useEffect, useState } from 'react'
import { gameData } from '../data/gameData'
import {
  clearProgress,
  createDefaultProgress,
  loadProgress,
  saveProgress,
} from '../utils/storage'

const TOTAL_STAGES = gameData.stages.length
const FINAL_STEP = TOTAL_STAGES + 1

function normalizeProgress(raw) {
  const base = createDefaultProgress()
  const completedStages = Array.isArray(raw.completedStages)
    ? [...new Set(raw.completedStages.filter(Boolean))]
    : []

  const flowersCollected = completedStages.length

  let currentStep =
    typeof raw.currentStep === 'number' ? raw.currentStep : base.currentStep

  const minStep = flowersCollected === TOTAL_STAGES ? FINAL_STEP : flowersCollected + 1
  if (flowersCollected > 0 && currentStep < minStep) {
    currentStep = minStep
  }

  currentStep = Math.max(0, Math.min(FINAL_STEP, currentStep))

  return {
    ...base,
    ...raw,
    completedStages,
    flowersCollected,
    currentStep,
    drafts: {
      ...base.drafts,
      ...(raw.drafts || {}),
    },
    bouquet: raw.bouquet ?? null,
    letterOpened: Boolean(raw.letterOpened),
  }
}

/**
 * Управление шагами игры + localStorage.
 * Цветок за этап начисляется только один раз.
 */
export function useGameProgress({ persist = true } = {}) {
  const [progress, setProgress] = useState(() =>
    normalizeProgress(persist ? loadProgress() : createDefaultProgress()),
  )

  useEffect(() => {
    if (persist) {
      saveProgress(progress)
    }
  }, [progress, persist])

  const goToStep = useCallback((step) => {
    setProgress((prev) => ({
      ...prev,
      currentStep: Math.max(0, Math.min(FINAL_STEP, step)),
    }))
  }, [])

  const startGame = useCallback(() => {
    setProgress((prev) => {
      const nextStep =
        prev.completedStages.length >= TOTAL_STAGES
          ? FINAL_STEP
          : prev.completedStages.length + 1
      return {
        ...prev,
        currentStep: nextStep,
      }
    })
  }, [])

  const markCurrentStageComplete = useCallback(() => {
    setProgress((prev) => {
      const stageIndex = prev.currentStep - 1
      if (stageIndex < 0 || stageIndex >= TOTAL_STAGES) {
        return prev
      }

      const stageId = gameData.stages[stageIndex].id
      const already = prev.completedStages.includes(stageId)
      const completedStages = already
        ? prev.completedStages
        : [...prev.completedStages, stageId]

      return {
        ...prev,
        completedStages,
        flowersCollected: completedStages.length,
        drafts: {
          ...prev.drafts,
          [stageId]: null,
        },
      }
    })
  }, [])

  const advanceAfterStage = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      currentStep: Math.min(FINAL_STEP, prev.currentStep + 1),
    }))
  }, [])

  const completeCurrentStage = useCallback(() => {
    setProgress((prev) => {
      const stageIndex = prev.currentStep - 1
      if (stageIndex < 0 || stageIndex >= TOTAL_STAGES) {
        return prev
      }

      const stageId = gameData.stages[stageIndex].id
      const completedStages = prev.completedStages.includes(stageId)
        ? prev.completedStages
        : [...prev.completedStages, stageId]

      return {
        ...prev,
        completedStages,
        flowersCollected: completedStages.length,
        currentStep: Math.min(FINAL_STEP, prev.currentStep + 1),
        drafts: {
          ...prev.drafts,
          [stageId]: null,
        },
      }
    })
  }, [])

  const saveStageDraft = useCallback((stageId, draft) => {
    setProgress((prev) => ({
      ...prev,
      drafts: {
        ...prev.drafts,
        [stageId]: draft,
      },
    }))
  }, [])

  const saveBouquet = useCallback((bouquet) => {
    setProgress((prev) => ({
      ...prev,
      bouquet,
      drafts: {
        ...prev.drafts,
        bouquet: bouquet
          ? {
              step: 'done',
              main: bouquet.main,
              extras: bouquet.extras,
              ribbon: bouquet.ribbon,
            }
          : null,
      },
    }))
  }, [])

  const setLetterOpened = useCallback((opened = true) => {
    setProgress((prev) => ({
      ...prev,
      letterOpened: Boolean(opened),
    }))
  }, [])

  const resetProgress = useCallback(() => {
    clearProgress()
    setProgress(createDefaultProgress())
  }, [])

  const isStageCompleted = useCallback(
    (stageId) => progress.completedStages.includes(stageId),
    [progress.completedStages],
  )

  return {
    progress,
    currentStep: progress.currentStep,
    flowersCollected: progress.flowersCollected,
    completedStages: progress.completedStages,
    drafts: progress.drafts,
    bouquet: progress.bouquet,
    letterOpened: progress.letterOpened,
    totalStages: TOTAL_STAGES,
    isIntro: progress.currentStep === 0,
    isLetter: progress.currentStep === FINAL_STEP,
    startGame,
    markCurrentStageComplete,
    advanceAfterStage,
    completeCurrentStage,
    saveStageDraft,
    saveBouquet,
    setLetterOpened,
    goToStep,
    resetProgress,
    isStageCompleted,
  }
}
