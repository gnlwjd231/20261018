import { Copy, Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { GROOM, BRIDE, PARENTS } from '@/data/contacts'
import type { Contact } from '@/data/contacts'

interface ContactsProps {
  mode: 'light' | 'dark'
}

function AccordionCard({ contact, mode }: { contact: Contact; mode: 'light' | 'dark' }) {
  const [open, setOpen] = useState(false)
  const [copiedPhone, setCopiedPhone] = useState(false)
  const [copiedAccount, setCopiedAccount] = useState(false)
  const hasAccount = contact.bank && contact.account

  const handleToggle = () => setOpen((v) => !v)

  const handleCopyPhone = async () => {
    if (!contact.phone) return
    try {
      await navigator.clipboard.writeText(contact.phone)
      setCopiedPhone(true)
      setTimeout(() => setCopiedPhone(false), 2000)
    } catch {
      // fallback
    }
  }

  const handleCopyAccount = async () => {
    if (!hasAccount) return
    try {
      await navigator.clipboard.writeText(contact.account!)
      setCopiedAccount(true)
      setTimeout(() => setCopiedAccount(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <div className={`contact-card contact-card--${mode}`}>
      <button
        type="button"
        className={`contact-trigger contact-trigger--${mode}`}
        onClick={handleToggle}
        aria-expanded={open}
      >
        <div className="contact-info">
          <span className={`contact-role contact-role--${mode}`}>{contact.role}</span>
          <span className={`contact-name contact-name--${mode}`}>{contact.name}</span>
        </div>
        <ChevronDown
          size={16}
          className={`contact-chevron contact-chevron--${mode}${open ? ' contact-chevron--open' : ''}`}
        />
      </button>

      <div className={`contact-panel${open ? ' contact-panel--open' : ''}`}>
        <div className="contact-panel-inner">
          {contact.phone && (
            <button
              type="button"
              className={`contact-info-btn contact-info-btn--${mode}`}
              onClick={handleCopyPhone}
              aria-label={`${contact.name} 전화번호 복사`}
            >
              <span className={`contact-info-label contact-info-label--${mode}`}>전화번호</span>
              <span className="contact-info-value">{contact.phone}</span>
              {copiedPhone ? <Check size={13} /> : <Copy size={13} />}
            </button>
          )}

          {hasAccount && (
            <button
              type="button"
              className={`contact-info-btn contact-info-btn--${mode}`}
              onClick={handleCopyAccount}
              aria-label={`${contact.name} 계좌번호 복사`}
            >
              <span className={`contact-info-label contact-info-label--${mode}`}>계좌번호</span>
              <span className="contact-info-value">{contact.bank} {contact.account}</span>
              {copiedAccount ? <Check size={13} /> : <Copy size={13} />}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function ContactsSection({ mode }: ContactsProps) {
  return (
    <section
      className={`contacts-section contacts-section--${mode}`}
      aria-label="연락처"
    >
      {mode === 'dark' && (
        <p className="dark-story-prompt">
          <span className="dark-prompt-caret">$</span> cat /etc/contacts
        </p>
      )}

      <div className={`contacts-group contacts-group--${mode}`}>
        <h3 className={`contacts-group-title contacts-group-title--${mode}`}>
          {mode === 'dark' ? '// 신랑 & 신부' : '신랑 & 신부'}
        </h3>
        <AccordionCard contact={GROOM} mode={mode} />
        <AccordionCard contact={BRIDE} mode={mode} />
      </div>

      {PARENTS.map((group) => (
        <div key={group.side} className={`contacts-group contacts-group--${mode}`}>
          <h3 className={`contacts-group-title contacts-group-title--${mode}`}>
            {mode === 'dark' ? `// ${group.side}` : group.side}
          </h3>
          {group.members.map((member) => (
            <AccordionCard key={`${group.side}-${member.role}`} contact={member} mode={mode} />
          ))}
        </div>
      ))}
    </section>
  )
}