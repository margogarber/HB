import { useCallback, useEffect, useId, useRef, useState } from 'react'
import SafePhoto from '../components/SafePhoto'
import { gameData } from '../data/gameData'
import './FindItems.css'

function ItemGlyph({ type }) {
  if (type === 'heart') {
    return (
      <svg viewBox="0 0 28 28" aria-hidden="true">
        <path
          d="M14 24S4 17.5 4 10.8C4 7.4 6.6 5.5 9.4 5.5c1.8 0 3.3.9 4.6 2.4 1.3-1.5 2.8-2.4 4.6-2.4 2.8 0 5.4 1.9 5.4 5.3C24 17.5 14 24 14 24Z"
          fill="currentColor"
        />
      </svg>
    )
  }
  if (type === 'star') {
    return (
      <svg viewBox="0 0 28 28" aria-hidden="true">
        <path
          d="M14 3.5l2.7 7.2H24l-5.8 4.4 2.2 7.4L14 18.4l-6.4 4.1 2.2-7.4L4 10.7h7.3L14 3.5Z"
          fill="currentColor"
        />
      </svg>
    )
  }
  if (type === 'bow') {
    return (
      <svg viewBox="0 0 28 28" aria-hidden="true">
        <path
          d="M14 13c-1.2 0-2.4.3-3.4.8C8.2 10.5 5 9.2 5 12.2c0 2.2 2.6 3.4 5.2 3.8-.2.6-.3 1.2-.3 1.8h3.2c0-.7.1-1.3.4-1.9.4.1.8.1 1.2.1s.8 0 1.2-.1c.3.6.4 1.2.4 1.9h3.2c0-.6-.1-1.2-.3-1.8 2.6-.4 5.2-1.6 5.2-3.8 0-3-3.2-1.7-5.6 1.6-1-.5-2.2-.8-3.4-.8Z"
          fill="currentColor"
        />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true">
      <rect x="5" y="8" width="18" height="13" rx="2" fill="currentColor" opacity="0.95" />
      <path d="M5 8l9 7 9-7" fill="none" stroke="#fff8f5" strokeWidth="1.6" />
    </svg>
  )
}

/**
 * Поиск четырёх спрятанных предметов на photo6.
 */
export default function FindItems({ onComplete }) {
  const config = gameData.findItems
  const items = config.items
  const listId = useId()
  const [found, setFound] = useState(() => new Set())
  const [hint, setHint] = useState(false)
  const [done, setDone] = useState(false)
  const idleTimer = useRef(null)

  const resetIdle = useCallback(() => {
    setHint(false)
    if (idleTimer.current) window.clearTimeout(idleTimer.current)
    if (done) return
    idleTimer.current = window.setTimeout(() => {
      setHint(true)
    }, config.idleHintMs ?? 9000)
  }, [config.idleHintMs, done])

  useEffect(() => {
    resetIdle()
    return () => {
      if (idleTimer.current) window.clearTimeout(idleTimer.current)
    }
  }, [resetIdle])

  const handleFind = useCallback(
    (id) => {
      if (done || found.has(id)) return

      resetIdle()
      const next = new Set(found)
      next.add(id)
      setFound(next)

      if (next.size >= items.length) {
        setDone(true)
        setHint(false)
        onComplete?.()
      }
    },
    [done, found, items.length, onComplete, resetIdle],
  )

  return (
    <div className="find-items">
      <ul className="find-items__list" id={listId} aria-label="Найденные предметы">
        {items.map((item) => {
          const isFound = found.has(item.id)
          return (
            <li
              key={item.id}
              className={`find-items__chip ${isFound ? 'is-found' : ''}`}
            >
              <ItemGlyph type={item.id} />
              <span>{item.label}</span>
            </li>
          )
        })}
      </ul>

      <div
        className={`find-items__scene ${hint ? 'is-hinting' : ''}`}
        role="application"
        aria-labelledby={listId}
      >
        <SafePhoto
          photoKey={config.photo}
          alt="Сцена для поиска предметов"
          className="find-items__photo"
          label="Фото 6"
        />

        {items.map((item) => {
          const isFound = found.has(item.id)
          return (
            <button
              key={item.id}
              type="button"
              className={`find-items__hotspot find-items__hotspot--${item.id} ${
                isFound ? 'is-found' : ''
              }`}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              onClick={() => handleFind(item.id)}
              disabled={isFound || done}
              aria-label={
                isFound ? `${item.label} уже найдено` : `Найти: ${item.label}`
              }
            >
              <span className="find-items__glyph">
                <ItemGlyph type={item.id} />
              </span>
            </button>
          )
        })}

        {done && (
          <p className="find-items__done" role="status">
            Всё найдено
          </p>
        )}
      </div>
    </div>
  )
}
