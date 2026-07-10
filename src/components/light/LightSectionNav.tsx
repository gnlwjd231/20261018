import { useEffect, useState } from 'react'

const SECTIONS = [
  { id: 'light-story', label: 'Story' },
  { id: 'light-info', label: 'Info' },
  { id: 'light-guestbook', label: 'Guestbook' },
] as const

export function LightSectionNav() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight / 2
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id)
        if (el && el.offsetTop <= scrollY) {
          setCurrent(i)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (index: number) => {
    const el = document.getElementById(SECTIONS[index].id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="light-section-nav" aria-label="Section navigation">
      {SECTIONS.map(({ id, label }, i) => (
        <button
          key={id}
          className={`light-section-nav-item${i === current ? ' light-section-nav-item--active' : ''}`}
          onClick={() => scrollTo(i)}
        >
          {label}
        </button>
      ))}
    </nav>
  )
}
