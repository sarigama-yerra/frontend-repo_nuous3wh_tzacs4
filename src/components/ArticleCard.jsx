import { useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function ArticleCard({ article }) {
  const [expanded, setExpanded] = useState(false)
  const [full, setFull] = useState(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const toggle = async () => {
    if (expanded) {
      setExpanded(false)
      return
    }
    setExpanded(true)
    if (!full) {
      try {
        setLoading(true)
        setErr('')
        const res = await fetch(`${API_BASE}/api/articles/${article.id}`)
        if (!res.ok) throw new Error('Failed to load article')
        const data = await res.json()
        setFull(data)
      } catch (e) {
        setErr(e.message || 'Error loading')
      } finally {
        setLoading(false)
      }
    }
  }

  const display = full || article

  return (
    <article className="group bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500/40 transition">
      {display.image_url && (
        <div className="aspect-[16/9] overflow-hidden bg-slate-900">
          <img
            src={display.image_url}
            alt={display.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-300"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
            {display.category}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-slate-700/50 text-slate-300 border border-slate-600">
            {display.region}
          </span>
        </div>
        <h3 className="text-white font-semibold text-lg leading-tight mb-2">
          {display.title}
        </h3>
        {display.summary && !expanded && (
          <p className="text-slate-300 text-sm line-clamp-3 mb-3">{display.summary}</p>
        )}
        {expanded && (
          <div className="text-slate-300 text-sm space-y-3 mb-3">
            {loading ? (
              <div>Loading full article…</div>
            ) : err ? (
              <div className="text-red-300">{err}</div>
            ) : (
              <p style={{whiteSpace: 'pre-wrap'}}>{display.content || display.summary}</p>
            )}
          </div>
        )}
        {display.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {display.tags.map((t) => (
              <span key={t} className="text-[11px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                #{t}
              </span>
            ))}
          </div>
        )}
        <div className="mt-4 flex items-center gap-3">
          <a
            href={`/article/${article.id}`}
            className="text-blue-300 hover:text-white underline underline-offset-4 text-sm"
          >
            Open full page
          </a>
          <button
            onClick={toggle}
            className="text-sm px-3 py-1.5 rounded-md bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800"
          >
            {expanded ? 'Collapse' : 'Read inline'}
          </button>
        </div>
      </div>
    </article>
  )
}
