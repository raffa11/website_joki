import { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, Settings, LogOut, Home } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-dark">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 bg-darker hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold font-poppins text-white">Boost<span className="text-neon">Track</span></span>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-white transition-colors">
            <Home size={20} />
            Home
          </Link>
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-neon/10 text-neon font-medium transition-colors">
            <LayoutDashboard size={20} />
            Overview
          </Link>
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-white transition-colors mb-2">
            <Settings size={20} />
            Settings
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 flex items-center justify-between px-4 border-b border-gray-800 md:hidden bg-darker">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold font-poppins text-white">Boost<span className="text-neon">Track</span></span>
          </Link>
          <button className="p-2 rounded-md bg-gray-800 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
