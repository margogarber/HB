import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Filia from '../components/Filia'
import SafePhoto from '../components/SafePhoto'
import { gameData } from '../data/gameData'
import { getPhotoUrl } from '../utils/photoUrl'
import { shuffle } from '../utils/random'
import './PhotoPuzzle.css'

function isSolved(tiles) {
  return tiles.every((value, index) => value === index)
}

function createShuffled(size) {
  const solved = Array.from({ length: size * size }, (_, index) => index)
  let tiles = solved
  let guard = 0
  do {
    tiles = shuffle(solved)
    guard += 1
  } while (isSolved(tiles) && guard < 40)
  if (isSolved(tiles) && tiles.length > 1) {
    ;[tiles[0], tiles[1]] = [tiles[1], tiles[0]]
  }
  return tiles
}

/**
 * Фотопазл 3×3: тап–тап обмен плиток.
 */
export default function PhotoPuzzle({ onComplete, draft, onDraftChange }) {
  const config = gameData.puzzle
  const size = config.size || 3
  const total = size * size
  const photoSrc = getPhotoUrl(config.photo)

  const [tiles, setTiles] = useState(() => {
    if (draft?.tiles?.length === total && !isSolved(draft.tiles)) {
      return draft.tiles
    }
    return createShuffled(size)
  })
  const [selected, setSelected] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const [done, setDone] = useState(() => Boolean(draft?.done))
  const completedRef = useRef(false)
  const hintTimer = useRef(null)

  useEffect(() => {
    onDraftChange?.({ tiles, done })
  }, [tiles, done, onDraftChange])

  useEffect(() => {
    const probe = new Image()
    probe.onload = () => setImageFailed(false)
    probe.onerror = () => setImageFailed(true)
    probe.src = photoSrc
  }, [photoSrc])

  useEffect(() => {
    if (done && !completedRef.current) {
      completedRef.current = true
      onComplete?.({
        line: config.completeLine,
        state: 'happy',
      })
    }
  }, [config.completeLine, done, onComplete])

  useEffect(
    () => () => {
      if (hintTimer.current) window.clearTimeout(hintTimer.current)
    },
    [],
  )

  const handleSelect = useCallback(
    (index) => {
      if (done || showHint) return

      if (selected === null) {
        setSelected(index)
        return
      }

      if (selected === index) {
        setSelected(null)
        return
      }

      setTiles((prev) => {
        const next = [...prev]
        ;[next[selected], next[index]] = [next[index], next[selected]]
        if (isSolved(next)) {
          setDone(true)
        }
        return next
      })
      setSelected(null)
    },
    [done, selected, showHint],
  )

  const handleHint = () => {
    if (done) return
    setShowHint(true)
    setSelected(null)
    if (hintTimer.current) window.clearTimeout(hintTimer.current)
    hintTimer.current = window.setTimeout(() => {
      setShowHint(false)
    }, config.hintMs || 2800)
  }

  const tileStyle = useMemo(() => {
    if (imageFailed) return null
    return { backgroundImage: `url("${photoSrc}")` }
  }, [imageFailed, photoSrc])

  return (
    <div className="photo-puzzle">
      <div className="photo-puzzle__toolbar">
        <button
          type="button"
          className="btn btn--ghost photo-puzzle__hint-btn"
          onClick={handleHint}
          disabled={done || showHint}
        >
          Показать подсказку
        </button>
      </div>

      <div
        className={`photo-puzzle__board ${done ? 'is-done' : ''} ${showHint ? 'is-hint' : ''}`}
        style={{ '--puzzle-size': size }}
        role="grid"
        aria-label="Фотопазл"
      >
        {showHint || done ? (
          <div className="photo-puzzle__full">
            <SafePhoto
              photoKey={config.photo}
              alt="Собранное фото"
              objectPosition={config.objectPosition || '50% 30%'}
              label="Фото 5"
            />
          </div>
        ) : (
          tiles.map((tileId, index) => {
            const row = Math.floor(tileId / size)
            const col = tileId % size
            const isSelected = selected === index
            return (
              <button
                key={`${tileId}-${index}`}
                type="button"
                role="gridcell"
                className={`photo-puzzle__tile ${isSelected ? 'is-selected' : ''}`}
                onClick={() => handleSelect(index)}
                aria-label={`Плитка ${tileId + 1}`}
                aria-pressed={isSelected}
                style={
                  imageFailed
                    ? undefined
                    : {
                        ...tileStyle,
                        backgroundSize: `${size * 100}% ${size * 100}%`,
                        backgroundPosition: `${(col / (size - 1)) * 100}% ${(row / (size - 1)) * 100}%`,
                      }
                }
              >
                {imageFailed ? (
                  <span className="photo-puzzle__fallback">{tileId + 1}</span>
                ) : (
                  <span className="visually-hidden">Плитка {tileId + 1}</span>
                )}
              </button>
            )
          })
        )}
      </div>

      {done ? (
        <div className="photo-puzzle__filia">
          <Filia state="happy" line={config.completeLine} compact enter={false} />
        </div>
      ) : null}
    </div>
  )
}
