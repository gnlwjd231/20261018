import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import './PhotoLightbox.css'

interface PhotoLightboxProps {
  images: string[]
  thumbnails?: string[]
  initialIndex: number
  onClose: () => void
}

const SLOT_W = 88

function snapOffset(i: number, total: number, cw: number): number {
  const ca = (cw - SLOT_W) / 2
  return Math.max(ca - (total - 1) * SLOT_W, Math.min(ca, ca - i * SLOT_W))
}

export default function PhotoLightbox({ images, thumbnails, initialIndex, onClose }: PhotoLightboxProps) {
  const [index, setIndex] = useState(initialIndex)
  const [filmOffset, setFilmOffset] = useState<number>(0)
  const [dragging, setDragging] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const lastXRef = useRef(0)
  const offsetRef = useRef(0)

  const goNext = useCallback(() => {
    setIndex(i => {
      const next = Math.min(images.length - 1, i + 1)
      const cw = wrapRef.current?.clientWidth ?? 400
      setFilmOffset(snapOffset(next, images.length, cw))
      return next
    })
  }, [images.length])

  const goPrev = useCallback(() => {
    setIndex(i => {
      const next = Math.max(0, i - 1)
      const cw = wrapRef.current?.clientWidth ?? 400
      setFilmOffset(snapOffset(next, images.length, cw))
      return next
    })
  }, [images.length])

  const goTo = useCallback((i: number) => {
    const next = Math.max(0, Math.min(i, images.length - 1))
    const cw = wrapRef.current?.clientWidth ?? 400
    setIndex(next)
    setFilmOffset(snapOffset(next, images.length, cw))
  }, [images.length])

  useEffect(() => {
    const cw = wrapRef.current?.clientWidth ?? 400
    const off = snapOffset(index, images.length, cw)
    offsetRef.current = off
    setFilmOffset(off)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', h)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', h)
    }
  }, [onClose, goPrev, goNext])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (!(e.target instanceof HTMLElement)) return
    const el = e.currentTarget
    el.setPointerCapture(e.pointerId)
    lastXRef.current = e.clientX
    offsetRef.current = filmOffset
    setDragging(true)

    const onMove = (ev: Event) => {
      const e = ev as PointerEvent
      const dx = e.clientX - lastXRef.current
      lastXRef.current = e.clientX
      const cw = wrapRef.current?.clientWidth ?? 400
      const ca = (cw - SLOT_W) / 2
      const minOff = ca - (images.length - 1) * SLOT_W
      offsetRef.current = Math.max(minOff, Math.min(ca, offsetRef.current + dx))
      setFilmOffset(offsetRef.current)
      const raw = (ca - offsetRef.current) / SLOT_W
      setIndex(Math.max(0, Math.min(Math.round(raw), images.length - 1)))
    }

    const onUp = () => {
      el.removeEventListener('pointermove', onMove as EventListener)
      el.removeEventListener('pointerup', onUp as EventListener)
      setDragging(false)
      const cw = wrapRef.current?.clientWidth ?? 400
      const ca = (cw - SLOT_W) / 2
      const raw = (ca - offsetRef.current) / SLOT_W
      const si = Math.max(0, Math.min(Math.round(raw), images.length - 1))
      const off = snapOffset(si, images.length, cw)
      offsetRef.current = off
      setFilmOffset(off)
      setIndex(si)
    }

    el.addEventListener('pointermove', onMove as EventListener)
    el.addEventListener('pointerup', onUp as EventListener)
  }, [filmOffset, images.length])

  return (
    <div className="lightbox-overlay" onClick={() => onClose()}>
      <button className="lightbox-close" onClick={() => onClose()} aria-label="닫기">
        <X size={24} />
      </button>

      <div className="lightbox-main" onClick={e => e.stopPropagation()}>
        <img src={images[index]} alt="" className="lightbox-main-image" />
      </div>

      {!dragging && index > 0 && (
        <button className="lightbox-nav lightbox-nav--prev" onClick={e => { e.stopPropagation(); goPrev() }} aria-label="이전">
          <ChevronLeft size={28} />
        </button>
      )}
      {!dragging && index < images.length - 1 && (
        <button className="lightbox-nav lightbox-nav--next" onClick={e => { e.stopPropagation(); goNext() }} aria-label="다음">
          <ChevronRight size={28} />
        </button>
      )}

      <div className="lightbox-counter">
        {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
      </div>

      <div ref={wrapRef} className="filmstrip-wrap" onClick={e => e.stopPropagation()}>
        <div
          className="filmstrip-track"
          onPointerDown={onPointerDown}
          style={{
            transform: `translateX(${filmOffset}px)`,
            transition: dragging ? 'none' : undefined,
          }}
        >
          {images.map((img, i) => (
            <div
              key={i}
              className={`filmstrip-thumb${i === index ? ' filmstrip-thumb--active' : ''}`}
              onClick={e => { e.stopPropagation(); goTo(i) }}
            >
              <img src={thumbnails?.[i] ?? img} alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
