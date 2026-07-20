import { Train, Bus, Car, AlertTriangle } from 'lucide-react'
import { TRANSPORT } from '@/data/weddingInfo'

interface TransportProps {
  mode: 'light' | 'dark'
}

export function TransportSection({ mode }: TransportProps) {
  if (mode === 'dark') {
    return (
      <section
        className="dark-transport-section"
        aria-label="교통편 안내"
      >
        <p className="dark-story-prompt">
          <span className="dark-prompt-caret">$</span> ./transport --guide --guide
        </p>

        {/* 단계별 안내 */}
        <ol className="dark-transport-steps" aria-label="교통편 단계별 안내">
          {TRANSPORT.steps.map((step, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static
            <li key={i} className={`dark-transport-step${step.startsWith('⚠') ? ' dark-transport-step--warn' : ''}`}>
              <span className="dark-step-num">{String(i + 1).padStart(2, '0')}.</span>
              <span className="dark-step-text">{step}</span>
            </li>
          ))}
        </ol>

        {/* 자가용 */}
        <div className="dark-transport-car">
          <p className="dark-story-prompt">
            <span className="dark-prompt-caret">$</span> ./transport --parking
          </p>
          <p className="dark-story-comment">{'// '}{TRANSPORT.car.parking}</p>
          <p className="dark-story-comment">
            {'// navi: "'}
            <span className="dark-navi-keyword">{TRANSPORT.car.naviKeyword}</span>
            {'"'}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="light-transport-section" aria-label="교통편 안내">
      {/* 지하철 */}
      <div className="light-transport-block">
        <div className="light-transport-block-head">
          <Train size={16} aria-hidden="true" />
          <span>지하철</span>
        </div>
        <p className="light-transport-desc">
          {TRANSPORT.subway.line}&nbsp;
          <strong>{TRANSPORT.subway.station}</strong>&nbsp;
          {TRANSPORT.subway.exit}
        </p>
      </div>

      {/* 버스 단계별 */}
      <div className="light-transport-block">
        <div className="light-transport-block-head">
          <Bus size={16} aria-hidden="true" />
          <span>마을버스 (권장)</span>
        </div>
        <ol className="light-transport-steps" aria-label="교통편 단계별 안내">
          {TRANSPORT.steps.map((step, i) => {
            const isWarn = step.startsWith('⚠')
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: static
              <li key={i} className={`light-transport-step${isWarn ? ' light-transport-step--warn' : ''}`}>
                {isWarn && (
                  <AlertTriangle
                    size={13}
                    className="light-warn-icon"
                    aria-hidden="true"
                  />
                )}
                <span>{isWarn ? step.replace('⚠ ', '') : step}</span>
              </li>
            )
          })}
        </ol>
      </div>

      {/* 자가용 */}
      <div className="light-transport-block">
        <div className="light-transport-block-head">
          <Car size={16} aria-hidden="true" />
          <span>자가용</span>
        </div>
        <p className="light-transport-desc">
          주차: <strong>{TRANSPORT.car.parking}</strong>
        </p>
        <p className="light-transport-desc light-transport-navi">
          내비게이션 검색어:{' '}
          <strong>&ldquo;{TRANSPORT.car.naviKeyword}&rdquo;</strong>
        </p>
      </div>
    </section>
  )
}
