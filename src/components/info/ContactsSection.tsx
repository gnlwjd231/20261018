import { Phone, MessageSquare } from 'lucide-react'
import { GROOM, BRIDE, PARENTS } from '@/data/contacts'
import type { Contact } from '@/data/contacts'

interface ContactsProps {
  mode: 'light' | 'dark'
}

function ContactCard({
  contact,
  mode,
}: {
  contact: Contact
  mode: 'light' | 'dark'
}) {
  const hasPhone = contact.phone !== null

  return (
    <div className={`contact-card contact-card--${mode}`}>
      <div className="contact-info">
        <span className={`contact-role contact-role--${mode}`}>{contact.role}</span>
        <span className={`contact-name contact-name--${mode}`}>{contact.name}</span>
        {contact.phone ? (
          <span className={`contact-phone contact-phone--${mode}`}>{contact.phone}</span>
        ) : (
          <span className={`contact-phone contact-phone--${mode} contact-phone--unknown`}>
            번호 미정
          </span>
        )}
      </div>
      {hasPhone && (
        <div className="contact-actions" aria-label={`${contact.name} 연락 수단`}>
          <a
            href={`tel:${contact.phone!.replace(/-/g, '')}`}
            className={`contact-btn contact-btn--call contact-btn--${mode}`}
            aria-label={`${contact.name}에게 전화하기`}
          >
            <Phone size={15} aria-hidden="true" />
            <span>전화</span>
          </a>
          <a
            href={`sms:${contact.phone!.replace(/-/g, '')}`}
            className={`contact-btn contact-btn--sms contact-btn--${mode}`}
            aria-label={`${contact.name}에게 문자하기`}
          >
            <MessageSquare size={15} aria-hidden="true" />
            <span>문자</span>
          </a>
        </div>
      )}
    </div>
  )
}

export function ContactsSection({ mode }: ContactsProps) {
  return (
    <section
      className={`contacts-section contacts-section--${mode}`}
      aria-label="연락처"
    >
      {/* 신랑신부 */}
      <div className={`contacts-group contacts-group--${mode}`}>
        <h3 className={`contacts-group-title contacts-group-title--${mode}`}>
          {mode === 'dark' ? '// 신랑 & 신부' : '신랑 & 신부'}
        </h3>
        <ContactCard contact={GROOM} mode={mode} />
        <ContactCard contact={BRIDE} mode={mode} />
      </div>

      {/* 혼주 */}
      {PARENTS.map((group) => (
        <div key={group.side} className={`contacts-group contacts-group--${mode}`}>
          <h3 className={`contacts-group-title contacts-group-title--${mode}`}>
            {mode === 'dark' ? `// ${group.side}` : group.side}
          </h3>
          {group.members.map((member) => (
            <ContactCard key={`${group.side}-${member.role}`} contact={member} mode={mode} />
          ))}
        </div>
      ))}
    </section>
  )
}
