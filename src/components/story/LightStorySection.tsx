import { useCallback, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import lightPhoto from '@/assets/images/light/favorite.jpg'
import BlurText from '@/components/BlurText'

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

const weddingDate = '2026.10.18 SUN 11:00'

const TOTAL_PAGES = 5

const galleryImages = [
  { src: '/src/assets/images/light/DSC01974.jpg', alt: '갤러리 사진 01' },
  { src: '/src/assets/images/light/DSC01640.jpg', alt: '갤러리 사진 02' },
  { src: '/src/assets/images/light/DSC02529.jpg', alt: '갤러리 사진 03' },
]

export function LightStorySection() {
  const [currentPage, setCurrentPage] = useState(0)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const goTo = useCallback((page: number) => {
    setCurrentPage(Math.max(0, Math.min(page, TOTAL_PAGES - 1)))
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo(currentPage + 1)
      else goTo(currentPage - 1)
    }
  }

  return (
    <div
      className="light-story-view"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="light-story-track"
        style={{ transform: `translateX(-${currentPage * 100}%)` }}
      >
        {/* Page 1: Cover */}
        <div className="light-story-page">
          <div className="editorial-cover-wrap">
            <figure className="editorial-cover">
              <img src={lightPhoto} alt="웨딩 사진" />
            </figure>
            <section className="light-page">
              <div className="editorial-copy">
                <p className="light-caption">A quiet beginning</p>
                <BlurText text="The Beginning" className="light-title" delay={80} />
                <p className="light-body">
                  9년 동안 서로의 일상을 채워온 두 사람이,
                  <br />
                  이제 하나의 일상을 시작합니다.
                </p>
              </div>
              <div className="event-strip">
                <span>{weddingDate}</span>
                <span>서울대학교 교수회관</span>
              </div>
            </section>
          </div>
        </div>

        {/* Pages 2-4: Episodes */}
        {episodes.map((ep) => (
          <div className="light-story-page light-episode-slide" key={ep.number}>
            <header className="light-episode-slide-header">
              <span className="light-episode-number">
                No.{ep.number} / {ep.caption}
              </span>
              <h2 className="light-episode-title">{ep.title}</h2>
            </header>

            <figure className="light-story-figure" aria-label={ep.imageAlt}>
              {ep.imageSrc ? (
                <img src={ep.imageSrc} alt={ep.imageAlt ?? ''} loading="lazy" />
              ) : (
                <div
                  className="light-story-figure-placeholder"
                  role="img"
                  aria-label={ep.imageAlt}
                />
              )}
              <figcaption className="light-story-figcaption">
                {ep.caption} / Archive {ep.number}
              </figcaption>
            </figure>

            <div className="light-episode-copy">
              {ep.body.map((line, i) => (
                <p key={i} className="light-episode-body">{line}</p>
              ))}
            </div>
          </div>
        ))}

        {/* Page 5: Gallery */}
        <div className="light-story-page light-gallery-slide">
          <header className="light-gallery-slide-header">
            <h3 className="light-gallery-slide-title">The Archive</h3>
            <p className="light-gallery-slide-sub">of Us</p>
          </header>
          <div className="light-gallery-slide-track">
            {galleryImages.map((img, i) => (
              <figure key={i} className="light-gallery-slide-figure" aria-label={img.alt}>
                <img src={img.src} alt={img.alt} loading="lazy" />
                <figcaption className="light-gallery-slide-caption">
                  Photo {String(i + 1).padStart(2, '0')}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="light-story-pagination">
        <button
          className="light-story-pg-btn"
          type="button"
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 0}
          aria-label="이전 페이지"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="light-story-pg-info">
          {String(currentPage + 1).padStart(2, '0')} / {String(TOTAL_PAGES).padStart(2, '0')}
        </span>
        <button
          className="light-story-pg-btn"
          type="button"
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === TOTAL_PAGES - 1}
          aria-label="다음 페이지"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
