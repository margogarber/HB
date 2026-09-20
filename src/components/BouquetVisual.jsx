import { useId } from 'react'
import { gameData } from '../data/gameData'
import './BouquetVisual.css'

const FLOWER_COLORS = {
  rose: { petal: '#C45C74', petalDeep: '#A84D63', center: '#781F35' },
  peony: { petal: '#E8BCC5', petalDeep: '#D9A3AE', center: '#781F35' },
  tulip: { petal: '#A84D63', petalDeep: '#781F35', center: '#5C1828' },
  daisy: { petal: '#FFF8F5', petalDeep: '#F5DDE2', center: '#C9A227' },
  lily: { petal: '#F0C8D0', petalDeep: '#E8BCC5', center: '#A84D63' },
  orchid: { petal: '#781F35', petalDeep: '#5C1828', center: '#F5DDE2' },
  baby: { petal: '#F5DDE2', petalDeep: '#E8BCC5', center: '#E8BCC5' },
}

/** Точка перевязки стеблей / ленты в системе координат SVG */
const BIND = { x: 180, y: 292 }

/**
 * Маленький цветок для кнопок выбора (механика без изменений).
 */
export function FlowerSvg({ type, className = '' }) {
  const colors = FLOWER_COLORS[type] || FLOWER_COLORS.peony
  return (
    <svg className={`bq-flower-icon ${className}`} viewBox="0 0 64 64" aria-hidden="true">
      <g>
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="32"
            cy="22"
            rx="9"
            ry="13"
            fill={colors.petal}
            transform={`rotate(${deg} 32 32)`}
          />
        ))}
        <circle cx="32" cy="32" r="8" fill={colors.center} />
      </g>
    </svg>
  )
}

function BloomHead({ type, size = 1 }) {
  const colors = FLOWER_COLORS[type] || FLOWER_COLORS.peony
  const s = 28 * size
  const isBaby = type === 'baby'
  const petals = isBaby ? 6 : 5
  const step = 360 / petals

  return (
    <g>
      {Array.from({ length: petals }, (_, i) => {
        const deg = i * step
        return (
          <ellipse
            key={deg}
            cx="0"
            cy={-s * 0.42}
            rx={isBaby ? s * 0.22 : s * 0.32}
            ry={isBaby ? s * 0.34 : s * 0.48}
            fill={i % 2 === 0 ? colors.petal : colors.petalDeep}
            stroke="#E8BCC5"
            strokeWidth="0.8"
            strokeOpacity="0.45"
            transform={`rotate(${deg})`}
          />
        )
      })}
      <circle
        cx="0"
        cy="0"
        r={isBaby ? s * 0.14 : s * 0.22}
        fill={colors.center}
        stroke="#FFF8F5"
        strokeWidth="1"
        strokeOpacity="0.35"
      />
      {!isBaby && (
        <circle cx={-s * 0.06} cy={-s * 0.06} r={s * 0.05} fill="#FFF8F5" opacity="0.45" />
      )}
    </g>
  )
}

