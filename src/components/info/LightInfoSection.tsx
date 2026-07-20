import AnimatedContent from '@/components/AnimatedContent'
import { DdayCounter } from './DdayCounter'
import { KakaoMap } from './KakaoMap'
import { ContactsSection } from './ContactsSection'
import { TransportSection } from './TransportSection'

export function LightInfoSection() {
  return (
    <div className="light-info-wrapper">
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

      <AnimatedContent distance={40} duration={0.7} threshold={0.15}>
        <section className="light-info-section" aria-label="안내 말씀">
          <h2 className="light-info-heading">안내 말씀</h2>
          <p className="light-body">
            청첩장 모임은 따로 진행하지 않기로 했습니다.
            <br />
            서운해하지 말아주시고, 너그러운 마음으로 양해 부탁드립니다.
            <br />
            흰 옷 가능, 슬리퍼 가능, 반바지 가능, 편한 신발 가능, 편한 마음 가능.
          </p>
        </section>
      </AnimatedContent>
    </div>
  )
}
