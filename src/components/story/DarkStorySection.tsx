import { useEffect, useRef, useState } from 'react'
import TextType from '@/components/TextType'

const COUPLE_ASCII = `
  [eng.phd]   [dev.pm]
     |||          |||
    (o_o)        (^_^)
    /|/|\\        /|/|\\
    d   b        d   b
  =====================================
  > git merge --strategy=ours life.main
`

interface LogEntry {
  hash: string
  year: string
  type: 'feat' | 'fix' | 'chore' | 'refactor' | 'merge'
  message: string
  note?: string
}

const gitLog: LogEntry[] = [
  {
    hash: 'a1b2c3d',
    year: '2015',
    type: 'feat',
    message: 'meet() — drum lesson, unexpected callback registered',
  },
  {
    hash: 'e4f5a6b',
    year: '2016',
    type: 'fix',
    message: 'resolve awkward-silence via shared playlist',
  },
  {
    hash: 'c7d8e9f',
    year: '2018',
    type: 'refactor',
    message: 'daily-routine: include each_other as dependency',
  },
  {
    hash: 'b0a1c2d',
    year: '2020',
    type: 'chore',
    message: 'survive(long-distance) — connection kept across timezones',
  },
  {
    hash: 'f3e4d5c',
    year: '2023',
    type: 'chore',
    message: 'ring.purchase() — proposal compiled successfully',
  },
  {
    hash: '1a2b3c4',
    year: '2026',
    type: 'merge',
    message: 'merge branch "us" into main — wedding day scheduled',
    note: '// 2026.10.18',
  },
]

const systemStatus = [
  { label: 'SYNC', value: '100%  // no conflicts' },
  { label: 'CONNECTION', value: 'stable' },
  { label: 'STATUS', value: 'WEDDING_DAY_PENDING' },
]

// ponytail: 카드 단위 reveal 대신 자식 라인별로 한 줄씩 reveal (터미널 느낌)
function DarkBlock({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const lines = el.querySelectorAll('.dark-line')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('story-revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5, rootMargin: '0px 0px -10% 0px' },
    )
    lines.forEach((line) => observer.observe(line))
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`dark-story-block ${className}`}>
      {children}
    </div>
  )
}

export function DarkStorySection() {
  // ponytail: 프롬프트 타이핑이 끝나면 결과가 탁 나오게 — 블록별 완료 상태
  const [gitDone, setGitDone] = useState(false)
  const [statusDone, setStatusDone] = useState(false)
  const [weddingDone, setWeddingDone] = useState(false)

  return (
    <section className="dark-story-section" aria-label="우리의 이야기 (다크 모드)">
      {/* git log — 프롬프트 타이핑 후 결과가 탁 */}
      <DarkBlock className="dark-git-log">
        <p className="dark-story-prompt">
          <span className="dark-prompt-caret">$</span>{' '}
          <TextType
            text="git log --oneline --all"
            as="span"
            typingSpeed={35}
            initialDelay={200}
            showCursor={false}
            loop={false}
            startOnVisible
            onSentenceComplete={() => setGitDone(true)}
          />
        </p>
        {/* ponytail: 항상 렌더 + visibility로 숨김 — 탁 나타나도 높이 점프 없음 */}
        <ul
          className={`dark-log-list${gitDone ? '' : ' dark-result--pending'}`}
          aria-label="관계의 커밋 히스토리"
          aria-hidden={!gitDone}
        >
          {gitLog.map((entry) => (
            <li key={entry.hash} className="dark-log-entry">
              <span className="dark-log-hash">{entry.hash}</span>
              <span className={`dark-log-type dark-log-type--${entry.type}`}>
                {entry.type}
              </span>
              <span className="dark-log-message">{entry.message}</span>
              {entry.note && (
                <span className="dark-log-note" aria-label={`노트: ${entry.note}`}>
                  {entry.note}
                </span>
              )}
              <span className="dark-log-year">[{entry.year}]</span>
            </li>
          ))}
        </ul>
      </DarkBlock>

      {/* system status — 프롬프트 타이핑 후 결과가 탁 */}
      <DarkBlock>
        <p className="dark-story-prompt">
          <span className="dark-prompt-caret">$</span>{' '}
          <TextType
            text="./relationship --status"
            as="span"
            typingSpeed={35}
            initialDelay={200}
            showCursor={false}
            loop={false}
            startOnVisible
            onSentenceComplete={() => setStatusDone(true)}
          />
        </p>
        <ul
          className={`dark-status-list${statusDone ? '' : ' dark-result--pending'}`}
          aria-label="관계 상태 지표"
          aria-hidden={!statusDone}
        >
          {systemStatus.map((item) => (
            <li key={item.label} className="dark-status-item">
              <span className="dark-status-label">{item.label}</span>
              <span className="dark-status-sep">:</span>
              <span className="dark-status-value">{item.value}</span>
            </li>
          ))}
        </ul>
      </DarkBlock>

      {/* 커플 ASCII 아트 — status 타이핑이 끝나면 탁 (높이는 미리 차지) */}
      <DarkBlock>
        <pre
          className={`dark-ascii-art dark-ascii-art--couple${statusDone ? '' : ' dark-result--pending'}`}
          role="img"
          aria-label="ASCII 아트: 기계공학 박사(신랑)와 프론트엔드 개발자 PM(신부) 커플"
          aria-hidden={!statusDone}
        >
          {COUPLE_ASCII}
        </pre>
      </DarkBlock>

      {/* 웨딩 실행 명령어 — 상단 플래그 타이핑 후 결과가 탁 */}
      <DarkBlock className="dark-story-wedding-cmd">
        <p className="dark-story-prompt">
          <span className="dark-prompt-caret">$</span> ./wedding.sh \
        </p>
        <div className="dark-typing-block">
          <TextType
            text="  --date 2026-10-18 \"
            as="p"
            className="dark-story-prompt dark-story-prompt--indent"
            typingSpeed={25}
            initialDelay={400}
            showCursor={false}
            loop={false}
            startOnVisible
          />
        </div>
        <div className="dark-typing-block">
          <TextType
            text="  --venue snu-faculty-club \"
            as="p"
            className="dark-story-prompt dark-story-prompt--indent"
            typingSpeed={25}
            initialDelay={1400}
            showCursor={false}
            loop={false}
            startOnVisible
          />
        </div>
        <div className="dark-typing-block">
          <TextType
            text="  --guests everyone-we-love"
            as="p"
            className="dark-story-prompt dark-story-prompt--indent"
            typingSpeed={25}
            initialDelay={2600}
            showCursor={false}
            loop={false}
            startOnVisible
            onSentenceComplete={() => setWeddingDone(true)}
          />
        </div>
        <div
          className={`dark-story-output${weddingDone ? '' : ' dark-result--pending'}`}
          aria-live="polite"
          aria-hidden={!weddingDone}
        >
          <p className="dark-output-line">
            <span className="dark-output-arrow">{'>'}</span> Initializing ceremony sequence...
          </p>
          <p className="dark-output-line">
            <span className="dark-output-arrow">{'>'}</span> Verifying attendees...{' '}
            <span className="dark-output-ok">OK</span>
          </p>
          <p className="dark-output-line">
            <span className="dark-output-arrow">{'>'}</span> All systems nominal.
          </p>
          <p className="dark-output-line dark-output-final">
            <span className="dark-output-arrow">{'>'}</span> Status:{' '}
            <span className="dark-output-success">WEDDING_DAY READY</span>
          </p>
        </div>
      </DarkBlock>
    </section>
  )
}
