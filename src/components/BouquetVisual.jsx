import { gameData } from '../data/gameData'
import './BouquetVisual.css'

export function FlowerSvg({ type, className = '' }) {
  return (
    <svg className={`bq-flower bq-flower--${type} ${className}`} viewBox="0 0 64 64" aria-hidden="true">
      <g className="bq-flower__bloom">
        <ellipse className="p p1" cx="32" cy="18" rx="10" ry="14" />
        <ellipse className="p p2" cx="46" cy="28" rx="10" ry="14" transform="rotate(60 46 28)" />
        <ellipse className="p p3" cx="42" cy="46" rx="10" ry="14" transform="rotate(120 42 46)" />
        <ellipse className="p p4" cx="22" cy="46" rx="10" ry="14" transform="rotate(180 22 46)" />
        <ellipse className="p p5" cx="18" cy="28" rx="10" ry="14" transform="rotate(240 18 28)" />
        <circle className="c" cx="32" cy="32" r="8" />
      </g>
      <path className="bq-flower__stem" d="M32 40v18" />
    </svg>
  )
}

export default function BouquetVisual({
  main,
  extras = [],
  ribbon,
  compact = false,
  className = '',
}) {
  const ribbonColor =
    gameData.bouquet.ribbons.find((item) => item.id === ribbon)?.color || '#781F35'

  return (
    <div
      className={`bq-preview ${compact ? 'bq-preview--compact' : ''} ${className}`}
      aria-hidden="true"
    >
      <div className="bq-preview__stage">
        {extras?.map((id, index) => (
          <span
            key={id}
            className={`bq-preview__extra bq-preview__extra--${index}`}
          >
            <FlowerSvg type={id} />
          </span>
        ))}
        {main ? (
          <span className="bq-preview__main">
            <FlowerSvg type={main} />
          </span>
        ) : (
          <span className="bq-preview__placeholder">Букет появится здесь</span>
        )}
        {ribbon ? (
          <span className="bq-preview__ribbon" style={{ '--ribbon': ribbonColor }} />
        ) : null}
      </div>
    </div>
  )
}
