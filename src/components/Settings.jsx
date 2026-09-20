import { useEffect, useId, useRef, useState } from 'react'
import './Settings.css'

/**
 * Небольшая кнопка настроек и панель «Начать сначала».
 */
export default function Settings({ onReset }) {
  const [open, setOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const titleId = useId()
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) {
      setConfirming(false)
      return undefined
    }

    closeRef.current?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const handleReset = () => {
    onReset?.()
    setConfirming(false)
    setOpen(false)
  }

  return (
    <div className="settings">
      <button
        type="button"
        className="settings__trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Настройки"
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            d="M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm8.1 2.7-1.5-.3a6.8 6.8 0 0 0-.7-1.6l.9-1.3-1.6-1.6-1.3.9a6.8 6.8 0 0 0-1.6-.7l-.3-1.5h-2.3l-.3 1.5a6.8 6.8 0 0 0-1.6.7l-1.3-.9-1.6 1.6.9 1.3a6.8 6.8 0 0 0-.7 1.6l-1.5.3v2.3l1.5.3c.1.6.4 1.1.7 1.6l-.9 1.3 1.6 1.6 1.3-.9c.5.3 1 .5 1.6.7l.3 1.5h2.3l.3-1.5c.6-.1 1.1-.4 1.6-.7l1.3.9 1.6-1.6-.9-1.3c.3-.5.5-1 .7-1.6l1.5-.3v-2.3Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {open ? (
        <div className="settings__overlay" role="presentation">
          <button
            type="button"
            className="settings__backdrop"
            aria-label="Закрыть настройки"
            onClick={() => setOpen(false)}
          />
          <div
            className="settings__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <h2 id={titleId} className="settings__title">
              Настройки
            </h2>

            {!confirming ? (
              <>
                <button
                  type="button"
                  className="btn btn--ghost settings__action"
                  onClick={() => setConfirming(true)}
                >
                  Начать сначала
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  className="btn btn--primary settings__action"
                  onClick={() => setOpen(false)}
                >
                  Закрыть
                </button>
              </>
            ) : (
              <>
                <p className="settings__confirm-text">
                  Сбросить прогресс этой открытки? Это действие нельзя отменить.
                </p>
                <button
                  type="button"
                  className="btn btn--primary settings__action"
                  onClick={handleReset}
                >
                  Да, начать сначала
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  className="btn btn--ghost settings__action"
                  onClick={() => setConfirming(false)}
                >
                  Отмена
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