function buildLayout(main, extras = []) {
  const items = []
  if (main) items.push({ type: main, key: `main-${main}`, role: 'main' })
  extras.forEach((type, index) => {
    items.push({ type, key: `extra-${type}-${index}`, role: 'extra', index })
  })

  const count = items.length
  if (count === 0) return []

  // Веер в верхней части: x от ~95 до ~265, y голов ~78–130
  const spreads = {
    1: [{ x: 180, y: 95, rot: 0, size: 1.22 }],
    2: [
      { x: 148, y: 102, rot: -14, size: 1.08 },
      { x: 214, y: 98, rot: 12, size: 1.12 },
    ],
    3: [
      { x: 126, y: 118, rot: -22, size: 0.92 },
      { x: 180, y: 88, rot: 0, size: 1.2 },
      { x: 236, y: 114, rot: 20, size: 0.94 },
    ],
    4: [
      { x: 112, y: 128, rot: -26, size: 0.86 },
      { x: 158, y: 96, rot: -10, size: 1.05 },
      { x: 206, y: 92, rot: 8, size: 1.08 },
      { x: 250, y: 124, rot: 24, size: 0.88 },
    ],
    5: [
      { x: 102, y: 136, rot: -30, size: 0.8 },
      { x: 140, y: 108, rot: -16, size: 0.95 },
      { x: 180, y: 86, rot: 0, size: 1.18 },
      { x: 222, y: 104, rot: 14, size: 0.96 },
      { x: 260, y: 132, rot: 28, size: 0.82 },
    ],
  }

  const slots = spreads[Math.min(count, 5)] || spreads[5]

  // Главный цветок — в самый крупный/центральный слот
  const ordered = [...items]
  if (main && ordered.length > 1) {
    const mainIndex = ordered.findIndex((item) => item.role === 'main')
    const centerSlot = Math.floor((slots.length - 1) / 2)
    if (mainIndex >= 0 && mainIndex !== centerSlot) {
      const [mainItem] = ordered.splice(mainIndex, 1)
      ordered.splice(centerSlot, 0, mainItem)
    }
  }

  return ordered.map((item, index) => {
    const slot = slots[index] || slots[slots.length - 1]
    const sizeBoost = item.role === 'main' ? 1.08 : 1
    return {
      ...item,
      x: slot.x,
      y: slot.y,
      rot: slot.rot,
      size: slot.size * sizeBoost,
    }
  })
}

function RibbonGroup({ color }) {
  return (
    <g className="bq-ribbon" transform={`translate(${BIND.x} ${BIND.y})`}>
      {/* Обёртка вокруг стеблей */}
      <path
        d="M-34 -6 C-20 -14 20 -14 34 -6 L30 10 C16 16 -16 16 -30 10 Z"
        fill={color}
        stroke="#321D25"
        strokeOpacity="0.12"
        strokeWidth="1"
      />
      <path
        d="M-28 -2 C-10 -8 10 -8 28 -2"
        fill="none"
        stroke="#FFF8F5"
        strokeOpacity="0.35"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Бантики */}
      <path
        d="M-6 0 C-28 -18 -42 4 -18 14 C-12 8 -8 4 -6 0 Z"
        fill={color}
        stroke="#321D25"
        strokeOpacity="0.1"
        strokeWidth="0.8"
      />
      <path
        d="M6 0 C28 -18 42 4 18 14 C12 8 8 4 6 0 Z"
        fill={color}
        stroke="#321D25"
        strokeOpacity="0.1"
        strokeWidth="0.8"
      />
      <circle cx="0" cy="2" r="7" fill={color} stroke="#FFF8F5" strokeWidth="1.5" />
      {/* Хвостики */}
      <path
        d="M-4 8 C-18 28 -8 42 2 34"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M4 8 C18 28 10 44 -2 36"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </g>
  )
}

/**
 * Единый SVG-букет: упаковка → стебли → цветы → лента.
 */
