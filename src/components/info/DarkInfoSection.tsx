import { DdayCounter } from './DdayCounter'
import { KakaoMap } from './KakaoMap'
import { ContactsSection } from './ContactsSection'
import { TransportSection } from './TransportSection'

export function DarkInfoSection() {
  return (
    <div className="dark-info-wrapper">
      {/* D-Day */}
      <div className="dark-info-block story-hidden">
        <DdayCounter mode="dark" />
      </div>

      {/* 지도 */}
      <div className="dark-info-block story-hidden">
        <p className="dark-story-prompt">
          <span className="dark-prompt-caret">$</span> ./venue --location
        </p>
        <KakaoMap mode="dark" />
      </div>

      {/* 교통편 */}
      <div className="dark-info-block story-hidden">
        <TransportSection mode="dark" />
      </div>

      {/* 연락처 */}
      <div className="dark-info-block story-hidden">
        <p className="dark-story-prompt">
          <span className="dark-prompt-caret">$</span> cat /etc/contacts
        </p>
        <ContactsSection mode="dark" />
      </div>
    </div>
  )
}
