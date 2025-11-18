import { Menu } from 'lucide-react'

export default function Navbar({ onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-slate-900/70 bg-slate-900/60 border-b border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-300 hover:text-white hover:bg-slate-700/40 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:hidden"
            aria-label="Toggle navigation"
            onClick={onToggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <img src="/flame-icon.svg" alt="Logo" className="h-7 w-7" />
            <span className="text-white font-semibold tracking-tight">World Politics News</span>
          </div>
        </div>

        <nav className="hidden sm:flex items-center gap-6 text-slate-300">
          <a href="#" className="hover:text-white transition">Home</a>
          <a href="#projects" className="hover:text-white transition">Projects</a>
          <a href="#about" className="hover:text-white transition">About</a>
        </nav>
      </div>
    </header>
  )
}
