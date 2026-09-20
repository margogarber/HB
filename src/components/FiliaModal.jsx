import { useEffect, useId, useRef } from 'react'
import Filia from './Filia'
import './FiliaModal.css'

/**
 * Модальная реплика Фили.
 * Готова для мини-игр; можно показать поверх экрана.
 */
export default function FiliaModal({
  open,
  line,
  state = 'neutral',
  onClose,
  actionLabel = 'Понятно',
}) {
  const titleId = useId()
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKey = (event) => {
      if (event.key === 'Escape' && onClose) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open || !line) return null

  return (
    <div className="filia-modal" role="presentation">
      <button
        type="button"
        className="filia-modal__backdrop"
        aria-label="Закрыть реплику"
        onClick={onClose}
      />
      <div
        className="filia-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <Filia state={state} line={line} enter compact={false} className="filia-modal__filia" />
        <p id={titleId} className="visually-hidden">
          Реплика Фили
        </p>
        {onClose ? (
          <button
            ref={closeRef}
            type="button"
            className="btn btn--primary filia-modal__action"
            onClick={onClose}
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  )
}
