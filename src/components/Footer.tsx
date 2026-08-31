import React from 'react';
import { Terminal, Code2, Database, Shield, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#B0FF00]/20 bg-black py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Club Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#0d0d0d] border border-[#B0FF00]/40 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-[#B0FF00]" />
              </div>
              <span className="font-bold tracking-tight text-white font-sans text-lg">
                CHATHURYA STUDENT DEVELOPER CLUB
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-md font-sans">
              Empowering the next generation of engineers with production-grade engineering practices, intensive daily code walkthroughs, and peer review feedback.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-[#B0FF00]">
                <Code2 className="w-3 h-3" /> Full Stack Dev Track
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-cyan-400">
                <Database className="w-3 h-3" /> Data Analytics Track
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-emerald-400">
                18 Intensive Days
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2 font-mono text-xs">
            <p className="text-white font-semibold uppercase tracking-wider text-xs border-b border-zinc-800 pb-1">
              Portal Routes
            </p>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/" className="hover:text-[#B0FF00] transition-colors">→ Workshop Overview</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#B0FF00] transition-colors">→ Student Registration</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#B0FF00] transition-colors">→ 18-Day Tracker Grid</Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-[#B0FF00] transition-colors">→ Admin Portal</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Notice */}
          <div className="space-y-2 font-mono text-xs">
            <p className="text-white font-semibold uppercase tracking-wider text-xs border-b border-zinc-800 pb-1">
              Feedback Integrity
            </p>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Every day's review is timestamped and recorded in Firestore. Feedback directly shapes trainer pace, live coding problem sets, and hands-on lab sessions.
            </p>
            <div className="pt-2 text-[10px] text-zinc-500">
              Admin: chathuryastdclub@gmail.com
            </div>
          </div>

        </div>

        <div className="border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-mono gap-4">
          <p>© {new Date().getFullYear()} Chathurya Student Developer Club. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-zinc-400">
              Built for ~200 Student Cohort
            </span>
            <span>•</span>
            <span className="text-[#B0FF00]">Netlify & Firebase Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
