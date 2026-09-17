import React from 'react';
import SupabaseGuideModal from './SupabaseGuideModal';

const footerLinks = [
  'Meta',
  'About',
  'Blog',
  'Jobs',
  'Help',
  'API',
  'Privacy',
  'Terms',
  'Locations',
  'Instagram Lite',
  'Threads',
  'Contact Uploading & Non-Users',
  'Meta Verified',
];

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-ig-bg flex flex-col justify-between items-center text-ig-primary-text">
      {/* Central Content Area */}
      <main className="w-full flex-1 flex items-center justify-center pt-8 sm:pt-12 pb-10 px-4">
        <div className="flex flex-col items-center justify-center w-full max-w-[350px]">
          {children}
        </div>
      </main>

      {/* Instagram Classic Global Footer */}
      <footer className="w-full py-6 px-4 flex flex-col items-center justify-center text-xs text-ig-secondary-text space-y-4">
        {/* Navigation links */}
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 max-w-4xl text-center">
          {footerLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={(e) => e.preventDefault()}
              className="hover:underline text-[12px] text-ig-secondary-text"
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Language & Copyright */}
        <div className="flex items-center space-x-4 text-[12px]">
          <select
            defaultValue="en"
            aria-label="Switch Display Language"
            className="bg-transparent border-none text-ig-secondary-text text-xs cursor-pointer focus:outline-none"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="hi">हिन्दी</option>
            <option value="ja">日本語</option>
          </select>
          <span>© 2026 Instagram from Meta</span>
        </div>
      </footer>

      {/* Supabase connection guide pill */}
      <SupabaseGuideModal />
    </div>
  );
}
