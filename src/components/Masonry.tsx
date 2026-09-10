import './Masonry.css'

interface MasonryItem {
  id: string
  img: string
}

interface MasonryProps {
  items: MasonryItem[]
  onItemClick?: (index: number) => void
}

export default function Masonry({ items, onItemClick }: MasonryProps) {
  return (
    <div className="masonry-cols">
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          className="masonry-cell"
          style={{ animationDelay: `${Math.min(index, 12) * 0.04}s` }}
          onClick={() => onItemClick?.(index)}
          aria-label={`사진 ${index + 1} 크게 보기`}
        >
          <img src={item.img} alt="" loading="lazy" decoding="async" />
        </button>
      ))}
    </div>
  )
}
