import AnimatedContent from '@/components/AnimatedContent'
import { DdayCounter } from './DdayCounter'
import { KakaoMap } from './KakaoMap'
import { ContactsSection } from './ContactsSection'
import { TransportSection } from './TransportSection'

export function DarkInfoSection() {
  return (
    <div className="dark-info-wrapper">
      <AnimatedContent direction="vertical" distance={30} duration={0.6} threshold={0.15}>
        <div className="dark-info-block">
          <DdayCounter mode="dark" />
        </div>
      </AnimatedContent>

      <AnimatedContent direction="vertical" distance={30} duration={0.6} threshold={0.15}>
        <div className="dark-info-block">
          <p className="dark-story-prompt">
            <span className="dark-prompt-caret">$</span> ./venue --location
          </p>
          <KakaoMap mode="dark" />
        </div>
      </AnimatedContent>

      <AnimatedContent direction="vertical" distance={30} duration={0.6} threshold={0.15}>
        <div className="dark-info-block">
          <TransportSection mode="dark" />
        </div>
      </AnimatedContent>

      <AnimatedContent direction="vertical" distance={30} duration={0.6} threshold={0.15}>
        <div className="dark-info-block">
          <p className="dark-story-prompt">
            <span className="dark-prompt-caret">$</span> cat /etc/contacts
          </p>
          <ContactsSection mode="dark" />
        </div>
      </AnimatedContent>
    </div>
  )
}
