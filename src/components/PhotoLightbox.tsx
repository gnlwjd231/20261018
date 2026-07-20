import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import './PhotoLightbox.css'

interface PhotoLightboxProps {
  images: string[]
  initialIndex: number
  onClose: () => void
}

export default function PhotoLightbox({ images, initialIndex, onClose }: PhotoLightboxProps) {
  const [index, setIndex] = useState(initialIndex)
  const [dragOffset, setDragOffset] = useState(0)
  const draggingRef = useRef(false)
  const startX = useRef(0)

  const goTo = useCallback((i: number) => {
    setIndex(Math.max(0, Math.min(i, images.length - 1)))
    setDragOffset(0)
  }, [images.length])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goTo(index - 1)
      if (e.key === 'ArrowRight') goTo(index + 1)
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose, index, goTo])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    draggingRef.current = true
    startX.current = e.clientX
    const el = e.currentTarget as HTMLElement
    el.setPointerCapture(e.pointerId)
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current) return
    const el = e.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    const deltaPx = e.clientX - startX.current
    setDragOffset((deltaPx / rect.width) * 100)
  }, [])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current) return
    draggingRef.current = false

    const el = e.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    const deltaPx = e.clientX - startX.current
    const deltaPercent = (deltaPx / rect.width) * 100

    const totalOffset = -(index * 100) + deltaPercent
    const snapped = Math.round(-totalOffset / 100)
    goTo(snapped)
  }, [index, goTo])

  const offset = -(index * 100) + dragOffset
  const isDragging = dragOffset !== 0

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="닫기">
        <X size={24} />
      </button>

      {!isDragging && index > 0 && (
        <button className="lightbox-nav lightbox-nav--prev" onClick={e => { e.stopPropagation(); goTo(index - 1) }} aria-label="이전">
          <ChevronLeft size={28} />
        </button>
      )}
      {!isDragging && index < images.length - 1 && (
        <button className="lightbox-nav lightbox-nav--next" onClick={e => { e.stopPropagation(); goTo(index + 1) }} aria-label="다음">
          <ChevronRight size={28} />
        </button>
      )}

      <div className="lightbox-counter">{String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</div>

      <div
        className="lightbox-track-wrap"
        onClick={e => e.stopPropagation()}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div
          className="lightbox-track"
          style={{
            transform: `translateX(${offset}%)`,
            transition: isDragging ? 'none' : undefined,
          }}
        >
          {images.map((img, i) => (
            <div key={i} className="lightbox-slide">
              <img src={img} alt="" className="lightbox-image" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
