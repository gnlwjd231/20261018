import { Moon, Sun } from 'lucide-react'
import { Suspense, lazy, useEffect, useState } from 'react'
import { LightStorySection } from './components/story/LightStorySection'
import { DarkStorySection } from './components/story/DarkStorySection'
import { LightInfoSection } from './components/info/LightInfoSection'
import { DarkInfoSection } from './components/info/DarkInfoSection'
import { LightSectionNav } from './components/light/LightSectionNav'
// ponytail: three.js only loads when dark mode opens
const CrtGallery = lazy(() => import('./components/dark/CrtGallery').then((m) => ({ default: m.CrtGallery })))
import { GuestbookSection } from './components/guestbook/GuestbookSection'
import CircularText from './components/CircularText'
import { FadeIn } from './components/ui/FadeIn'

type Mode = 'light' | 'dark'

const defaultMode: Mode = 'light'
const modeStorageKey = 'wedding-mode'

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
      if (nextMode === 'dark') window.scrollTo(0, 0)
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
      <Suspense fallback={<section className="crt-gallery" aria-label="Photo archive" />}>
        <CrtGallery />
      </Suspense>

      <DarkStorySection />
      <DarkInfoSection />
    </section>
  )
}

export default App
