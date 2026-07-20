import { useCallback, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import lightPhoto from '@/assets/images/light/favorite.jpg'
import BlurText from '@/components/BlurText'
import Masonry from '@/components/Masonry'
import PhotoLightbox from '@/components/PhotoLightbox'

const weddingDate = '2026.10.18 SUN 11:00'

const TOTAL_PAGES = 3

const optPath = (p: string) => p.replace(/\.jpg$/, '.webp').replace(/\/(light|dark)\//, '/$1/opt/')
const thumbPath = (p: string) => p.replace(/\.jpg$/, '.webp').replace(/\/(light|dark)\//, '/$1/thumb/')

const masonryItems = [
  { id: 'm1', img: '/src/assets/images/dark/DSC03633_(3).jpg', height: 320 },
  { id: 'm2', img: '/src/assets/images/light/DSC02075.jpg', height: 280 },
  { id: 'm3', img: '/src/assets/images/light/DSC01886.jpg', height: 420 },
  { id: 'm4', img: '/src/assets/images/dark/DSC03561.jpg', height: 260 },
  { id: 'm5', img: '/src/assets/images/light/DSC02774.jpg', height: 380 },
  { id: 'm6', img: '/src/assets/images/light/DSC02427.jpg', height: 300 },
  { id: 'm7', img: '/src/assets/images/dark/DSC03410.jpg', height: 440 },
  { id: 'm8', img: '/src/assets/images/light/DSC02529.jpg', height: 240 },
  { id: 'm9', img: '/src/assets/images/light/DSC01766.jpg', height: 360 },
  { id: 'm10', img: '/src/assets/images/dark/DSC03992.jpg', height: 280 },
  { id: 'm11', img: '/src/assets/images/light/DSC02069.jpg', height: 400 },
  { id: 'm12', img: '/src/assets/images/light/DSC01640.jpg', height: 260 },
  { id: 'm13', img: '/src/assets/images/dark/DSC03698.jpg', height: 340 },
  { id: 'm14', img: '/src/assets/images/light/DSC01722.jpg', height: 460 },
  { id: 'm15', img: '/src/assets/images/light/DSC01937.jpg', height: 300 },
  { id: 'm16', img: '/src/assets/images/dark/DSC03775-2.jpg', height: 380 },
  { id: 'm17', img: '/src/assets/images/light/DSC02481.jpg', height: 240 },
  { id: 'm18', img: '/src/assets/images/light/DSC02942.jpg', height: 420 },
  { id: 'm19', img: '/src/assets/images/dark/DSC03496.jpg', height: 320 },
  { id: 'm20', img: '/src/assets/images/light/DSC02023.jpg', height: 280 },
  { id: 'm21', img: '/src/assets/images/light/DSC01974.jpg', height: 360 },
  { id: 'm22', img: '/src/assets/images/dark/DSC03845-2.jpg', height: 440 },
  { id: 'm23', img: '/src/assets/images/light/DSC02527.jpg', height: 300 },
  { id: 'm24', img: '/src/assets/images/light/DSC01877.jpg', height: 260 },
  { id: 'm25', img: '/src/assets/images/dark/DSC03263.jpg', height: 380 },
  { id: 'm26', img: '/src/assets/images/light/DSC02071.jpg', height: 400 },
  { id: 'm27', img: '/src/assets/images/dark/DSC03620.jpg', height: 240 },
  { id: 'm28', img: '/src/assets/images/dark/DSC03275.jpg', height: 340 },
].map(i => ({ ...i, img: optPath(i.img) }))

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
            <img src="/src/assets/images/light/DSC02075.jpg" alt="드럼 레슨, 첫 만남의 순간을 담은 사진" loading="lazy" />
          </figure>
          <div className="p-4024">
            <header className="light-episode-slide-header">
              <span className="light-episode-number">No.01 / The Lesson</span>
              <h2 className="light-episode-title">A Chance Encounter</h2>
            </header>
            <div className="light-episode-copy">
              <p className="light-episode-body">오랜 시간 서로의 곁을 지키며</p>
              <p className="light-episode-body">함께한 날들을 차곡차곡 쌓아왔습니다.</p>
              <p className="light-episode-body">이제 저희 두 사람, 부부로서 새로운 길을 함께 걸어가려 합니다.</p>
            </div>
          </div>
        </div>

        {/* Page 3: Masonry Gallery */}
        <div className="light-story-page">
          {currentPage === 2 && (
            <Masonry items={masonryItems} onItemClick={setSelectedIndex} animateFrom="bottom" stagger={0.03} scaleOnHover={false} blurToFocus={false} />
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
