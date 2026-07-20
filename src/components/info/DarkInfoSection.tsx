import AnimatedContent from '@/components/AnimatedContent'
import { DdayCounter } from './DdayCounter'
import { KakaoMap } from './KakaoMap'
import { ContactsSection } from './ContactsSection'
import { TransportSection } from './TransportSection'
import { GuestbookSection } from '@/components/guestbook/GuestbookSection'

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
          <ContactsSection mode="dark" />
        </div>
      </AnimatedContent>

      <AnimatedContent direction="vertical" distance={30} duration={0.6} threshold={0.15}>
        <div className="dark-info-block">
          <p className="dark-story-prompt">
            <span className="dark-prompt-caret">$</span> ./invitation --policy
          </p>
          <p className="dark-story-comment">{'// WARNING: batch invitation-gathering protocol deprecated'}</p>
          <p className="dark-story-comment">{'// root cause: post-covid ceremony bloat — feels like empty formalism'}</p>
          <p className="dark-story-comment">{'// no group gatherings scheduled; please do not feel left out'}</p>
          <p className="dark-story-prompt" style={{ marginTop: 12 }}>
            <span className="dark-story-comment">{'//'}</span>{' '}
            <span className="dark-output-ok">POLICY UPDATED — LOVE YOU ALL INDIVIDUALLY</span>
          </p>
        </div>
      </AnimatedContent>

      <AnimatedContent direction="vertical" distance={30} duration={0.6} threshold={0.15}>
        <div className="dark-info-block" style={{ marginTop: 8 }}>
          <GuestbookSection mode="dark" />
        </div>
      </AnimatedContent>
    </div>
  )
}
