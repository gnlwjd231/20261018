import { useRef } from 'react'
import { DdayCounter } from './DdayCounter'
import { KakaoMap } from './KakaoMap'
import { ContactsSection } from './ContactsSection'
import { TransportSection } from './TransportSection'

function useScrollReveal() {
  const ref = useRef<HTMLElement>(null)
  return ref
}

export function LightInfoSection() {
  const ddayRef = useScrollReveal()
  const mapRef = useScrollReveal()
  const contactRef = useScrollReveal()
  const transportRef = useScrollReveal()

  return (
    <div className="light-info-wrapper">
      {/* 구분선 */}
      <div className="light-section-divider" aria-hidden="true">
        <span className="light-divider-label">Chapter 02 / Wedding Information</span>
      </div>

      {/* D-Day */}
      <section
        ref={ddayRef}
        className="light-info-section story-hidden"
        aria-label="예식 날짜 카운트다운"
        data-reveal
      >
        <DdayCounter mode="light" />
      </section>

      {/* 지도 */}
      <section
        ref={mapRef}
        className="light-info-section story-hidden"
        aria-label="예식장 위치"
        data-reveal
      >
        <h2 className="light-info-heading">오시는 길</h2>
        <KakaoMap mode="light" />
        <TransportSection mode="light" />
      </section>

      {/* 연락처 */}
      <section
        ref={contactRef}
        className="light-info-section story-hidden"
        aria-label="연락처"
        data-reveal
      >
        <h2 className="light-info-heading">연락처</h2>
        <ContactsSection mode="light" />
      </section>
    </div>
  )
}
