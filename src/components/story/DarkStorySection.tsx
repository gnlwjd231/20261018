import { useEffect, useRef } from 'react'
import TextType from '@/components/TextType'

const DRUM_ASCII = `
      ||    ||
    __|_|__|_|__
   /  drum set  \\
  | ~~  ~~  ~~ |
   \\____________/
    [  ]    [  ]
     ||      ||
  ===||======||===
`

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
    note: '// 첫 만남. 드럼 레슨실. 예상치 못한 연결.',
  },
  {
    hash: 'e4f5a6b',
    year: '2016',
    type: 'fix',
    message: 'resolve awkward-silence via shared playlist',
    note: '// 어색함을 음악으로 해결.',
  },
  {
    hash: 'c7d8e9f',
    year: '2018',
    type: 'refactor',
    message: 'daily-routine: include each_other as dependency',
    note: '// 일상이 달라졌다.',
  },
  {
    hash: 'b0a1c2d',
    year: '2020',
    type: 'chore',
    message: 'survive(pandemic) — uptime maintained with co-presence',
    note: '// 팬데믹에도 함께였다.',
  },
  {
    hash: 'f3e4d5c',
    year: '2023',
    type: 'chore',
    message: 'ring.purchase() — proposal compiled successfully',
    note: '// 컴파일 성공. 드디어.',
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
  { label: 'UPTIME', value: '9 years, 3 months, 12 days' },
  { label: 'CPU_LOAD', value: '98%  // shared dreams' },
  { label: 'MEMORY', value: 'full  // no swap needed' },
  { label: 'STATUS', value: 'WEDDING_DAY_PENDING' },
]

function useScrollReveal(ref: React.RefObject<Element | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('story-revealed')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.12 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
}

function DarkBlock({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useScrollReveal(ref)
  return (
    <div ref={ref} className={`dark-story-block story-hidden ${className}`}>
      {children}
    </div>
  )
}

export function DarkStorySection() {
  return (
    <section className="dark-story-section" aria-label="우리의 이야기 (다크 모드)">
      {/* 섹션 헤더: 시스템 부팅 시퀀스 */}
      <DarkBlock className="dark-story-boot">
        <p className="dark-story-prompt">
          <span className="dark-prompt-caret">$</span> cat /proc/our_story
        </p>
        <div className="dark-typing-block">
          <TextType
            text="// loading relationship logs..."
            as="p"
            className="dark-story-comment dark-typing-line"
            typingSpeed={30}
            initialDelay={300}
            showCursor={false}
            loop={false}
            startOnVisible
          />
        </div>
        <div className="dark-typing-block">
          <TextType
            text="// found: 9 years of entries"
            className="dark-story-comment dark-typing-line"
            typingSpeed={30}
            initialDelay={1200}
            showCursor={false}
            loop={false}
            startOnVisible
          />
        </div>
        <div className="dark-typing-block">
          <TextType
            text="// rendering..."
            className="dark-story-comment dark-typing-line"
            typingSpeed={30}
            initialDelay={2400}
            showCursor={false}
            loop={false}
            startOnVisible
          />
        </div>
      </DarkBlock>

      {/* ASCII 드럼 아트 */}
      <DarkBlock>
        <pre
          className="dark-ascii-art"
          role="img"
          aria-label="ASCII 아트: 드럼 세트 — 우리가 처음 만난 드럼 레슨실"
        >
          {DRUM_ASCII}
        </pre>
        <p className="dark-story-caption">{'// 2015 — where it all began'}</p>
      </DarkBlock>

      {/* 사진: 신랑 드럼 */}
      <DarkBlock>
        <figure className="dark-story-figure" aria-label="신랑이 드럼을 치고 있는 모습">
          <img
            className="dark-story-image"
            src="/src/assets/images/dark/DSC03496.jpg"
            alt="드럼을 치고 있는 신랑"
            loading="lazy"
          />
          <figcaption className="dark-story-caption">{'// drummer.exe — running since 2015'}</figcaption>
        </figure>
      </DarkBlock>

      {/* 사진: 신부 템버린 */}
      <DarkBlock>
        <figure className="dark-story-figure" aria-label="신부가 템버린을 흔들고 있는 모습">
          <img
            className="dark-story-image"
            src="/src/assets/images/dark/DSC03561.jpg"
            alt="템버린을 신나게 흔드는 신부"
            loading="lazy"
          />
          <figcaption className="dark-story-caption">{'// tambourine.sh — maximum energy'}</figcaption>
        </figure>
      </DarkBlock>

      {/* git log */}
      <DarkBlock className="dark-git-log">
        <p className="dark-story-prompt">
          <span className="dark-prompt-caret">$</span> git log --oneline --all
        </p>
        <ul className="dark-log-list" aria-label="관계의 커밋 히스토리">
          {gitLog.map((entry, i) => (
            <li key={entry.hash} className="dark-log-entry">
              <span className="dark-log-hash">{entry.hash}</span>
              <span className={`dark-log-type dark-log-type--${entry.type}`}>
                {entry.type}
              </span>
              <TextType
                text={entry.message}
                as="span"
                className="dark-log-message"
                typingSpeed={20}
                initialDelay={400 * i + 500}
                showCursor={false}
                loop={false}
                startOnVisible
              />
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

      {/* 사진 1 — CRT 스타일 */}
      <DarkBlock>
        <figure className="dark-story-figure" aria-label="함께한 시간들">
          <img
            className="dark-story-image"
            src="/src/assets/images/dark/DSC03698.jpg"
            alt="함께한 시간들"
            loading="lazy"
          />
          <figcaption className="dark-story-caption">{'// 2015–2026 — runtime: 9 years'}</figcaption>
        </figure>
      </DarkBlock>

      {/* system status */}
      <DarkBlock>
        <p className="dark-story-prompt">
          <span className="dark-prompt-caret">$</span> ./relationship --status
        </p>
        <ul className="dark-status-list" aria-label="관계 상태 지표">
          {systemStatus.map((item, i) => (
            <li key={item.label} className="dark-status-item">
              <span className="dark-status-label">{item.label}</span>
              <span className="dark-status-sep">:</span>
              <TextType
                text={item.value}
                as="span"
                className="dark-status-value"
                typingSpeed={25}
                initialDelay={500 * i + 400}
                showCursor={false}
                loop={false}
                startOnVisible
              />
            </li>
          ))}
        </ul>
      </DarkBlock>

      {/* 사진 2 — CRT 스타일 */}
      <DarkBlock>
        <figure className="dark-story-figure" aria-label="드럼과 함께">
          <img
            className="dark-story-image"
            src="/src/assets/images/dark/DSC03845-2.jpg"
            alt="드럼과 함께한 순간"
            loading="lazy"
          />
          <figcaption className="dark-story-caption">{'// drum.exe — still running after 9 years'}</figcaption>
        </figure>
      </DarkBlock>

      {/* 커플 ASCII 아트 */}
      <DarkBlock>
        <pre
          className="dark-ascii-art dark-ascii-art--couple"
          role="img"
          aria-label="ASCII 아트: 기계공학 박사(신랑)와 프론트엔드 개발자 PM(신부) 커플"
        >
          {COUPLE_ASCII}
        </pre>
      </DarkBlock>

      {/* 웨딩 실행 명령어 */}
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
          />
        </div>
        <div className="dark-story-output" aria-live="polite">
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
