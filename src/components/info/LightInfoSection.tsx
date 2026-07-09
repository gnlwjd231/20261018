import AnimatedContent from '@/components/AnimatedContent'
import { DdayCounter } from './DdayCounter'
import { KakaoMap } from './KakaoMap'
import { ContactsSection } from './ContactsSection'
import { TransportSection } from './TransportSection'
import { GuestbookSection } from '@/components/guestbook/GuestbookSection'

export function LightInfoSection() {
  return (
    <div className="light-info-wrapper">
      <div className="light-section-divider" aria-hidden="true">
        <span className="light-divider-label">Chapter 02 / Wedding Information</span>
      </div>

      <AnimatedContent distance={40} duration={0.7} threshold={0.15}>
        <section className="light-info-section" aria-label="예식 날짜 카운트다운">
          <DdayCounter mode="light" />
        </section>
      </AnimatedContent>

      <AnimatedContent distance={40} duration={0.7} threshold={0.15}>
        <section className="light-info-section" aria-label="예식장 위치 및 교통편">
          <h2 className="light-info-heading">오시는 길</h2>
          <KakaoMap mode="light" />
          <TransportSection mode="light" />
        </section>
      </AnimatedContent>

      <AnimatedContent distance={40} duration={0.7} threshold={0.15}>
        <section className="light-info-section" aria-label="연락처 및 계좌번호">
          <h2 className="light-info-heading">연락처</h2>
          <ContactsSection mode="light" />
        </section>
      </AnimatedContent>

      <div className="light-section-divider" aria-hidden="true">
        <span className="light-divider-label">Chapter 03 / Guestbook</span>
      </div>

      <AnimatedContent distance={40} duration={0.7} threshold={0.15}>
        <GuestbookSection mode="light" />
      </AnimatedContent>
    </div>
  )
}
