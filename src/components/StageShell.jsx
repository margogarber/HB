import Filia from './Filia'
import './StageShell.css'

/**
 * Единая оболочка игрового этапа.
 */
export default function StageShell({
  stage,
  stageIndex,
  totalStages,
  filiaLine,
  filiaState = 'thinking',
  children,
  onComplete,
  completeLabel = 'Дальше',
  showContinue = true,
}) {
  return (
    <section className="stage-shell" aria-labelledby="stage-title">
      <header className="stage-shell__header">
        <p className="stage-shell__meta">
          Этап {stageIndex + 1} из {totalStages}
        </p>
        <h2 id="stage-title" className="stage-shell__title">
          {stage.title}
        </h2>
        <p className="stage-shell__subtitle">{stage.subtitle}</p>
      </header>

      <Filia
        key={`filia-${stage.id}`}
        state={filiaState}
        line={filiaLine || stage.filiaHint}
        compact
      />

      <div className="stage-shell__content card">{children}</div>

      {showContinue ? (
        <button
          type="button"
          className="btn btn--primary stage-shell__complete"
          onClick={onComplete}
        >
          {completeLabel}
        </button>
      ) : null}
    </section>
  )
}
