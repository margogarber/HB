import { useEffect, useRef, useState } from 'react'
import BouquetVisual, { FlowerSvg } from '../components/BouquetVisual'
import Filia from '../components/Filia'
import { gameData } from '../data/gameData'
import './BouquetMaker.css'

/**
 * Конструктор букета: основной цветок → дополнения → лента.
 * Любой выбор правильный.
 */
export default function BouquetMaker({
  onComplete,
  draft,
  onDraftChange,
  onBouquetSave,
}) {
  const config = gameData.bouquet
  const [step, setStep] = useState(() => draft?.step || 'main')
  const [main, setMain] = useState(() => draft?.main || null)
  const [extras, setExtras] = useState(() => draft?.extras || [])
  const [ribbon, setRibbon] = useState(() => draft?.ribbon || null)
  const [done, setDone] = useState(() => draft?.step === 'done')
  const completedRef = useRef(false)

  useEffect(() => {
    onDraftChange?.({ step, main, extras, ribbon })
  }, [step, main, extras, ribbon, onDraftChange])

  useEffect(() => {
    if (done && !completedRef.current) {
      completedRef.current = true
      const bouquet = { main, extras, ribbon }
      onBouquetSave?.(bouquet)
      onComplete?.({
        line: config.completeLine,
        state: 'happy',
      })
    }
  }, [config.completeLine, done, extras, main, onBouquetSave, onComplete, ribbon])

  const toggleExtra = (id) => {
    setExtras((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const finish = () => {
    setStep('done')
    setDone(true)
  }

  return (
    <div className="bouquet-maker">
      <BouquetVisual main={main} extras={extras} ribbon={ribbon} />

      {step === 'main' && (
        <div className="bouquet-maker__panel">
          <h3 className="bouquet-maker__title">Выбери основной цветок</h3>
          <div className="bouquet-maker__choices" role="group" aria-label="Основной цветок">
            {config.mains.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`bouquet-maker__choice ${main === item.id ? 'is-selected' : ''}`}
                onClick={() => setMain(item.id)}
                aria-pressed={main === item.id}
              >
                <FlowerSvg type={item.id} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn btn--primary"
            disabled={!main}
            onClick={() => setStep('extras')}
          >
            Дальше
          </button>
        </div>
      )}

      {step === 'extras' && (
        <div className="bouquet-maker__panel">
          <h3 className="bouquet-maker__title">Добавь цветы</h3>
          <p className="bouquet-maker__hint">Можно выбрать несколько — или ни одного.</p>
          <div className="bouquet-maker__choices" role="group" aria-label="Дополнительные цветы">
            {config.extras.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`bouquet-maker__choice ${extras.includes(item.id) ? 'is-selected' : ''}`}
                onClick={() => toggleExtra(item.id)}
                aria-pressed={extras.includes(item.id)}
              >
                <FlowerSvg type={item.id} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <button type="button" className="btn btn--primary" onClick={() => setStep('ribbon')}>
            Дальше
          </button>
        </div>
      )}

      {step === 'ribbon' && (
        <div className="bouquet-maker__panel">
          <h3 className="bouquet-maker__title">Выбери ленту</h3>
          <div className="bouquet-maker__choices" role="group" aria-label="Лента">
            {config.ribbons.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`bouquet-maker__choice bouquet-maker__choice--ribbon ${
                  ribbon === item.id ? 'is-selected' : ''
                }`}
                onClick={() => setRibbon(item.id)}
                aria-pressed={ribbon === item.id}
              >
                <span
                  className="bouquet-maker__swatch"
                  style={{ background: item.color }}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn btn--primary"
            disabled={!ribbon}
            onClick={finish}
          >
            Готово
          </button>
        </div>
      )}

      {done ? (
        <div className="bouquet-maker__filia">
          <Filia state="happy" line={config.completeLine} compact enter={false} />
        </div>
      ) : null}
    </div>
  )
}
