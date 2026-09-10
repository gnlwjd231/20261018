import { useCallback, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
const lightPhoto = '/images/light/opt/favorite.webp'
import BlurText from '@/components/BlurText'
import Masonry from '@/components/Masonry'
import PhotoLightbox from '@/components/PhotoLightbox'

const weddingDate = '2026.10.18 SUN 11:00'

const TOTAL_PAGES = 3

const optPath = (p: string) => p.replace(/\.jpg$/, '.webp').replace(/\/(light|dark)\//, '/$1/opt/')
const thumbPath = (p: string) => p.replace(/\.jpg$/, '.webp').replace(/\/(light|dark)\//, '/$1/thumb/')

const picNum = (p: string) => parseInt(p.match(/DSC0*(\d+)/)?.[1] ?? '0', 10)

const masonryItems = [
  { id: 'm12', img: '/images/light/DSC01640.jpg', ar: 2667 / 4000 },
  { id: 'm9', img: '/images/light/DSC01766.jpg', ar: 2667 / 4000 },
  { id: 'm3', img: '/images/light/DSC01886.jpg', ar: 2667 / 4000 },
  { id: 'm20', img: '/images/light/DSC02023.jpg', ar: 2667 / 4000 },
  { id: 'm26', img: '/images/light/DSC02071.jpg', ar: 4000 / 2667 },
  { id: 'm2', img: '/images/light/DSC02075.jpg', ar: 4000 / 2667 },
  { id: 'm6', img: '/images/light/DSC02427.jpg', ar: 2667 / 4000 },
  { id: 'm23', img: '/images/light/DSC02527.jpg', ar: 2667 / 4000 },
  { id: 'm5', img: '/images/light/DSC02774.jpg', ar: 2667 / 4000 },
  { id: 'm29', img: '/images/light/DSC02840.jpg', ar: 2667 / 4000 },
  { id: 'm18', img: '/images/light/DSC02942.jpg', ar: 4000 / 2667 },
].map(i => ({ ...i, img: optPath(i.img) }))
  // ponytail: 파일명 숫자순 정렬 — 사진 추가해도 순서 신경 쓸 필요 없음
  .sort((a, b) => picNum(a.img) - picNum(b.img))
  .map((item, i) => ({ ...item, id: `p${i + 1}` }))

const masonryImages = masonryItems.map(i => i.img)
const masonryThumbnails = masonryItems.map(i => thumbPath(i.img.replace('/opt/', '/')))

export function LightStorySection() {
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
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
                <p className="light-caption">축복을 부탁드립니다</p>
                <BlurText text="The Beginning" className="light-title" delay={80} />
                <p className="light-body">
                  신랑 오기승 신부 박휘정
                  <br/>
                  가족이 되는 날, 초대합니다.
                </p>
              </div>
              <div className="event-strip">
                <span>{weddingDate}</span>
                <span>서울대학교 교수회관</span>
              </div>
            </section>
          </div>
        </div>

        {/* Page 2: Episode 01 */}
        <div className="light-story-page light-episode-slide" data-episode="1">
          <figure className="light-story-figure horizontal" aria-label="드럼 레슨, 첫 만남의 순간을 담은 사진">
            <img src="/images/light/DSC02075.jpg" alt="드럼 레슨, 첫 만남의 순간을 담은 사진" loading="lazy" />
          </figure>
          <div className="p-4024">
            <header className="light-episode-slide-header">
              <span className="light-episode-number">No.01 / The Lesson</span>
              <h2 className="light-episode-title">A Chance Encounter</h2>
            </header>
            <div className="light-episode-copy">
              <p className="light-episode-body">오랜 시간 서로의 곁을 지키며</p>
              <p className="light-episode-body">함께한 날들을 차곡차곡 쌓아왔습니다.</p>
              <p className="light-episode-body">우리 두사람 평생 재미있게 잘 살겠습니다.</p>
              <p className="light-episode-body">기쁜 날 함께 모여 축하해주세요.</p>
            </div>
          </div>
        </div>

        {/* Page 3: Masonry Gallery */}
        <div className="light-story-page">
          {currentPage === 2 && (
            <Masonry items={masonryItems} onItemClick={setSelectedIndex} />
          )}
        </div>

      </div>

      {selectedIndex !== null && createPortal(
        <PhotoLightbox images={masonryImages} thumbnails={masonryThumbnails} initialIndex={selectedIndex} onClose={() => setSelectedIndex(null)} />,
        document.body
      )}

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
