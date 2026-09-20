import { useId } from 'react'
import './Filia.css'

const STATES = new Set(['neutral', 'happy', 'thinking', 'surprised', 'letter'])

function normalizeState(state, mood) {
  const raw = state || mood || 'neutral'
  const map = {
    calm: 'neutral',
    serious: 'neutral',
    sarcastic: 'thinking',
    proud: 'happy',
  }
  const next = map[raw] || raw
  return STATES.has(next) ? next : 'neutral'
}

/**
 * Филя — маленький пушистый чёрный шпиц (SVG).
 * Props: state, line, compact, enter
 * Состояния: neutral | happy | thinking | surprised | letter
 */
export default function Filia({
  state,
  mood,
  line,
  compact = false,
  enter = true,
  className = '',
}) {
  const moodState = normalizeState(state, mood)
  const uid = useId().replace(/:/g, '')
  const furId = `filiaFur-${uid}`
  const cheekId = `filiaCheek-${uid}`

  return (
    <aside
      className={[
        'filia',
        compact ? 'filia--compact' : '',
        enter ? 'filia--enter' : '',
        `filia--${moodState}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={line ? `Филя говорит: ${line}` : 'Филя'}
    >
      <div className="filia__figure" aria-hidden="true">
        <svg
          className="filia__svg"
          viewBox="0 0 120 132"
          xmlns="http://www.w3.org/2000/svg"
          focusable="false"
        >
          <defs>
            <radialGradient id={furId} cx="38%" cy="32%" r="72%">
              <stop offset="0%" stopColor="#3d3337" />
              <stop offset="50%" stopColor="#1a1216" />
              <stop offset="100%" stopColor="#0c080a" />
            </radialGradient>
            <radialGradient id={cheekId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e8bcc5" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#e8bcc5" stopOpacity="0" />
            </radialGradient>
          </defs>

          <g className="filia__body-group">
            <ellipse
              cx="60"
              cy="100"
              rx="34"
              ry="26"
              fill={`url(#${furId})`}
              stroke="#E8BCC5"
              strokeWidth="3.5"
            />
            <path
              d="M30 94c5-9 10-11 14-8M90 94c-5-9-10-11-14-8M38 114c7 4 16 5 22 4M82 114c-7 4-16 5-22 4"
              stroke="#2a2226"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.5"
              fill="none"
            />
            <path
              className="filia__tail"
              d="M90 102c11-3 17 3 15 12c-7-2-13-4-17-9z"
              fill={`url(#${furId})`}
              stroke="#E8BCC5"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </g>

          <g className="filia__head-group">
            <path
              d="M26 50c-7-20 3-30 14-27c3 9 3 19 0 27c-4 2-10 2-14 0z"
              fill={`url(#${furId})`}
              stroke="#E8BCC5"
              strokeWidth="3"
            />
            <path
              d="M94 50c7-20-3-30-14-27c-3 9-3 19 0 27c4 2 10 2 14 0z"
              fill={`url(#${furId})`}
              stroke="#E8BCC5"
              strokeWidth="3"
            />
            <ellipse
              cx="60"
              cy="58"
              rx="32"
              ry="28"
              fill={`url(#${furId})`}
              stroke="#E8BCC5"
              strokeWidth="3.5"
            />
            <ellipse cx="47" cy="46" rx="11" ry="6" fill="#FFF8F5" opacity="0.15" />
            <ellipse cx="72" cy="50" rx="7" ry="4" fill="#FFF8F5" opacity="0.1" />

            <g className="filia__brows">
              <path
                className="filia__brow filia__brow--left"
                d="M40 47h16"
                stroke="#F5DDE2"
                strokeWidth="2.3"
                strokeLinecap="round"
                opacity="0.8"
              />
              <path
                className="filia__brow filia__brow--right"
                d="M64 47h16"
                stroke="#F5DDE2"
                strokeWidth="2.3"
                strokeLinecap="round"
                opacity="0.8"
              />
            </g>

            <g className="filia__eyes">
              <g className="filia__eye filia__eye--left">
                <ellipse className="filia__eye-white" cx="46" cy="56" rx="7" ry="7.5" fill="#FFF8F5" />
                <circle className="filia__pupil" cx="47" cy="57" r="3.2" fill="#1a1216" />
                <circle cx="48.6" cy="55" r="1.15" fill="#FFF8F5" />
                <rect className="filia__lid" x="38.5" y="47.5" width="15" height="17" fill={`url(#${furId})`} />
              </g>
              <g className="filia__eye filia__eye--right">
                <ellipse className="filia__eye-white" cx="74" cy="56" rx="7" ry="7.5" fill="#FFF8F5" />
                <circle className="filia__pupil" cx="73" cy="57" r="3.2" fill="#1a1216" />
                <circle cx="74.6" cy="55" r="1.15" fill="#FFF8F5" />
                <rect className="filia__lid" x="66.5" y="47.5" width="15" height="17" fill={`url(#${furId})`} />
              </g>
            </g>

            <ellipse cx="37" cy="65" rx="6.5" ry="4" fill={`url(#${cheekId})`} />
            <ellipse cx="83" cy="65" rx="6.5" ry="4" fill={`url(#${cheekId})`} />

            <ellipse cx="60" cy="66" rx="8" ry="6" fill="#2a1c22" opacity="0.3" />
            <ellipse cx="60" cy="65" rx="5" ry="3.8" fill="#3a252c" stroke="#E8BCC5" strokeWidth="1" />
            <circle cx="58.4" cy="63.8" r="0.85" fill="#F5DDE2" opacity="0.75" />

            <path
              className="filia__mouth filia__mouth--neutral"
              d="M54 72c3 1.5 9 1.5 12 0"
              fill="none"
              stroke="#F5DDE2"
              strokeWidth="1.7"
              strokeLinecap="round"
              opacity="0.75"
            />
            <path
              className="filia__mouth filia__mouth--happy"
              d="M52 71c4 5 12 5 16 0"
              fill="none"
              stroke="#F5DDE2"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0"
            />
            <ellipse
              className="filia__mouth filia__mouth--open"
              cx="60"
              cy="73.5"
              rx="4.2"
              ry="3.2"
              fill="#3a252c"
              opacity="0"
            />
          </g>

          <g className="filia__collar">
            <path
              d="M39 85c6 8 36 8 42 0c-2 6-11 11-21 11s-19-5-21-11z"
              fill="#781F35"
              stroke="#E8BCC5"
              strokeWidth="1.6"
            />
            <circle cx="60" cy="93" r="3.4" fill="#F5DDE2" stroke="#FFF8F5" strokeWidth="1.1" />
          </g>

          <g className="filia__letter">
            <rect
              x="78"
              y="78"
              width="28"
              height="20"
              rx="2.5"
              fill="#FFF8F5"
              stroke="#781F35"
              strokeWidth="1.8"
            />
            <path d="M78 78l14 10 14-10" fill="none" stroke="#781F35" strokeWidth="1.5" />
            <path d="M78 98l10-8M106 98l-10-8" fill="none" stroke="#E8BCC5" strokeWidth="1.2" />
          </g>
        </svg>
      </div>

      {line ? (
        <p className="filia__bubble">
          <span className="filia__name">Филя</span>
          <span className="filia__line">{line}</span>
        </p>
      ) : null}
    </aside>
  )
}
