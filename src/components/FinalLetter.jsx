import { useEffect, useId, useRef, useState } from 'react'
import BouquetVisual from './BouquetVisual'
import Filia from './Filia'
import { gameData } from '../data/gameData'
import './FinalLetter.css'

const DELIVERY_LINE =
  gameData.filiaLines.delivery ||
  'Кажется, теперь всё готово. Я нёс это письмо очень осторожно… почти не погрыз его.'

function Petals({ active }) {
  if (!active) return null
  return (
    <div className="final-petals" aria-hidden="true">
      {Array.from({ length: 12 }, (_, index) => (
        <span
          key={index}
          className="final-petals__item"
          style={{
            left: `${6 + ((index * 7) % 88)}%`,
            animationDelay: `${(index % 6) * 0.35}s`,
            animationDuration: `${5 + (index % 4) * 0.6}s`,
          }}
        />
      ))}
    </div>
  )
}

/**
 * Финальная сцена: конверт → букет → письмо.
 */
export default function FinalLetter({
  bouquet,
  letterOpened = false,
  onLetterOpened,
}) {
  const [phase, setPhase] = useState(() => (letterOpened ? 'revealed' : 'closed'))
  const letterRef = useRef(null)
  const titleId = useId()
  const hydrated = useRef(false)

  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true
    if (letterOpened) setPhase('revealed')
  }, [letterOpened])

  const openEnvelope = () => {
    if (phase !== 'closed') return
    setPhase('opening')
    window.setTimeout(() => {
      setPhase('revealed')
      onLetterOpened?.()
    }, 700)
  }

  const reread = () => {
    setPhase('closed')
    window.setTimeout(() => {
      letterRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const resolvedBouquet = bouquet || {
    main: 'rose',
    extras: ['daisy', 'lily'],
    ribbon: 'burgundy',
  }

  return (
    <section className="final-letter" ref={letterRef} aria-labelledby={titleId}>
      <Petals active={phase === 'revealed'} />

      <Filia state="letter" line={DELIVERY_LINE} />

      {phase !== 'revealed' && (
        <button
          type="button"
          className={`final-envelope ${phase === 'opening' ? 'is-opening' : ''}`}
          onClick={openEnvelope}
          aria-label="Открыть конверт"
        >
          <span className="final-envelope__flap" />
          <span className="final-envelope__body">
            <span className="final-envelope__seal">В</span>
            <span className="final-envelope__hint">Нажми, чтобы открыть</span>
          </span>
        </button>
      )}

      {phase === 'revealed' && (
        <div className="final-letter__reveal">
          <BouquetVisual
            className="final-letter__bouquet"
            main={resolvedBouquet.main}
            extras={resolvedBouquet.extras || []}
            ribbon={resolvedBouquet.ribbon}
          />

          <article className="final-letter__paper card" aria-live="polite">
            <h2 id={titleId} className="final-letter__heading">
              {gameData.letterTitle}
            </h2>
            <pre className="final-letter__text">{gameData.finalLetter}</pre>
          </article>

          <button type="button" className="final-letter__reread" onClick={reread}>
            Прочитать ещё раз
          </button>
        </div>
      )}
    </section>
  )
}
