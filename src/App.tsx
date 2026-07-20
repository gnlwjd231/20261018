import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
const darkPhoto = '/images/dark/DSC03682-favorite.jpg'
import BlurText from './components/BlurText'
import LetterGlitch from './components/LetterGlitch'
import { LightStorySection } from './components/story/LightStorySection'
import { DarkStorySection } from './components/story/DarkStorySection'
import { LightInfoSection } from './components/info/LightInfoSection'
import { DarkInfoSection } from './components/info/DarkInfoSection'
import { LightSectionNav } from './components/light/LightSectionNav'
import { GuestbookSection } from './components/guestbook/GuestbookSection'
import CircularText from './components/CircularText'
import { FadeIn } from './components/ui/FadeIn'

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
      {mode === 'light' && <LightSectionNav />}
    </main>
  )
}

function LightModePage() {
  return (
    <>
    <section id="light-story" className="light-snap-section">
      <LightStorySection />
    </section>


    <section id="light-info" className="light-snap-section">
      <FadeIn className="light-section-circular-container">
        <div className="light-section-circular-wrapper" aria-hidden="true">
          <CircularText text="Wedding Information Wedding Information " spinDuration={100} className="light-divider-circular" />
        </div>
      </FadeIn>
      <LightInfoSection />
    </section>

    <section id="light-guestbook" className="light-snap-section">
      <GuestbookSection mode="light" />
    </section>
    </>
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
            <div className="dark-title-glitch-wrap">
              <div className="dark-glitch-canvas">
                <LetterGlitch
                  glitchColors={['#00FF66', '#FF3366', '#0D0E15']}
                  glitchSpeed={50}
                  centerVignette={false}
                  outerVignette={true}
                  smooth={true}
                  characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*()_+-=[]{}|;:',.<>?/~\`0123456789"
                />
              </div>
              <BlurText text="BOOT_SEQUENCE" className="dark-title dark-title-overlay" delay={38} animateBy="letters" />
            </div>
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
