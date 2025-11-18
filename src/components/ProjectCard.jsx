export default function ProjectCard({ project }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-blue-500/40 transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-white font-semibold text-lg mb-1">{project.name}</h4>
          <p className="text-slate-300 text-sm mb-2">{project.description}</p>
          {project.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {project.tags.map((t) => (
                <span key={t} className="text-[11px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">#{t}</span>
              ))}
            </div>
          )}
        </div>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-300 hover:text-white underline-offset-4 hover:underline"
          >
            Visit
          </a>
        )}
      </div>
    </div>
  )
}
