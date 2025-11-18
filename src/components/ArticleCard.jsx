export default function ArticleCard({ article }) {
  return (
    <article className="group bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500/40 transition">
      {article.image_url && (
        <div className="aspect-[16/9] overflow-hidden bg-slate-900">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-300"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
            {article.category}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-slate-700/50 text-slate-300 border border-slate-600">
            {article.region}
          </span>
        </div>
        <h3 className="text-white font-semibold text-lg leading-tight mb-2">
          {article.title}
        </h3>
        {article.summary && (
          <p className="text-slate-300 text-sm line-clamp-3 mb-3">{article.summary}</p>
        )}
        {article.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {article.tags.map((t) => (
              <span key={t} className="text-[11px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
