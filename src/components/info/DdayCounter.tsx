import { useEffect, useState } from 'react'
import { WEDDING_DATE_TIME, WEDDING_DATE_DISPLAY, MAP_LINKS } from '@/data/weddingInfo'

function getDday(): number {
  const now = new Date()
  const diff = WEDDING_DATE_TIME.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

interface DdayCounterProps {
  mode: 'light' | 'dark'
}

export function DdayCounter({ mode }: DdayCounterProps) {
  const [dday, setDday] = useState<number>(getDday)

  useEffect(() => {
    // 자정마다 갱신
    const now = new Date()
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()

    const timeout = window.setTimeout(() => {
      setDday(getDday())
      const interval = window.setInterval(() => setDday(getDday()), 1000 * 60 * 60 * 24)
      return () => clearInterval(interval)
    }, msUntilMidnight)

    return () => clearTimeout(timeout)
  }, [])

  const ddayLabel =
    dday > 0 ? `D-${dday}` : dday === 0 ? 'D-Day' : `D+${Math.abs(dday)}`

  const ddayMessage =
    dday > 0
      ? `결혼식까지 ${dday}일 남았습니다`
      : dday === 0
        ? '오늘이 결혼식 날입니다!'
        : `결혼식이 ${Math.abs(dday)}일 지났습니다`

  if (mode === 'dark') {
    return (
      <div className="dark-dday" aria-label={`결혼식 디데이: ${ddayLabel}`}>
        <p className="dark-story-prompt">
          <span className="dark-prompt-caret">$</span> date --wedding
        </p>
        <div className="dark-dday-display">
          <span className="dark-dday-number">{ddayLabel}</span>
          <span className="dark-dday-date">{WEDDING_DATE_DISPLAY}</span>
        </div>
        <p className="dark-dday-msg dark-story-comment">{'// '}{ddayMessage}</p>
        <div className="dday-calendar-links">
          <a
            href={MAP_LINKS.googleCalendar}
            target="_blank"
            rel="noopener noreferrer"
            className="dark-cal-link"
            aria-label="구글 캘린더에 일정 추가"
          >
            [Google Calendar]
          </a>
          <a
            href="#"
            onClick={handleIcs}
            className="dark-cal-link"
            aria-label="애플 캘린더에 일정 추가"
          >
            [Apple Calendar]
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="light-dday" aria-label={`결혼식 디데이: ${ddayLabel}`}>
      <span className="light-dday-label">Wedding Countdown</span>
      <div className="light-dday-display">
        <span className="light-dday-number">{ddayLabel}</span>
      </div>
      <p className="light-dday-date">{WEDDING_DATE_DISPLAY}</p>
      <p className="light-dday-msg">{ddayMessage}</p>
      <div className="dday-calendar-links">
        <a
          href={MAP_LINKS.googleCalendar}
          target="_blank"
          rel="noopener noreferrer"
          className="light-cal-link"
          aria-label="구글 캘린더에 일정 추가"
        >
          Google Calendar
        </a>
        <a
          href="#"
          onClick={handleIcs}
          className="light-cal-link"
          aria-label="애플 캘린더에 일정 추가"
        >
          Apple Calendar
        </a>
      </div>
    </div>
  )
}

function handleIcs(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault()
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invitation//KO',
    'BEGIN:VEVENT',
    'DTSTART:20261018T020000Z',
    'DTEND:20261018T040000Z',
    'SUMMARY:오○○♥박○○ 결혼식',
    'DESCRIPTION:서울대학교 교수회관',
    'LOCATION:서울특별시 관악구 관악로 1 서울대학교 교수회관',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'wedding-2026-1018.ics'
  a.click()
  URL.revokeObjectURL(url)
}
