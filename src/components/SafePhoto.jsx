import { useState } from 'react'
import { getPhotoNumber, getPhotoUrl } from '../utils/photoUrl'
import './SafePhoto.css'

/**
 * Показывает фото или градиентную заглушку, если файл отсутствует.
 */
export default function SafePhoto({
  photoKey,
  alt = '',
  className = '',
  label,
  objectPosition = '50% 50%',
}) {
  const [failed, setFailed] = useState(false)
  const src = getPhotoUrl(photoKey)
  const number = getPhotoNumber(photoKey)
  const tone = ((number - 1) % 6) + 1

  if (failed) {
    return (
      <div
        className={`safe-photo safe-photo--fallback safe-photo--tone-${tone} ${className}`}
        role="img"
        aria-label={alt || `Фото ${number || ''}`}
      >
        <span className="safe-photo__bloom" aria-hidden="true" />
        <span className="safe-photo__number">
          {label || `Фото ${number || '—'}`}
        </span>
      </div>
    )
  }

  return (
    <img
      className={`safe-photo ${className}`}
      src={src}
      alt={alt}
      style={{ objectPosition }}
      onError={() => setFailed(true)}
    />
  )
}
