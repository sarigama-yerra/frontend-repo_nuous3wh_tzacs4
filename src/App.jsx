import { useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import ArticleCard from './components/ArticleCard'
import ProjectCard from './components/ProjectCard'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN || ''

// Updated regions and categories per your request
const REGIONS = [
  'North-Amerika',
  'Central-Amerika & Caraïben',
  'South-Amerika',
  'West-Europe',
  'North & Sandinavië',
  'South-Europe & the Balkans',
  'Russia & Eurasia',
  'Middle-East',
  'Northern-Afrika',
  'Sub-Saharan West- and Central-Afrika',
  'East-Afrika & Horn of Africa',
  'South-Asia',
  'East-Asia',
  'Southeast-Asia',
  'Oceania & Australasia'
]

const CATEGORIES = [
  'Ongoing',
  'Counted',
  'Conflict',
  'Economy',
  'campaign',
  'statement',
  'congress',
  'Elections',
  'Coalition',
  'budget',
]

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [articles, setArticles] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('')
  const [category, setCategory] = useState('')

  const qs = useMemo(() => {
    const p = new URLSearchParams()
    if (query) p.set('q', query)
    if (region) p.set('region', region)
    if (category) p.set('category', category)
    return p.toString()
  }, [query, region, category])

  const fetchAll = async () => {
    try {
      setLoading(true)
      setError('')
      const [aRes, pRes] = await Promise.all([
        fetch(`${API_BASE}/api/articles?${qs}`),
        fetch(`${API_BASE}/api/projects`),
      ])
      if (!aRes.ok) throw new Error('Failed to load articles')
      if (!pRes.ok) throw new Error('Failed to load projects')
      const [aData, pData] = await Promise.all([aRes.json(), pRes.json()])
      setArticles(aData)
      setProjects(pData)
    } catch (e) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qs])

  const ownerMode = Boolean(ADMIN_TOKEN)

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar onToggleSidebar={() => setSidebarOpen((s) => !s)} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters & Quick Add */}
        <section className="mb-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <input
                placeholder="Search headlines or content..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All regions</option>
                {REGIONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All categories</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                onClick={() => { setQuery(''); setRegion(''); setCategory('') }}
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
              >
                Reset
              </button>
            </div>
          </div>

          {ownerMode && <QuickAdd onAdded={fetchAll} />}
        </section>

        {/* Articles */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-xl">Latest Articles</h2>
            <span className="text-slate-400 text-sm">{articles.length} results</span>
          </div>
          {loading ? (
            <div className="text-slate-300">Loading...</div>
          ) : error ? (
            <div className="text-red-300">{error}</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </section>

        {/* Projects */}
        <section id="projects" className="mb-10">
          <h2 className="text-white font-semibold text-xl mb-4">Projects</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" className="mb-16 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-white font-semibold text-xl mb-2">About</h2>
          <p className="text-slate-300 text-sm">
            Independent coverage and analysis of politics around the world. Use the quick-add panel to easily publish new articles and showcase related projects.
          </p>
        </section>
      </main>
    </div>
  )
}

function QuickAdd({ onAdded }) {
  const [tab, setTab] = useState('article')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  // Article fields
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [region, setRegion] = useState('')
  const [tags, setTags] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  // Project fields
  const [projName, setProjName] = useState('')
  const [projDesc, setProjDesc] = useState('')
  const [projLink, setProjLink] = useState('')
  const [projTags, setProjTags] = useState('')

  const reset = () => {
    setTitle(''); setSummary(''); setContent(''); setCategory(''); setRegion(''); setTags(''); setImageUrl('')
    setProjName(''); setProjDesc(''); setProjLink(''); setProjTags('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setMsg('')
      if (tab === 'article') {
        const payload = {
          title, summary, content, category, region,
          tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
          image_url: imageUrl || undefined,
          published: true,
        }
        const res = await fetch(`${API_BASE}/api/articles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Admin-Token': ADMIN_TOKEN },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Failed to add article')
        setMsg('Article published!')
        reset()
        onAdded?.()
      } else {
        const payload = {
          name: projName,
          description: projDesc,
          link: projLink || undefined,
          tags: projTags ? projTags.split(',').map((t) => t.trim()).filter(Boolean) : [],
          status: 'active',
        }
        const res = await fetch(`${API_BASE}/api/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Admin-Token': ADMIN_TOKEN },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Failed to add project')
        setMsg('Project added!')
        reset()
        onAdded?.()
      }
    } catch (e) {
      setMsg(e.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center gap-4 mb-4">
        <button
          className={`px-3 py-1.5 rounded-md text-sm ${tab==='article' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-300 border border-slate-700'}`}
          onClick={() => setTab('article')}
        >
          Add Article
        </button>
        <button
          className={`px-3 py-1.5 rounded-md text-sm ${tab==='project' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-300 border border-slate-700'}`}
          onClick={() => setTab('project')}
        >
          Add Project
        </button>
        {msg && <span className="text-slate-300 text-sm">{msg}</span>}
      </div>

      {tab === 'article' ? (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
          <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <input value={summary} onChange={(e)=>setSummary(e.target.value)} placeholder="Summary" className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <textarea value={content} onChange={(e)=>setContent(e.target.value)} placeholder="Content" rows={4} className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <div className="grid sm:grid-cols-2 gap-3">
            <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required>
              <option value="" disabled>Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={region} onChange={(e)=>setRegion(e.target.value)} className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
              <option value="" disabled>Select region</option>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <input value={tags} onChange={(e)=>setTags(e.target.value)} placeholder="Tags (comma separated)" className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input value={imageUrl} onChange={(e)=>setImageUrl(e.target.value)} placeholder="Image URL (optional)" className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button disabled={saving} className="inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-sm font-medium disabled:opacity-50">
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
          <input value={projName} onChange={(e)=>setProjName(e.target.value)} placeholder="Project Name" className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <textarea value={projDesc} onChange={(e)=>setProjDesc(e.target.value)} placeholder="Description" rows={3} className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <input value={projLink} onChange={(e)=>setProjLink(e.target.value)} placeholder="Link (optional)" className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input value={projTags} onChange={(e)=>setProjTags(e.target.value)} placeholder="Tags (comma separated)" className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button disabled={saving} className="inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-sm font-medium disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Project'}
          </button>
        </form>
      )}

      <p className="mt-3 text-xs text-slate-400">Owner mode active</p>
    </div>
  )
}
