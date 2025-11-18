import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function ArticlePage() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_BASE}/api/articles/${id}`)
        if (!res.ok) throw new Error('Article not found')
        const data = await res.json()
        setArticle(data)
      } catch (e) {
        setError(e.message || 'Error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="text-slate-300 hover:text-white">← Back</Link>
        </div>
        {loading ? (
          <div className="text-slate-300">Loading...</div>
        ) : error ? (
          <div className="text-red-300">{error}</div>
        ) : article ? (
          <article>
            <h1 className="text-white font-bold text-3xl mb-2">{article.title}</h1>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">{article.category}</span>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-700/50 text-slate-300 border border-slate-600">{article.region}</span>
              {article.published_at && (
                <span className="text-xs text-slate-400">{new Date(article.published_at).toLocaleString()}</span>
              )}
            </div>
            {article.image_url && (
              <img src={article.image_url} alt="" className="w-full rounded-lg border border-slate-800 mb-6" />
            )}
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-slate-200 leading-relaxed">{article.content || article.summary}</p>
            </div>
            {article.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {article.tags.map(t => (
                  <span key={t} className="text-[11px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">#{t}</span>
                ))}
              </div>
            )}
            <div className="mt-8 flex items-center gap-3">
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`}
                target="_blank" rel="noreferrer"
                className="text-sm px-3 py-1.5 rounded-md bg-sky-600/20 border border-sky-600/40 text-sky-300 hover:bg-sky-600/30"
              >Share on X</a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank" rel="noreferrer"
                className="text-sm px-3 py-1.5 rounded-md bg-blue-600/20 border border-blue-600/40 text-blue-300 hover:bg-blue-600/30"
              >Share on Facebook</a>
              <button
                onClick={() => navigator.clipboard.writeText(shareUrl)}
                className="text-sm px-3 py-1.5 rounded-md bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700"
              >Copy link</button>
            </div>
          </article>
        ) : null}
      </div>
    </div>
  )
}
