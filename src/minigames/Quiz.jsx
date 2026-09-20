import { useEffect, useRef, useState } from 'react'
import Filia from '../components/Filia'
import { gameData } from '../data/gameData'
import { shuffle } from '../utils/random'
import './Quiz.css'

function buildWrongLine(attempt) {
  const { phrases } = gameData
  const lines = [
    phrases.birthdayPass,
    phrases.filiaPretends,
    phrases.twoVersions,
    phrases.dontUnderstand,
  ]
  return lines[(attempt - 1) % lines.length]
}

/**
 * Личная викторина из трёх вопросов.
 * Неправильный ответ не блокирует прохождение.
 */
export default function Quiz({ onComplete }) {
  const questions = gameData.quiz.questions
  const [index, setIndex] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [picked, setPicked] = useState(null)
  const [status, setStatus] = useState('idle')
  const [filiaLine, setFiliaLine] = useState('')
  const [filiaState, setFiliaState] = useState('thinking')
  const [done, setDone] = useState(false)
  const [options, setOptions] = useState(() => shuffle(questions[0].options))
  const completedRef = useRef(false)

  const question = questions[index]
  const total = questions.length

  useEffect(() => {
    setOptions(shuffle(question.options))
    setWrongCount(0)
    setPicked(null)
    setStatus('idle')
    setFiliaLine('')
    setFiliaState('thinking')
  }, [question.id, question.options])

  const showHint = wrongCount >= 2 && status !== 'correct'

  const handlePick = (option) => {
    if (done || status === 'correct' || completedRef.current) return

    setPicked(option)

    if (option === question.correct) {
      setStatus('correct')
      setFiliaState('happy')
      setFiliaLine(
        index === total - 1
          ? 'Три из трёх. Я почти улыбнулся. Почти.'
          : 'Верно. Запишу в серьёзный блокнот.',
      )

      window.setTimeout(() => {
        if (index >= total - 1) {
          setDone(true)
          if (!completedRef.current) {
            completedRef.current = true
            onComplete?.()
          }
        } else {
          setIndex((value) => value + 1)
        }
      }, 700)
      return
    }

    const nextWrong = wrongCount + 1
    setWrongCount(nextWrong)
    setStatus('wrong')
    setFiliaState('surprised')
    setFiliaLine(buildWrongLine(nextWrong))
  }

  return (
    <div className="quiz">
      <div className="quiz__progress" aria-live="polite">
        Вопрос {index + 1}/{total}
      </div>

      <h3 className="quiz__question">{question.text}</h3>

      <div className="quiz__options" role="group" aria-label="Варианты ответа">
        {options.map((option) => {
          const isCorrect = option === question.correct
          const isPicked = option === picked
          const classes = [
            'quiz__option',
            isPicked && status === 'wrong' ? 'is-wrong' : '',
            isPicked && status === 'correct' ? 'is-correct' : '',
            showHint && isCorrect ? 'is-hint' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <button
              key={`${question.id}-${option}`}
              type="button"
              className={classes}
              onClick={() => handlePick(option)}
              disabled={status === 'correct' || done}
              aria-pressed={isPicked}
            >
              {option}
            </button>
          )
        })}
      </div>

      {filiaLine ? (
        <div className="quiz__filia">
          <Filia state={filiaState} line={filiaLine} compact enter={false} />
        </div>
      ) : null}

      {done ? (
        <p className="quiz__done" role="status">
          Викторина пройдена
        </p>
      ) : null}
    </div>
  )
}
