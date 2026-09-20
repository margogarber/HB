import { useCallback, useEffect, useRef, useState } from 'react'
import BouquetProgress from './components/BouquetProgress'
import FiliaModal from './components/FiliaModal'
import FinalLetter from './components/FinalLetter'
import Intro from './components/Intro'
import Settings from './components/Settings'
import StageShell from './components/StageShell'
import { gameData } from './data/gameData'
import { useGameProgress } from './hooks/useGameProgress'
import BouquetMaker from './minigames/BouquetMaker'
import CatchHearts from './minigames/CatchHearts'
import FindItems from './minigames/FindItems'
import MemoryCards from './minigames/MemoryCards'
import PhotoPuzzle from './minigames/PhotoPuzzle'
import Quiz from './minigames/Quiz'
import { pickRandom } from './utils/random'
import './App.css'

const STAGE_COMPONENTS = {
  hearts: CatchHearts,
  findItems: FindItems,
  quiz: Quiz,
  memory: MemoryCards,
  puzzle: PhotoPuzzle,
  bouquet: BouquetMaker,
}

const INTERACTIVE_STAGES = new Set([
  'hearts',
  'findItems',
  'quiz',
  'memory',
  'puzzle',
  'bouquet',
])

const STAGE_FILIA_STATE = {
  hearts: 'happy',
  findItems: 'thinking',
  quiz: 'surprised',
  memory: 'neutral',
  puzzle: 'thinking',
  bouquet: 'happy',
}

function App() {
  const {
    currentStep,
    flowersCollected,
    totalStages,
    isIntro,
    isLetter,
    drafts,
    bouquet,
    letterOpened,
    startGame,
    markCurrentStageComplete,
    advanceAfterStage,
    resetProgress,
    saveStageDraft,
    saveBouquet,
    setLetterOpened,
    goToStep,
    isStageCompleted,
  } = useGameProgress({ persist: true })

  const [celebration, setCelebration] = useState(null)
  const skipHistoryPush = useRef(false)
  const historyReady = useRef(false)
  const completingRef = useRef(false)

  const stageIndex = currentStep - 1
  const stage = gameData.stages[stageIndex]
  const StageGame = stage ? STAGE_COMPONENTS[stage.id] : null
  const flowerTypes = gameData.stages.map((item) => item.flower)
  const isInteractive = stage ? INTERACTIVE_STAGES.has(stage.id) : false

  useEffect(() => {
    setCelebration(null)
    completingRef.current = false
  }, [stage?.id])

  // Синхронизация с кнопкой «назад» браузера
  useEffect(() => {
    window.history.replaceState({ happyBd: true, step: currentStep }, '')
    historyReady.current = true

    const onPopState = (event) => {
      if (!event.state?.happyBd || typeof event.state.step !== 'number') return
      skipHistoryPush.current = true
      setCelebration(null)
      goToStep(event.state.step)
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- только при монтировании
  }, [goToStep])

  useEffect(() => {
    if (!historyReady.current) return
    if (skipHistoryPush.current) {
      skipHistoryPush.current = false
      return
    }
    if (window.history.state?.step === currentStep && window.history.state?.happyBd) {
      return
    }
    window.history.pushState({ happyBd: true, step: currentStep }, '')
  }, [currentStep])

  const openCelebration = useCallback(
    (payload = {}) => {
      const line =
        payload.line ||
        pickRandom(gameData.filiaLines.stageComplete) ||
        'Ещё один цветок. Неплохо для человека.'

      setCelebration({
        line,
        state: payload.state || 'happy',
        actionLabel: currentStep === totalStages ? 'К письму' : 'Дальше',
      })
    },
    [currentStep, totalStages],
  )

  const handleInteractiveComplete = useCallback(
    (payload) => {
      if (!stage || celebration || completingRef.current) return
      if (isStageCompleted(stage.id)) return
      completingRef.current = true
      markCurrentStageComplete()
      openCelebration(payload && typeof payload === 'object' ? payload : {})
    },
    [
      celebration,
      isStageCompleted,
      markCurrentStageComplete,
      openCelebration,
      stage,
    ],
  )

  const handleCelebrationClose = useCallback(() => {
    setCelebration(null)
    advanceAfterStage()
  }, [advanceAfterStage])

  const stageId = stage?.id

  const handleDraftChange = useCallback(
    (draft) => {
      if (!stageId) return
      saveStageDraft(stageId, draft)
    },
    [saveStageDraft, stageId],
  )

  const handleReset = useCallback(() => {
    setCelebration(null)
    resetProgress()
    skipHistoryPush.current = true
    window.history.replaceState({ happyBd: true, step: 0 }, '')
  }, [resetProgress])

  let panelKey = 'intro'
  if (isLetter) panelKey = 'letter'
  else if (stage) panelKey = stage.id

  const stageDraft = stage ? drafts?.[stage.id] : null

  return (
    <div className="app">
      <div className="app__glow" aria-hidden="true" />
      <div className="app__frame">
        <Settings onReset={handleReset} />

        {!isIntro && !isLetter && (
          <BouquetProgress
            total={totalStages}
            collected={flowersCollected}
            flowerTypes={flowerTypes}
          />
        )}

        <main className="app__main">
          <div key={panelKey} className="app__panel">
            {isIntro && <Intro onStart={startGame} />}

            {!isIntro && !isLetter && stage && StageGame && (
              <StageShell
                stage={stage}
                stageIndex={stageIndex}
                totalStages={totalStages}
                filiaState={STAGE_FILIA_STATE[stage.id] || 'neutral'}
                showContinue={false}
              >
                <StageGame
                  key={stage.id}
                  onComplete={isInteractive ? handleInteractiveComplete : undefined}
                  draft={stageDraft}
                  onDraftChange={
                    stage.id === 'memory' ||
                    stage.id === 'puzzle' ||
                    stage.id === 'bouquet'
                      ? handleDraftChange
                      : undefined
                  }
                  onBouquetSave={stage.id === 'bouquet' ? saveBouquet : undefined}
                />
              </StageShell>
            )}

            {isLetter && (
              <FinalLetter
                bouquet={bouquet}
                letterOpened={letterOpened}
                onLetterOpened={() => setLetterOpened(true)}
              />
            )}
          </div>
        </main>
      </div>

      <FiliaModal
        open={Boolean(celebration)}
        line={celebration?.line}
        state={celebration?.state || 'happy'}
        actionLabel={celebration?.actionLabel || 'Дальше'}
        onClose={handleCelebrationClose}
      />
    </div>
  )
}

export default App
