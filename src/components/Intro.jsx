import Filia from './Filia'
import { gameData } from '../data/gameData'
import './Intro.css'

export default function Intro({ onStart }) {
  return (
    <section className="intro">
      <div className="intro__ornament" aria-hidden="true">
        <span className="petal petal--a" />
        <span className="petal petal--b" />
        <span className="petal petal--c" />
      </div>

      <h1 className="intro__title">{gameData.title}</h1>
      <p className="intro__lead">{gameData.intro.text}</p>

      <div className="intro__envelope" aria-hidden="true">
        <div className="intro__envelope-flap" />
        <div className="intro__envelope-body">
          <span className="intro__seal" />
          <span className="intro__envelope-lines">
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>

      <Filia state="neutral" line={gameData.filiaLines.welcome} />

      <button type="button" className="btn btn--primary intro__cta" onClick={onStart}>
        {gameData.intro.cta}
      </button>
    </section>
  )
}
