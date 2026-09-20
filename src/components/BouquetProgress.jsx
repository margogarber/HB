import './BouquetProgress.css'

const FLOWER_SHAPES = ['rose', 'peony', 'tulip', 'lily', 'daisy', 'orchid']

function FlowerIcon({ type }) {
  return (
    <svg className={`flower-svg flower-svg--${type}`} viewBox="0 0 40 40" aria-hidden="true">
      <g className="flower-svg__bloom">
        <ellipse className="flower-svg__petal p1" cx="20" cy="12" rx="6" ry="9" />
        <ellipse className="flower-svg__petal p2" cx="28" cy="18" rx="6" ry="9" transform="rotate(60 28 18)" />
        <ellipse className="flower-svg__petal p3" cx="26" cy="28" rx="6" ry="9" transform="rotate(120 26 28)" />
        <ellipse className="flower-svg__petal p4" cx="14" cy="28" rx="6" ry="9" transform="rotate(180 14 28)" />
        <ellipse className="flower-svg__petal p5" cx="12" cy="18" rx="6" ry="9" transform="rotate(240 12 18)" />
        <circle className="flower-svg__center" cx="20" cy="20" r="5" />
      </g>
      <path
        className="flower-svg__stem"
        d="M20 25v10"
        fill="none"
        stroke="#6b8f71"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  )
}

/**
 * Индикатор прогресса: шесть цветов букета воспоминаний.
 */
export default function BouquetProgress({
  total = 6,
  collected = 0,
  flowerTypes = FLOWER_SHAPES,
}) {
  return (
    <div
      className="bouquet-progress"
      role="status"
      aria-label={`Собрано цветов: ${collected} из ${total}`}
    >
      <div className="bouquet-progress__label">
        <span>Букет воспоминаний</span>
        <strong>
          {collected}/{total}
        </strong>
      </div>
      <ul className="bouquet-progress__row">
        {Array.from({ length: total }, (_, index) => {
          const unlocked = index < collected
          const type = flowerTypes[index] || FLOWER_SHAPES[index % FLOWER_SHAPES.length]
          return (
            <li
              key={`${type}-${index}`}
              className={`bouquet-progress__slot ${unlocked ? 'is-unlocked' : 'is-locked'}`}
            >
              <FlowerIcon type={type} />
              <span className="visually-hidden">
                {unlocked ? `Цветок ${index + 1} собран` : `Цветок ${index + 1} ещё не собран`}
              </span>
            </li>
          )
        })}
      </ul>
      <div
        className="bouquet-progress__bar"
        aria-hidden="true"
      >
        <span style={{ width: `${(collected / total) * 100}%` }} />
      </div>
    </div>
  )
}
