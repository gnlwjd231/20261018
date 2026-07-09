import { Send, MessageCircle } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { fetchGuestbook, addGuestbookEntry } from '@/lib/supabase'
import type { GuestbookEntry } from '@/lib/supabase'

interface GuestbookSectionProps {
  mode: 'light' | 'dark'
}

export function GuestbookSection({ mode }: GuestbookSectionProps) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [writerName, setWriterName] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 2500)
  }

  const loadEntries = useCallback(async () => {
    try {
      const data = await fetchGuestbook()
      setEntries(data)
    } catch {
      // silent fail
    }
  }, [])

  useEffect(() => {
    loadEntries()
  }, [loadEntries])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = writerName.trim()
    const msg = content.trim()
    if (!name || !msg) return

    setSubmitting(true)
    try {
      const entry = await addGuestbookEntry(name, msg, mode)
      setEntries((prev) => [entry, ...prev])
      setWriterName('')
      setContent('')
      showToast('소중한 축하 메시지가 전달되었습니다 ✨', 'success')
    } catch {
      showToast('메시지 전송에 실패했습니다. 다시 시도해주세요.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}.${m}.${day}`
  }

  return (
    <section className={`gb-section gb-section--${mode}`} aria-label="방명록">
      {mode === 'dark' && (
        <p className="dark-story-prompt">
          <span className="dark-prompt-caret">$</span> echo "congratulations" &gt;&gt; guestbook
        </p>
      )}

      <h3 className={mode === 'light' ? 'light-info-heading' : 'gb-heading--dark'}>
        {mode === 'light' ? '방명록' : '// GUESTBOOK.LOG'}
      </h3>

      {mode === 'light' && (
        <p className="gb-desc-light">
          두 사람의 새로운 시작을 축하하는 메시지를 남겨주세요.
          <br />
          <small className="gb-note-light">
            ※ 한 번 남긴 메시지는 수정이나 삭제가 불가능하니 신중히 작성해주세요.
          </small>
        </p>
      )}

      <form className={`gb-form gb-form--${mode}`} onSubmit={handleSubmit}>
        <input
          type="text"
          className={`gb-input gb-input--${mode} gb-input-name--${mode}`}
          placeholder={mode === 'light' ? '실명을 입력해주세요' : 'enter_real_name>'}
          value={writerName}
          onChange={(e) => setWriterName(e.target.value)}
          maxLength={30}
          required
          disabled={submitting}
        />
        <textarea
          className={`gb-input gb-input--${mode} gb-textarea--${mode}`}
          placeholder={mode === 'light' ? '축하 메시지를 남겨주세요' : 'leave_your_message>'}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          maxLength={500}
          required
          disabled={submitting}
        />
        <button
          type="submit"
          className={`gb-submit gb-submit--${mode}`}
          disabled={submitting || !writerName.trim() || !content.trim()}
        >
          <Send size={14} aria-hidden="true" />
          <span>{submitting ? '전송 중...' : '메시지 남기기'}</span>
        </button>
      </form>

      {mode === 'dark' && (
        <p className="gb-note-dark">// NOTE: entries are immutable once written</p>
      )}

      <div className={`gb-list gb-list--${mode}`}>
        {entries.length === 0 ? (
          <div className={`gb-empty gb-empty--${mode}`}>
            <MessageCircle size={mode === 'light' ? 28 : 18} aria-hidden="true" />
            <span>
              {mode === 'light'
                ? '아직 남겨진 메시지가 없습니다.\n첫 번째 축하 메시지를 남겨주세요!'
                : '// guestbook is empty — be the first to write'}
            </span>
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className={`gb-entry gb-entry--${mode}`}>
              <div className="gb-entry-header">
                <span className={`gb-entry-name gb-entry-name--${mode}`}>{entry.writer_name}</span>
                <span className={`gb-entry-date gb-entry-date--${mode}`}>
                  {formatDate(entry.created_at)}
                </span>
              </div>
              <p className={`gb-entry-content gb-entry-content--${mode}`}>{entry.content}</p>
            </div>
          ))
        )}
      </div>

      {toast &&
        createPortal(
          <div className={`gb-toast gb-toast--${mode} gb-toast--${toast.type}`} role="status">
            <MessageCircle size={14} aria-hidden="true" />
            <span>{toast.message}</span>
          </div>,
          document.body,
        )}
    </section>
  )
}