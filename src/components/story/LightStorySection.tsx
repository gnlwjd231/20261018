import { useEffect, useRef } from 'react'
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack'

interface StoryEpisode {
  number: string
  caption: string
  title: string
  body: string[]
  imageAlt?: string
  imageSrc?: string
}

const episodes: StoryEpisode[] = [
  {
    number: '01',
    caption: 'The Lesson',
    title: 'A Chance Encounter',
    body: [
      '드럼 스틱을 처음 건네받은 날이었습니다.',
      '레슨실 창문으로 들어오던 오후 햇살과,',
      '낯선 사람의 눈이 처음으로 마주쳤습니다.',
    ],
    imageSrc: '/src/assets/images/light/DSC02075.jpg',
    imageAlt: '드럼 레슨, 첫 만남의 순간을 담은 사진',
  },
  {
    number: '02',
    caption: 'The Years',
    title: 'Nine Slow Seasons',
    body: [
      '9년이라는 시간은 길었지만,',
      '돌아보면 그 모든 날들이 짧게 느껴집니다.',
      '같은 음악을 듣고, 같은 밥을 먹고,',
      '서로의 일상이 되어갔습니다.',
    ],
    imageSrc: '/src/assets/images/light/DSC02481.jpg',
    imageAlt: '함께한 9년의 시간을 담은 사진',
  },
  {
    number: '03',
    caption: 'The Decision',
    title: 'An Ordinary Day',
    body: [
      '결혼을 결심한 날은',
      '특별한 날이 아니었습니다.',
      '그저 평범한 하루였는데,',
      '이 사람과 평생 평범하고 싶다는 생각이 들었습니다.',
    ],
    imageSrc: '/src/assets/images/light/DSC02774.jpg',
    imageAlt: '결혼을 결심한 평범하지만 소중한 날의 사진',
  },
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
      { threshold: 0.15 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
}

function EpisodeBlock({ episode, index }: { episode: StoryEpisode; index: number }) {
  const ref = useRef<HTMLElement>(null)
  useScrollReveal(ref)

  const isEven = index % 2 === 0

  return (
    <article
      ref={ref}
      className={`light-story-episode story-hidden ${isEven ? 'story-episode--left' : 'story-episode--right'}`}
      aria-label={`에피소드 ${episode.number}: ${episode.caption}`}
    >
      <header className="light-episode-header">
        <span className="light-episode-number">
          No.{episode.number} / {episode.caption}
        </span>
        <h2 className="light-episode-title">{episode.title}</h2>
      </header>

      {/* 이미지 영역 */}
      <figure className="light-story-figure" aria-label={episode.imageAlt}>
        {episode.imageSrc ? (
          <img src={episode.imageSrc} alt={episode.imageAlt ?? ''} loading="lazy" />
        ) : (
          <div
            className="light-story-figure-placeholder"
            role="img"
            aria-label={episode.imageAlt}
          />
        )}
        <figcaption className="light-story-figcaption">
          {episode.caption} / Archive {episode.number}
        </figcaption>
      </figure>

      {/* 텍스트 영역 */}
      <div className="light-episode-copy">
        {episode.body.map((line, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static content
          <p key={i} className="light-episode-body">
            {line}
          </p>
        ))}
      </div>
    </article>
  )
}

const galleryImages = [
  { src: '/src/assets/images/light/DSC01974.jpg', alt: '갤러리 사진 01' },
  { src: '/src/assets/images/light/DSC01640.jpg', alt: '갤러리 사진 02' },
  { src: '/src/assets/images/light/DSC02529.jpg', alt: '갤러리 사진 03' },
]

export function LightStorySection() {
  return (
    <section className="light-story-section" aria-label="우리의 이야기">
      {/* 섹션 헤더 */}
      <header className="light-story-header">
        <span className="light-story-kicker">Our Story / 우리의 이야기</span>
        <h1 className="light-story-headline">
          The Archive
          <br />
          <em>of Us</em>
        </h1>
        <p className="light-story-subhead">
          드럼 레슨실에서 시작된 이야기,
          <br />
          9년이 지나 결혼으로 이어집니다.
        </p>
        <div className="light-story-rule" aria-hidden="true" />
      </header>

      {/* 에피소드 목록 */}
      {episodes.map((ep, i) => (
        <EpisodeBlock key={ep.number} episode={ep} index={i} />
      ))}

      {/* 갤러리 - ScrollStack */}
      <div className="light-gallery-wrap">
        <ScrollStack
          useWindowScroll={true}
          itemDistance={20}
          itemScale={0.02}
          itemStackDistance={20}
          stackPosition="5%"
          scaleEndPosition="0%"
          baseScale={0.95}
          blurAmount={1}
        >
          {galleryImages.map((img, i) => (
            <ScrollStackItem key={i} itemClassName="light-gallery-card">
              <figure className="light-gallery-figure" aria-label={img.alt}>
                <img src={img.src} alt={img.alt} loading="lazy" />
                <figcaption className="light-gallery-card-caption">
                  Photo {String(i + 1).padStart(2, '0')}
                </figcaption>
              </figure>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  )
}
