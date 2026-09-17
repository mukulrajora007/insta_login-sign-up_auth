import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Smile, ShieldCheck, Database } from 'lucide-react';
import Navbar from './Navbar';
import SupabaseGuideModal from './SupabaseGuideModal';

const sampleStories = [
  { id: 1, name: 'alex.design', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
  { id: 2, name: 'natgeo_wild', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { id: 3, name: 'tech_insider', img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80' },
  { id: 4, name: 'foodie_delight', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80' },
  { id: 5, name: 'wanderer_jay', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80' },
  { id: 6, name: 'vogue_style', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80' },
];

export default function Feed() {
  const { user, supabaseConnected } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(1482);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    { id: 1, username: 'sarah_m', text: 'This looks unbelievable! 🔥' },
    { id: 2, username: 'photo_nomad', text: 'Colors and composition are top notch.' },
  ]);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        username: user?.username || 'you',
        text: commentText.trim(),
      },
    ]);
    setCommentText('');
  };

  return (
    <div className="min-h-screen bg-ig-bg text-ig-primary-text flex">
      {/* Desktop Sidebar & Mobile Navs */}
      <Navbar />

      {/* Main Feed Container */}
      <main className="flex-1 md:ml-60 pt-16 md:pt-8 pb-16 px-3 sm:px-6 flex justify-center">
        <div className="max-w-[630px] w-full space-y-4">
          {/* Welcome & Database Status Banner */}
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-100 rounded-xl p-4 shadow-sm flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h2 className="font-semibold text-zinc-900 text-sm">
                  Welcome to Instagram, {user?.full_name || user?.username}!
                </h2>
              </div>
              <p className="text-xs text-zinc-600">
                You are successfully authenticated. User ID:{' '}
                <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-[11px] text-zinc-700">
                  {user?.id?.slice(0, 13)}...
                </code>
              </p>
              <div className="flex items-center space-x-3 pt-1 text-[11px]">
                <span className="text-zinc-500">
                  Email: <strong className="text-zinc-800">{user?.email}</strong>
                </span>
                <span className="text-zinc-400">•</span>
                <span className="flex items-center space-x-1 text-emerald-700 font-medium">
                  <Database className="w-3.5 h-3.5" />
                  <span>{supabaseConnected ? 'Supabase PostgreSQL' : 'Dev Database Mode'}</span>
                </span>
              </div>
            </div>

            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt="Avatar"
              className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-400 shadow-sm shrink-0 ml-3"
            />
          </div>

          {/* Stories Bar */}
          <div className="bg-white border border-ig-border rounded-xl py-3 px-4 flex items-center space-x-4 overflow-x-auto scrollbar-none">
            {/* Active User Story */}
            <div className="flex flex-col items-center space-y-1 shrink-0 cursor-pointer">
              <div className="relative">
                <div className="w-14 h-14 rounded-full p-[2px] bg-zinc-200">
                  <img
                    src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt="Your Story"
                    className="w-full h-full rounded-full object-cover border-2 border-white"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-ig-blue text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
                  +
                </div>
              </div>
              <span className="text-[11px] text-zinc-500 truncate w-14 text-center">Your story</span>
            </div>

            {/* Other Stories */}
            {sampleStories.map((story) => (
              <div key={story.id} className="flex flex-col items-center space-y-1 shrink-0 cursor-pointer">
                <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600">
                  <img
                    src={story.img}
                    alt={story.name}
                    className="w-full h-full rounded-full object-cover border-2 border-white"
                  />
                </div>
                <span className="text-[11px] text-zinc-700 truncate w-14 text-center">{story.name}</span>
              </div>
            ))}
          </div>

          {/* Sample Interactive Post */}
          <article className="bg-white border border-ig-border rounded-xl overflow-hidden shadow-sm">
            {/* Post Header */}
            <div className="flex items-center justify-between px-3 py-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 to-pink-600">
                  <img
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"
                    alt="Author"
                    className="w-full h-full rounded-full object-cover border border-white"
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold text-xs text-zinc-900">explore_california</span>
                    <span className="text-zinc-400 text-xs">• 3h</span>
                  </div>
                  <span className="text-[11px] text-zinc-500 block">Big Sur, California</span>
                </div>
              </div>
              <button className="text-zinc-500 hover:text-zinc-800">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Post Image */}
            <div className="relative bg-black w-full aspect-square overflow-hidden select-none">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80"
                alt="Post content"
                className="w-full h-full object-cover cursor-pointer"
                onDoubleClick={handleLike}
              />
            </div>

            {/* Post Action Buttons */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLike}
                    className="focus:outline-none transform active:scale-125 transition duration-150"
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        liked ? 'text-rose-600 fill-rose-600 animate-bounce' : 'text-zinc-800 hover:text-zinc-500'
                      }`}
                    />
                  </button>
                  <button className="text-zinc-800 hover:text-zinc-500">
                    <MessageCircle className="w-6 h-6" />
                  </button>
                  <button className="text-zinc-800 hover:text-zinc-500">
                    <Send className="w-6 h-6" />
                  </button>
                </div>
                <button onClick={() => setBookmarked(!bookmarked)} className="text-zinc-800">
                  <Bookmark className={`w-6 h-6 ${bookmarked ? 'fill-zinc-900' : ''}`} />
                </button>
              </div>

              {/* Likes */}
              <div className="text-xs font-semibold text-zinc-900 mb-1">
                {likesCount.toLocaleString()} likes
              </div>

              {/* Caption */}
              <div className="text-xs text-zinc-800 mb-2 leading-relaxed">
                <span className="font-semibold mr-1.5">explore_california</span>
                Pacific coast highway road trip views. There is truly nothing quite like this coastal breeze! 🌊✨
                <span className="text-ig-link cursor-pointer ml-1">#california #wanderlust</span>
              </div>

              {/* Comments Section */}
              <div className="space-y-1 my-2">
                {comments.map((c) => (
                  <div key={c.id} className="text-xs text-zinc-800">
                    <span className="font-semibold mr-1.5">{c.username}</span>
                    <span>{c.text}</span>
                  </div>
                ))}
              </div>

              <div className="text-[10px] uppercase text-zinc-400 tracking-wide mt-2">
                3 hours ago
              </div>
            </div>

            {/* Add Comment Input Bar */}
            <form onSubmit={handleAddComment} className="border-t border-ig-border px-3 py-2.5 flex items-center">
              <Smile className="w-5 h-5 text-zinc-500 mr-2 shrink-0 cursor-pointer hover:text-zinc-800" />
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full text-xs bg-transparent border-none outline-none text-zinc-800 placeholder-zinc-400"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className={`text-xs font-semibold ml-2 transition ${
                  commentText.trim() ? 'text-ig-blue hover:text-ig-blue-hover cursor-pointer' : 'text-ig-blue-disabled cursor-default'
                }`}
              >
                Post
              </button>
            </form>
          </article>
        </div>
      </main>

      {/* Supabase status modal helper */}
      <SupabaseGuideModal />
    </div>
  );
}
