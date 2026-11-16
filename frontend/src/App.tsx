import { Routes, Route, Link } from 'react-router-dom'
import Questionnaire from './components/Questionnaire'
import WalletConnect from './components/WalletConnect'
import './App.css'
import skyline from './assets/skyline.png'

const steps = [
  ['Create an account', 'Set up your Wishmaker profile'],
  ['Connect your wallet', 'Link a Monad wallet and mint your identity'],
  ['Take the personality questionnaire', 'Define your ten personality quotients'],
  ['Discover your matches', 'Meet people who complement your constellation'],
]

const features = [
  { symbol: '☼', title: 'Personality First', description: 'A deeper match through ten unique quotients.' },
  { symbol: '◎', title: 'On-Chain Identity', description: 'A verifiable, nontransferable identity on Monad.' },
  { symbol: '☾', title: 'Meaningful Matches', description: 'People who align with your mind, heart, and style.' },
  { symbol: '♄', title: 'Private & Yours', description: 'Your data, your choices, your connections.' },
]

function HomePage() {
  return (
    <div className="wishmaker">
      <header className="topbar">
        <a className="logo" href="#home"><span className="logo-star" aria-hidden="true">✳</span>Wishmaker_</a>
        <nav aria-label="Main navigation">
          <a className="selected" href="#home">[ home ]</a>
          <a href="#features">[ discover ]</a>
          <a href="#features">[ messages ]</a>
          <a href="#identity">[ identity ]</a>
        </nav>
        <WalletConnect />
      </header>

      <main id="home">
        <div className="skyline" role="img" aria-label="Pixel-art purple cyberpunk skyline beneath a giant pink planet, with two people sitting together on a rooftop" style={{backgroundImage: `url(${skyline})`}} />
        <div className="page-frame">
          <section className="intro" aria-label="Welcome to Wishmaker">
            <div className="intro-copy">
              <h1>Wishmaker_</h1>
              <p className="tagline">A space for genuine connection.</p>
              <p className="description">Discover people who resonate with you—through personality, compatibility, and a shared sense of wonder.</p>
              <div className="actions">
                <Link className="start" to="/questionnaire">[ get started → ]</Link>
                <a className="learn" href="#identity">[ learn more ]</a>
              </div>
            </div>
            <aside className="identity-panel" id="identity">
              <div className="identity-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><span className="art-star">✴</span><span className="art-moon">☾</span><span className="art-spark">✦</span></div>
              <div className="identity-copy">
                <h2>Create Your Wishmaker Identity</h2>
                <ol>{steps.map(([heading, sub], index) => <li key={heading}><span className="step-num">[{index + 1}]</span><div><strong>{heading}</strong><small>{sub}</small></div></li>)}</ol>
              </div>
            </aside>
          </section>
          <section className="features" id="features" aria-label="Wishmaker features">
            {features.map(feature => <article className="feature" key={feature.title}><div className="feature-icon" aria-hidden="true">{feature.symbol}</div><h3>{feature.title}</h3><p>{feature.description}</p></article>)}
          </section>
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/questionnaire" element={<Questionnaire />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  )
}

export default App
