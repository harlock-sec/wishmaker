import { useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import categories from './questionnaireData.json'
import './Questionnaire.css'

type Answers = Record<number, number>[]
const MIN = 2
const LABELS = ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree']
const PEOPLE = [
  { name: 'Maya', scores: [80, 45, 85, 70, 90, 60, 40, 65] },
  { name: 'Jordan', scores: [60, 90, 50, 80, 30, 35, 85, 40] },
  { name: 'Sam', scores: [70, 55, 75, 60, 70, 80, 55, 75] },
  { name: 'Riley', scores: [35, 70, 60, 40, 55, 45, 90, 30] },
]
const point = (index: number, value: number, total: number): [number, number] => {
  const angle = Math.PI * 2 * index / total - Math.PI / 2
  const radius = 110 * value / 100
  return [170 + radius * Math.cos(angle), 160 + radius * Math.sin(angle)]
}
const polygon = (values: number[]) => values.map((v, i) => point(i, v, values.length).join(',')).join(' ')

export default function Questionnaire() {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Answers>(() => categories.map(() => ({})))
  const [showResults, setShowResults] = useState(false)
  const category = categories[current]
  const count = Object.keys(answers[current]).length
  const complete = answers.every(a => Object.keys(a).length >= MIN)
  const scores = categories.map((c, ci) => {
    const entries = Object.entries(answers[ci])
    if (!entries.length) return 50
    const total = entries.reduce((sum, [qi, value]) => {
      const reverse = c.q[Number(qi)].endsWith('~')
      return sum + ((reverse ? 6 - value : value) - 1) * 25
    }, 0)
    return Math.round(total / entries.length)
  })
  const matches = PEOPLE.map(p => ({
    name: p.name,
    percentage: Math.round(100 - scores.reduce((sum, s, i) => sum + Math.abs(s - p.scores[i]), 0) / scores.length),
  })).sort((a, b) => b.percentage - a.percentage).slice(0, 3)
  const go = (next: number) => {
    if (next < 0 || next >= categories.length) return
    setCurrent(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const choose = (question: number, value: number) => {
    setAnswers(previous => previous.map((a, i) => i === current ? { ...a, [question]: value } : a))
  }
  return (
    <div className="wm-quiz-page">
      <header className="wm-quiz-header">
        <Link className="wm-quiz-brand" to="/">WISHMAKER<span>_</span></Link>
        <div className="wm-quiz-header-right">[ PERSONALITY // CONSTELLATION ]</div>
      </header>
      <div className="wm-quiz-masthead" aria-hidden="true">
        <div className="wm-quiz-masthead-label">✧ FIND YOUR FREQUENCY // EST. 2026</div>
        <div className="wm-quiz-skyline" />
      </div>
      <main className="wm-quiz-main">
        {!showResults ? (
          <section className="wm-quiz-panel" aria-label="Personality questionnaire">
            <div className="wm-quiz-stage" aria-hidden="true">
              <div className="wm-quiz-ring" style={{ '--cur': current, '--d': `${360 / categories.length}deg` } as CSSProperties}>
                {categories.map((c, i) => (
                  <div className="wm-quiz-slot" key={c.n} style={{ '--i': i } as CSSProperties}>
                    <div className={`wm-quiz-planet ${c.n === 'Saturn' ? 'wm-quiz-saturn' : ''}`}
                      style={{ '--i': i, '--cur': current, '--d': `${360 / categories.length}deg`, '--planet-color': c.c } as CSSProperties}>
                      {c.g}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="wm-quiz-head">
              <button className="wm-quiz-arrow" onClick={() => go(current - 1)} disabled={current === 0} aria-label="Previous group of questions">←</button>
              <h1>{category.n} Questions</h1>
              <button className="wm-quiz-arrow" onClick={() => go(current + 1)} disabled={current === categories.length - 1} aria-label="Next group of questions">→</button>
            </div>
            <p className={`wm-quiz-need ${count >= MIN ? 'ok' : ''}`}>
              Answer at least {MIN} ({count}/{category.q.length}) {count >= MIN ? '✓' : ''}
            </p>
            {category.q.map((raw, qi) => {
              const question = raw.replace(/~$/, '')
              return (
                <fieldset className="wm-quiz-question" key={`${current}-${qi}`}>
                  <legend>{question}</legend>
                  <div className="wm-quiz-options">
                    {LABELS.map((label, idx) => (
                      <label key={label} title={label}>
                        <input type="radio" name={`question-${current}-${qi}`} value={idx + 1}
                          aria-label={label} checked={answers[current][qi] === idx + 1}
                          onChange={() => choose(qi, idx + 1)} />
                      </label>
                    ))}
                  </div>
                  <div className="wm-quiz-ends"><span>Strongly disagree</span><span>Strongly agree</span></div>
                </fieldset>
              )
            })}
          </section>
        ) : (
          <section className="wm-quiz-panel wm-quiz-results">
            <h2>Match preview // demo</h2>
            <p className="wm-quiz-muted">A local demonstration using fictional profiles. No blockchain transaction or real match is created.</p>
            <svg className="wm-quiz-chart" viewBox="0 0 340 320" role="img" aria-label="Radar chart of eight prototype category scores">
              {[25, 50, 75, 100].map(level => <polygon key={level} points={polygon(categories.map(() => level))} fill="none" stroke="#493254" />)}
              {categories.map((c, i) => { const [x, y] = point(i, 100, categories.length); return <line key={c.n} x1="170" y1="160" x2={x} y2={y} stroke="#493254" /> })}
              <polygon points={polygon(scores)} fill="#f054e5" fillOpacity=".22" stroke="#f054e5" strokeWidth="2.5" />
              {categories.map((c, i) => { const [x, y] = point(i, scores[i], categories.length); const [lx, ly] = point(i, 128, categories.length); return <g key={c.n}><circle cx={x} cy={y} r="4" fill="#f054e5"/><text x={lx} y={ly + 4} textAnchor="middle">{c.g} {c.n}</text></g> })}
            </svg>
            <ul className="wm-quiz-legend">{categories.map((c, i) => <li key={c.n}><span>{c.g} {c.n}</span><b>{scores[i]}</b></li>)}</ul>
            {matches.map(m => <div className="wm-quiz-match" key={m.name}><h3>{m.name}</h3><strong>{m.percentage}%</strong></div>)}
            <button className="wm-quiz-edit" onClick={() => setShowResults(false)}>Edit my answers</button>
          </section>
        )}
      </main>
      <footer className="wm-quiz-footer"><span>WISHMAKER // A CONNECTION PROTOCOL</span><span>MONAD TESTNET · DESIGN PROTOTYPE</span></footer>
      {!showResults && <button className="wm-quiz-request" disabled={!complete} onClick={() => { setShowResults(true); window.scrollTo({ top: 0 }) }}>Preview match</button>}
    </div>
  )
}
