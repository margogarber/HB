import { useCallback, useId, useRef, useState } from 'react'
import { gameData } from '../data/gameData'
import { randomSafePercent } from '../utils/random'
import './CatchHearts.css'

function HeartIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path
        d="M16 27S4 19.5 4 11.5C4 7.4 7.1 5 10.5 5c2.1 0 4 1.1 5.5 2.8C17.5 6.1 19.4 5 21.5 5 24.9 5 28 7.4 28 11.5 28 19.5 16 27 16 27Z"
        fill="currentColor"
      />
    </svg>
  )
}

/**
 * Ловля семи сердечек — по одному, без таймера и проигрыша.
 */
export default function CatchHearts({ onComplete }) {
  const target = gameData.hearts?.target ?? 7
  const labelId = useId()
  const [caught, setCaught] = useState(0)
  const [heart, setHeart] = useState(() => ({
    id: 0,
    ...randomSafePercent(),
  }))
  const [done, setDone] = useState(false)
  const [pop, setPop] = useState(false)
  const completedRef = useRef(false)

  const spawnNext = useCallback((nextCount) => {
    setHeart({
      id: nextCount,
      ...randomSafePercent(),
    })
  }, [])

  const handleCatch = useCallback(() => {
    if (done || pop || completedRef.current) return

    setPop(true)
    const next = caught + 1

    window.setTimeout(() => {
      setCaught(next)
      setPop(false)

      if (next >= target) {
        setDone(true)
        if (!completedRef.current) {
          completedRef.current = true
          onComplete?.()
        }
      } else {
        spawnNext(next)
      }
    }, 220)
  }, [caught, done, onComplete, pop, spawnNext, target])

  return (
    <div className="catch-hearts">
      <div className="catch-hearts__hud" id={labelId}>
        <span>Поймано</span>
        <strong>
          {caught}/{target}
        </strong>
      </div>

      <div
        className="catch-hearts__arena"
        role="application"
        aria-labelledby={labelId}
        aria-describedby={`${labelId}-hint`}
      >
        <p id={`${labelId}-hint`} className="visually-hidden">
          Нажимайте на сердечко пальцем или клавишами Enter и Пробел. Нужно поймать {target}.
        </p>

        {!done && (
          <button
            key={heart.id}
            type="button"
            className={`catch-hearts__heart ${pop ? 'is-pop' : ''}`}
            style={{ left: `${heart.x}%`, top: `${heart.y}%` }}
            onClick={handleCatch}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                handleCatch()
              }
            }}
            aria-label={`Поймать сердечко ${caught + 1} из ${target}`}
          >
            <HeartIcon />
          </button>
        )}

        {done && (
          <p className="catch-hearts__done" role="status">
            Все сердечки пойманы
          </p>
        )}
      </div>
    </div>
  )
}
