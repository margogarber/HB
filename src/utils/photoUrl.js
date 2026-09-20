import { gameData } from '../data/gameData'

/** Абсолютный URL к фото из public/ с учётом base Vite. */
export function getPhotoUrl(keyOrPath) {
  const path =
    gameData.photos[keyOrPath] ??
    (String(keyOrPath).includes('/')
      ? keyOrPath
      : `assets/photos/${keyOrPath}`)

  const base = import.meta.env.BASE_URL || './'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  return `${normalizedBase}${path.replace(/^\//, '')}`
}

export function getPhotoNumber(keyOrPath) {
  const match = String(keyOrPath).match(/(\d+)/)
  return match ? Number(match[1]) : 0
}
