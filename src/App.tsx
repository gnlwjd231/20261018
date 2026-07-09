import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import lightPhoto from './assets/images/light/favorite.jpg'
import darkPhoto from './assets/images/dark/DSC03682-favorite.jpg'
import BlurText from './components/BlurText'

type Mode = 'light' | 'dark'

const weddingDate = '2026.10.18 SUN 11:00'

function App() {
  const [mode, setMode] = useState<Mode>(() => {
    const savedMode = localStorage.getItem('wedding-mode')
    return savedMode === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    localStorage.setItem('wedding-mode', mode)
    document.documentElement.dataset.theme = mode
  }, [mode])

  const nextMode = mode === 'light' ? 'dark' : 'light'

  return (
    <main className={`invitation invitation-${mode}`}>
      <button
        className="mode-toggle"
        type="button"
        onClick={() => setMode(nextMode)}
        aria-label={`${nextMode} mode`}
        title={`${nextMode} mode`}
      >
        {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      {mode === 'light' ? <LightModePage /> : <DarkModePage />}
    </main>
  )
}

function LightModePage() {
  return (
    <section className="light-page" aria-label="Light mode invitation">
      <div className="light-kicker">Chapter 01 / The Wedding Issue</div>
      <figure className="editorial-cover">
        <img src={lightPhoto} alt="웨딩 사진" />
        <figcaption>Photo 01 / Seoul, Archive of us</figcaption>
      </figure>

      <div className="editorial-copy">
        <p className="light-caption">A quiet beginning</p>
        <BlurText text="The Beginning" className="light-title" delay={80} />
        <p className="light-body">
          9년 동안 서로의 일상을 채워온 두 사람이,
          <br />
          이제 하나의 일상을 시작합니다.
        </p>
      </div>

      <div className="event-strip">
        <span>{weddingDate}</span>
        <span>서울대학교 교수회관</span>
      </div>
    </section>
  )
}

function DarkModePage() {
  return (
    <section className="dark-page" aria-label="Dark mode invitation">
      <div className="terminal-frame">
        <div className="terminal-bar">
          <span>guest@wedding:~</span>
          <span>RUNNING</span>
        </div>

        <div className="terminal-grid">
          <div className="terminal-copy">
            <p className="dark-caption">Chapter 02 / boot sequence</p>
            <BlurText text="BOOT_SEQUENCE" className="dark-title" delay={38} animateBy="letters" />
            <p className="dark-body">
              &gt; loading 9 years of logs...
              <br />
              &gt; compiling one shared timeline...
              <br />
              &gt; status: wedding day scheduled
            </p>
          </div>

          <figure className="crt-photo">
            <img src={darkPhoto} alt="다크 모드 웨딩 사진" />
          </figure>
        </div>

        <pre className="ascii-panel" aria-label="ASCII wedding marker">
{`+--------------------------------+
|  DATE ${weddingDate}  |
|  VENUE SEOUL NATL. UNIV. HALL |
|  MODE  ROCK / CODE / WEDDING  |
+--------------------------------+`}
        </pre>
      </div>
    </section>
  )
}

export default App
