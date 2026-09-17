import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, Bookmark, Compass, Search, User } from 'lucide-react';

const mockScreens = [
  {
    id: 1,
    title: 'Feed',
    img: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&w=600&q=80',
    username: 'traveler_adventures',
    likes: '14,320',
    caption: 'Sunset over the Amalfi coast 🌅✈️',
  },
  {
    id: 2,
    title: 'Explore',
    img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    username: 'sophia.lens',
    likes: '8,941',
    caption: 'Golden hour portraits in Paris ✨',
  },
  {
    id: 3,
    title: 'Reels',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    username: 'wanderlust_vibes',
    likes: '22,109',
    caption: 'Tropical escape vibes 🌴🌊',
  },
  {
    id: 4,
    title: 'Architecture',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    username: 'urban_perspective',
    likes: '5,812',
    caption: 'Lines, light, and modern structures 🏙️',
  },
];

export default function PhoneMockup() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockScreens.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const currentScreen = mockScreens[currentIndex];

  return (
    <div className="hidden lg:block relative mr-8 select-none">
      {/* Outer Phone Hardware Mockup */}
      <div className="relative w-[380px] h-[580px] bg-white rounded-[44px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-[10px] border-[#1f1f1f] overflow-hidden">
        {/* Top Speaker / Dynamic Island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#1f1f1f] rounded-full z-30 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-[#111] mr-3"></div>
          <div className="w-8 h-1 rounded-full bg-[#2a2a2a]"></div>
        </div>

        {/* Screen Content */}
        <div className="relative w-full h-full bg-black text-white flex flex-col pt-7">
          {/* Mock In-App Header */}
          <div className="px-4 py-2 flex items-center justify-between border-b border-zinc-800 text-xs">
            <span className="font-instagram text-lg tracking-wider bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 bg-clip-text text-transparent">
              Instagram
            </span>
            <div className="flex items-center space-x-3 text-zinc-300">
              <Heart className="w-4 h-4" />
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>

          {/* Stories Tray */}
          <div className="flex items-center gap-3 px-3 py-2 border-b border-zinc-900 overflow-hidden">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex flex-col items-center">
                <div className="w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600">
                  <div className="w-full h-full rounded-full border-2 border-black overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/photo-${1500000000000 + s * 100000}?auto=format&fit=crop&w=100&q=80`}
                      alt="story"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Changing Feed Post (Crossfade) */}
          <div className="relative flex-1 bg-zinc-950 overflow-hidden flex flex-col">
            <div className="flex items-center px-3 py-2 space-x-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-pink-600 p-[1px]">
                <div className="w-full h-full rounded-full bg-black overflow-hidden">
                  <img src={currentScreen.img} alt="author" className="w-full h-full object-cover" />
                </div>
              </div>
              <span className="text-[11px] font-semibold text-zinc-100">{currentScreen.username}</span>
            </div>

            {/* Post Image with smooth transition */}
            <div className="relative flex-1 overflow-hidden bg-zinc-900">
              <img
                key={currentScreen.id}
                src={currentScreen.img}
                alt="Feed slide"
                className="w-full h-full object-cover fade-in-slide transition-opacity duration-700"
              />
            </div>

            {/* Post Actions & Caption */}
            <div className="p-3 text-[11px] space-y-1.5 bg-black/90">
              <div className="flex items-center justify-between text-zinc-200">
                <div className="flex items-center space-x-3">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <MessageCircle className="w-4 h-4" />
                  <Send className="w-4 h-4" />
                </div>
                <Bookmark className="w-4 h-4" />
              </div>
              <p className="font-semibold text-zinc-100 text-[11px]">{currentScreen.likes} likes</p>
              <p className="text-zinc-300 line-clamp-1 text-[11px]">
                <span className="font-semibold text-white mr-1.5">{currentScreen.username}</span>
                {currentScreen.caption}
              </p>
            </div>
          </div>

          {/* Bottom App Navigation Bar */}
          <div className="h-10 bg-black border-t border-zinc-900 flex items-center justify-around text-zinc-400 px-4">
            <Search className="w-4 h-4 text-white" />
            <Compass className="w-4 h-4" />
            <Heart className="w-4 h-4" />
            <User className="w-4 h-4" />
          </div>

          {/* Home indicator bar */}
          <div className="pb-1.5 flex justify-center bg-black">
            <div className="w-24 h-1 bg-zinc-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