export default function BouquetVisual({
  main,
  extras = [],
  ribbon,
  compact = false,
  className = '',
}) {
  const uid = useId().replace(/:/g, '')
  const flowers = buildLayout(main, extras)
  const ribbonMeta = gameData.bouquet.ribbons.find((item) => item.id === ribbon)
  const ribbonColor = ribbonMeta?.color || '#781F35'
  const empty = flowers.length === 0

  return (
    <div
      className={`bq-preview ${compact ? 'bq-preview--compact' : ''} ${className}`}
      aria-hidden="true"
    >
      {empty ? (
        <p className="bq-preview__placeholder">Букет появится здесь</p>
      ) : (
        <svg
          className="bq-svg"
          viewBox="0 0 360 420"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          focusable="false"
        >
          <defs>
            <linearGradient id={`wrapBack-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF8F5" />
              <stop offset="55%" stopColor="#F8E8EC" />
              <stop offset="100%" stopColor="#F5DDE2" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id={`wrapMid-${uid}`} x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F5DDE2" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#FFF8F5" />
              <stop offset="100%" stopColor="#E8BCC5" stopOpacity="0.55" />
            </linearGradient>
            <linearGradient id={`wrapFront-${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#FFF8F5" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#F5DDE2" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* 1. Задние части упаковки */}
          <g className="bq-wrap-back">
            <path
              d="M78 70 L162 250 L180 300 L198 250 L282 70 L220 55 L180 95 L140 55 Z"
              fill={`url(#wrapBack-${uid})`}
              stroke="#E8BCC5"
              strokeWidth="1.6"
            />
            <path
              d="M95 85 L168 248 L180 292 L192 248 L265 85 L210 72 L180 108 L150 72 Z"
              fill={`url(#wrapMid-${uid})`}
              stroke="#781F35"
              strokeOpacity="0.18"
              strokeWidth="1.2"
            />
            {/* Линии сгиба */}
            <path
              d="M140 90 L172 250"
              fill="none"
              stroke="#781F35"
              strokeOpacity="0.08"
              strokeWidth="1"
            />
            <path
              d="M220 90 L188 250"
              fill="none"
              stroke="#781F35"
              strokeOpacity="0.08"
              strokeWidth="1"
            />
          </g>

          {/* 2. Стебли и листья */}
          <g className="bq-stems" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {flowers.map((flower) => (
              <path
                key={`stem-${flower.key}`}
                d={`M${flower.x} ${flower.y + 18} Q${(flower.x + BIND.x) / 2} ${(flower.y + BIND.y) / 2 + 20} ${BIND.x} ${BIND.y}`}
                stroke="#5F8A66"
                strokeWidth={flower.role === 'main' ? 4.2 : 3.2}
                opacity="0.9"
              />
            ))}
            {/* Листья */}
            <path
              d={`M${BIND.x - 8} ${BIND.y - 55} C${BIND.x - 48} ${BIND.y - 70} ${BIND.x - 52} ${BIND.y - 30} ${BIND.x - 14} ${BIND.y - 28}`}
              fill="#7FA887"
              stroke="#5F8A66"
              strokeWidth="1"
              opacity="0.85"
            />
            <path
              d={`M${BIND.x + 6} ${BIND.y - 48} C${BIND.x + 46} ${BIND.y - 62} ${BIND.x + 50} ${BIND.y - 24} ${BIND.x + 12} ${BIND.y - 22}`}
              fill="#6B9A74"
              stroke="#5F8A66"
              strokeWidth="1"
              opacity="0.85"
            />
            <path
              d={`M${BIND.x - 4} ${BIND.y - 78} C${BIND.x - 36} ${BIND.y - 100} ${BIND.x - 30} ${BIND.y - 58} ${BIND.x - 6} ${BIND.y - 60}`}
              fill="#8BB392"
              stroke="#5F8A66"
              strokeWidth="0.8"
              opacity="0.75"
            />
          </g>

          {/* 3. Передняя часть упаковки (сужается вниз, стебли частично видны) */}
          <g className="bq-wrap-front">
            <path
              d="M120 210 L168 278 L180 305 L192 278 L240 210 L210 225 L180 255 L150 225 Z"
              fill={`url(#wrapFront-${uid})`}
              stroke="#E8BCC5"
              strokeWidth="1.4"
              opacity="0.92"
            />
            <path
              d="M150 225 L180 255 L210 225"
              fill="none"
              stroke="#781F35"
              strokeOpacity="0.1"
              strokeWidth="1"
            />
          </g>

          {/* 4. Головки цветов */}
          <g className="bq-blooms">
            {flowers.map((flower) => (
              <g
                key={flower.key}
                transform={`translate(${flower.x} ${flower.y}) rotate(${flower.rot})`}
              >
                <BloomHead type={flower.type} size={flower.size} />
              </g>
            ))}
          </g>

          {/* 5. Лента и бантик в точке перевязки */}
          {ribbon ? <RibbonGroup color={ribbonColor} /> : null}
        </svg>
      )}
    </div>
  )
}
