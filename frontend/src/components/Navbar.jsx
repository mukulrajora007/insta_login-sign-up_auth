import React from 'react';
import { Home, Search, Compass, Film, MessageCircle, Heart, PlusSquare, LogOut, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, supabaseConnected } = useAuth();

  return (
    <>
      {/* Desktop Sidebar Navigation (md and up) */}
      <aside className="hidden md:flex flex-col justify-between w-60 h-screen fixed left-0 top-0 border-r border-ig-border bg-white px-3 py-6 z-40">
        <div>
          {/* Brand Logo */}
          <div className="px-3 mb-8">
            <h1 className="font-instagram text-3xl text-zinc-900 select-none">
              Instagram
            </h1>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            <button className="w-full flex items-center space-x-4 px-3 py-3 rounded-lg hover:bg-zinc-100 font-semibold text-sm transition">
              <Home className="w-6 h-6 stroke-[2.5]" />
              <span>Home</span>
            </button>
            <button className="w-full flex items-center space-x-4 px-3 py-3 rounded-lg hover:bg-zinc-100 text-sm transition">
              <Search className="w-6 h-6" />
              <span>Search</span>
            </button>
            <button className="w-full flex items-center space-x-4 px-3 py-3 rounded-lg hover:bg-zinc-100 text-sm transition">
              <Compass className="w-6 h-6" />
              <span>Explore</span>
            </button>
            <button className="w-full flex items-center space-x-4 px-3 py-3 rounded-lg hover:bg-zinc-100 text-sm transition">
              <Film className="w-6 h-6" />
              <span>Reels</span>
            </button>
            <button className="w-full flex items-center space-x-4 px-3 py-3 rounded-lg hover:bg-zinc-100 text-sm transition">
              <MessageCircle className="w-6 h-6" />
              <span>Messages</span>
            </button>
            <button className="w-full flex items-center space-x-4 px-3 py-3 rounded-lg hover:bg-zinc-100 text-sm transition">
              <Heart className="w-6 h-6" />
              <span>Notifications</span>
            </button>
            <button className="w-full flex items-center space-x-4 px-3 py-3 rounded-lg hover:bg-zinc-100 text-sm transition">
              <PlusSquare className="w-6 h-6" />
              <span>Create</span>
            </button>

            {/* Profile */}
            <div className="w-full flex items-center space-x-4 px-3 py-3 rounded-lg hover:bg-zinc-100 text-sm transition cursor-pointer">
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt="Profile"
                className="w-6 h-6 rounded-full object-cover ring-2 ring-zinc-300"
              />
              <span className="font-semibold truncate max-w-[120px]">{user?.username || 'Profile'}</span>
            </div>
          </nav>
        </div>

        {/* Bottom Sidebar: Supabase status & Logout */}
        <div className="space-y-3 pt-4 border-t border-ig-border px-1">
          <div className="flex items-center space-x-2 px-2 text-[11px] text-zinc-500">
            <Database className={`w-3.5 h-3.5 ${supabaseConnected ? 'text-emerald-500' : 'text-amber-500'}`} />
            <span className="truncate">{supabaseConnected ? 'Supabase Live' : 'Dev Mode Store'}</span>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-rose-600 hover:bg-rose-50 text-sm font-medium transition cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header (below md) */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-ig-border px-4 flex items-center justify-between z-40">
        <h1 className="font-instagram text-2xl text-zinc-900 select-none">
          Instagram
        </h1>
        <div className="flex items-center space-x-4 text-zinc-800">
          <Heart className="w-5 h-5" />
          <MessageCircle className="w-5 h-5" />
          <button onClick={logout} title="Log out" className="text-rose-600">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (below md) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-12 bg-white border-t border-ig-border flex items-center justify-around z-40 text-zinc-800">
        <Home className="w-6 h-6 stroke-[2.5]" />
        <Search className="w-6 h-6" />
        <PlusSquare className="w-6 h-6" />
        <Film className="w-6 h-6" />
        <img
          src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
          alt="Profile"
          className="w-6 h-6 rounded-full object-cover ring-1 ring-zinc-300"
        />
      </nav>
    </>
  );
}
