import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import lightPhoto from './assets/images/light/favorite.jpg'
import darkPhoto from './assets/images/dark/DSC03682-favorite.jpg'
import BlurText from './components/BlurText'
import Dither from './components/Dither'
import GradualBlur from './components/GradualBlur'
import { LightStorySection } from './components/story/LightStorySection'
import { DarkStorySection } from './components/story/DarkStorySection'
import { LightInfoSection } from './components/info/LightInfoSection'
import { DarkInfoSection } from './components/info/DarkInfoSection'

type Mode = 'light' | 'dark'

const defaultMode: Mode = 'light'
const modeStorageKey = 'wedding-mode'
const weddingDate = '2026.10.18 SUN 11:00'

function App() {
  const [mode, setMode] = useState<Mode>(() => {
    const savedMode = localStorage.getItem(modeStorageKey)
    return savedMode === 'dark' || savedMode === 'light' ? savedMode : defaultMode
  })
  const [isSwitching, setIsSwitching] = useState(false)

  useEffect(() => {
    localStorage.setItem(modeStorageKey, mode)
    document.documentElement.dataset.theme = mode
  }, [mode])

  const nextMode = mode === 'light' ? 'dark' : 'light'

  const handleModeToggle = () => {
    if (isSwitching) return

    setIsSwitching(true)
    window.setTimeout(() => {
      setMode(nextMode)
      window.setTimeout(() => setIsSwitching(false), 260)
    }, 180)
  }

  return (
    <main className={`invitation invitation-${mode}${isSwitching ? ' invitation-switching' : ''}`}>
      <button
        className="mode-toggle"
        type="button"
        onClick={handleModeToggle}
        disabled={isSwitching}
        aria-label={`${nextMode} mode`}
        title={`${nextMode} mode`}
      >
        {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      <div className="mode-stage" key={mode}>
        {mode === 'light' ? <LightModePage /> : <DarkModePage />}
      </div>
    </main>
  )
}

function LightModePage() {
  return (
    <>
    <div className="editorial-cover-wrap">
      <figure className="editorial-cover">
        <img src={lightPhoto} alt="웨딩 사진" />
        <figcaption>Photo 01 / Seoul, Archive of us</figcaption>
      </figure>
      <GradualBlur preset="page-header" strength={1.5} opacity={0.6} />
    </div>
    <section className="light-page" aria-label="Light mode invitation">
      <div className="light-kicker">Chapter 01 / The Wedding Issue</div>

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

    <LightStorySection />
    <LightInfoSection />
    </>
  )
}

function DarkModePage() {
  return (
    <section className="dark-page" aria-label="Dark mode invitation">
      <div className="dark-dither-bg">
        <Dither
          waveSpeed={0.03}
          waveFrequency={2.5}
          waveAmplitude={0.2}
          waveColor={[0.05, 0.9, 0.3]}
          colorNum={3}
          pixelSize={3}
          enableMouseInteraction={true}
        />
      </div>
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

      <DarkStorySection />
      <DarkInfoSection />
    </section>
  )
}

export default App
