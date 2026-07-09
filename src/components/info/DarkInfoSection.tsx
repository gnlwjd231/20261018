import { useEffect, useRef } from 'react'
import { DdayCounter } from './DdayCounter'
import { KakaoMap } from './KakaoMap'
import { ContactsSection } from './ContactsSection'
import { TransportSection } from './TransportSection'

function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('story-revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}

export function DarkInfoSection() {
  const ddayRef = useScrollReveal<HTMLDivElement>()
  const mapRef = useScrollReveal<HTMLDivElement>()
  const transportRef = useScrollReveal<HTMLDivElement>()
  const contactRef = useScrollReveal<HTMLDivElement>()

  return (
    <div className="dark-info-wrapper">
      {/* D-Day */}
      <div ref={ddayRef} className="dark-info-block story-hidden">
        <DdayCounter mode="dark" />
      </div>

      {/* 지도 */}
      <div ref={mapRef} className="dark-info-block story-hidden">
        <p className="dark-story-prompt">
          <span className="dark-prompt-caret">$</span> ./venue --location
        </p>
        <KakaoMap mode="dark" />
      </div>

      {/* 교통편 */}
      <div ref={transportRef} className="dark-info-block story-hidden">
        <TransportSection mode="dark" />
      </div>

      {/* 연락처 */}
      <div ref={contactRef} className="dark-info-block story-hidden">
        <p className="dark-story-prompt">
          <span className="dark-prompt-caret">$</span> cat /etc/contacts
        </p>
        <ContactsSection mode="dark" />
      </div>
    </div>
  )
}
