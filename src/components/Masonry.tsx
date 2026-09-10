import './Masonry.css'

interface MasonryItem {
  id: string
  img: string
  ar: number
}

interface MasonryProps {
  items: MasonryItem[]
  onItemClick?: (index: number) => void
}

// ponytail: LPT 분배 — 높은 사진부터 짧은 컬럼에 채워 두 컬럼 높이를 맞춤
function splitBalanced<T extends { ar: number }>(items: T[]): [T[], T[]] {
  const order = [...items].sort((a, b) => a.ar - b.ar)
  const cols: [T[], T[]] = [[], []]
  const sums = [0, 0]
  for (const item of order) {
    const c = sums[0] <= sums[1] ? 0 : 1
    cols[c].push(item)
    sums[c] += 1 / item.ar
  }
  const rank = new Map(items.map((item, i) => [item, i]))
  cols.forEach((col) => col.sort((a, b) => rank.get(a)! - rank.get(b)!))
  return cols
}

export default function Masonry({ items, onItemClick }: MasonryProps) {
  const indexed = items.map((item, index) => ({ ...item, flat: index }))
  const cols = splitBalanced(indexed)

  return (
    <div className="masonry-flex">
      {cols.map((col, ci) => (
        <div key={ci} className="masonry-flex-col">
          {col.map((cell) => (
            <button
              key={cell.id}
              type="button"
              className="masonry-cell"
              style={{ animationDelay: `${Math.min(cell.flat, 12) * 0.04}s`, aspectRatio: `${cell.ar}` }}
              onClick={() => onItemClick?.(cell.flat)}
              aria-label={`사진 ${cell.flat + 1} 크게 보기`}
            >
              <img src={cell.img} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
