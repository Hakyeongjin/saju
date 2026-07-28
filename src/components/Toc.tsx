export interface TocItem {
  id: string
  label: string
}

export default function Toc({ items }: { items: TocItem[] }) {
  return (
    <nav className="toc">
      <span className="toc-title">목차</span>
      <div className="toc-links">
        {items.map((it) => (
          <a key={it.id} href={`#${it.id}`} className="toc-link">
            {it.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
