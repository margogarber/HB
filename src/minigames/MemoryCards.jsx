import { useCallback, useEffect, useRef, useState } from 'react'
import SafePhoto from '../components/SafePhoto'
import { gameData } from '../data/gameData'
import { shuffle } from '../utils/random'
import './MemoryCards.css'

function buildDeck(pairs) {
  const cards = pairs.flatMap((pair) => [
    {
      uid: `${pair.id}-photo`,
      pairId: pair.id,
      kind: 'photo',
      photo: pair.photo,
      caption: pair.caption,
      objectPosition: pair.objectPosition || '50% 50%',
    },
    {
      uid: `${pair.id}-text`,
      pairId: pair.id,
      kind: 'text',
      photo: pair.photo,
      caption: pair.caption,
      objectPosition: pair.objectPosition || '50% 50%',
    },
  ])
  return shuffle(cards)
}

/**
 * Пары: фотография + подпись. Сетка 2×4.
 */
export default function MemoryCards({ onComplete, draft, onDraftChange }) {
  const pairs = gameData.memoryPairs
  const [deck] = useState(() => {
    if (draft?.deck?.length === pairs.length * 2) return draft.deck
    return buildDeck(pairs)
  })
  const [matched, setMatched] = useState(() => new Set(draft?.matched || []))
  const [flipped, setFlipped] = useState([])
  const [locked, setLocked] = useState(false)
  const [done, setDone] = useState(() => (draft?.matched || []).length >= pairs.length)
  const completedRef = useRef(false)

  useEffect(() => {
    onDraftChange?.({
      deck,
      matched: [...matched],
    })
  }, [deck, matched, onDraftChange])

  useEffect(() => {
    if (done && !completedRef.current) {
      completedRef.current = true
      onComplete?.()
    }
  }, [done, onComplete])

  const handleFlip = useCallback(
    (uid) => {
      if (locked || done || flipped.includes(uid) || matched.has(deck.find((c) => c.uid === uid)?.pairId)) {
        return
      }

      const card = deck.find((item) => item.uid === uid)
      if (!card || matched.has(card.pairId)) return

      const nextFlipped = [...flipped, uid]
      setFlipped(nextFlipped)

      if (nextFlipped.length < 2) return

      setLocked(true)
      const [aId, bId] = nextFlipped
      const a = deck.find((item) => item.uid === aId)
      const b = deck.find((item) => item.uid === bId)

      const isMatch =
        a &&
        b &&
        a.pairId === b.pairId &&
        a.kind !== b.kind

      window.setTimeout(() => {
        if (isMatch) {
          setMatched((prev) => {
            const next = new Set(prev)
            next.add(a.pairId)
            if (next.size >= pairs.length) {
              setDone(true)
            }
            return next
          })
        }
        setFlipped([])
        setLocked(false)
      }, isMatch ? 380 : 700)
    },
    [deck, done, flipped, locked, matched, pairs.length],
  )

  return (
    <div className="memory-game">
      <div className="memory-game__hud" aria-live="polite">
        Пары {matched.size}/{pairs.length}
      </div>

      <div className="memory-game__grid" role="list">
        {deck.map((card) => {
          const isMatched = matched.has(card.pairId)
          const isOpen = isMatched || flipped.includes(card.uid)
          return (
            <button
              key={card.uid}
              type="button"
              role="listitem"
              className={`memory-card ${isOpen ? 'is-open' : ''} ${isMatched ? 'is-matched' : ''}`}
              onClick={() => handleFlip(card.uid)}
              disabled={isMatched || locked || done}
              aria-label={
                card.kind === 'photo'
                  ? `Фото: ${card.caption}`
                  : `Подпись: ${card.caption}`
              }
              aria-pressed={isOpen}
            >
              <span className="memory-card__inner">
                <span className="memory-card__face memory-card__face--back" aria-hidden="true">
                  <span className="memory-card__mark">В</span>
                </span>
                <span className="memory-card__face memory-card__face--front">
                  {card.kind === 'photo' ? (
                    <SafePhoto
                      photoKey={card.photo}
                      alt={card.caption}
                      objectPosition={card.objectPosition}
                      className="memory-card__photo"
                      label={card.pairId.replace('m', 'Фото ')}
                    />
                  ) : (
                    <span className="memory-card__caption">{card.caption}</span>
                  )}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {done ? (
        <p className="memory-game__done" role="status">
          Все воспоминания собраны
        </p>
      ) : null}
    </div>
  )
}
