import React, { useState } from 'react';
import { Database, X, ExternalLink, Check, Copy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SupabaseGuideModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { supabaseConnected } = useAuth();

  const handleCopyEnv = () => {
    const text = `SUPABASE_URL=https://your-project-id.supabase.co\nSUPABASE_ANON_KEY=your-actual-anon-key-here`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Status Pill */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 bg-white/90 backdrop-blur border border-zinc-200 px-3.5 py-1.5 rounded-full shadow-md hover:shadow-lg transition text-xs font-medium text-zinc-700 cursor-pointer"
        >
          <Database className={`w-3.5 h-3.5 ${supabaseConnected ? 'text-emerald-500' : 'text-amber-500'}`} />
          <span>{supabaseConnected ? 'Supabase: Connected' : 'Supabase: Dev Fallback'}</span>
          <span className={`w-2 h-2 rounded-full ${supabaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
        </button>
      </div>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-zinc-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 bg-emerald-50 rounded-xl">
                <Database className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900">Supabase Database Integration</h3>
                <p className="text-xs text-zinc-500">How this Instagram Auth system interacts with Supabase</p>
              </div>
            </div>

            {supabaseConnected ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 mb-4">
                🎉 <strong>Great news!</strong> The backend is successfully connected to your live Supabase PostgreSQL database. All signups and logins are saved in the <code>public.users</code> table.
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 mb-4">
                💡 <strong>Currently running in Dev Mode:</strong> You can test signup and login immediately! To connect your real Supabase cloud database, follow the 3 quick steps below.
              </div>
            )}

            <div className="space-y-4 text-xs text-zinc-600">
              <div className="border border-zinc-100 rounded-xl p-3 bg-zinc-50/50">
                <h4 className="font-semibold text-zinc-800 text-sm mb-1 flex items-center">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[10px] mr-2">1</span>
                  Create a Supabase Project
                </h4>
                <p className="mb-2">Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-600 font-semibold inline-flex items-center">supabase.com <ExternalLink className="w-3 h-3 ml-0.5" /></a> and create a new free project.</p>
              </div>

              <div className="border border-zinc-100 rounded-xl p-3 bg-zinc-50/50">
                <h4 className="font-semibold text-zinc-800 text-sm mb-1 flex items-center">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[10px] mr-2">2</span>
                  Run Database Schema in Supabase
                </h4>
                <p className="mb-2">
                  Open your Supabase <strong>SQL Editor</strong>, open the ready script <code className="bg-zinc-200 px-1 py-0.5 rounded text-zinc-800">backend/supabase-schema.sql</code>, and click <strong>RUN</strong>. This creates the <code className="bg-zinc-200 px-1 py-0.5 rounded text-zinc-800">users</code> table with RLS security policies.
                </p>
              </div>

              <div className="border border-zinc-100 rounded-xl p-3 bg-zinc-50/50">
                <h4 className="font-semibold text-zinc-800 text-sm mb-1 flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="w-5 h-5 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[10px] mr-2">3</span>
                    Update backend/.env
                  </span>
                  <button
                    onClick={handleCopyEnv}
                    className="text-emerald-600 flex items-center space-x-1 hover:underline text-[11px]"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy env format'}</span>
                  </button>
                </h4>
                <p className="mb-1">Find your Project URL and Anon API key in <strong>Project Settings → API</strong>.</p>
                <div className="bg-zinc-900 text-zinc-200 p-2.5 rounded font-mono text-[11px] overflow-x-auto">
                  SUPABASE_URL=https://your-id.supabase.co<br />
                  SUPABASE_ANON_KEY=eyJhbGciOi...
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 bg-zinc-900 text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 transition"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
