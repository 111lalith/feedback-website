import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Database, 
  ShieldCheck, 
  ArrowRight,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ChathuryaLogo } from './ChathuryaLogo';
import { isAdminAuthenticated, logoutAdmin } from '../lib/firebase';

export const Footer: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAdmin(isAdminAuthenticated());
  }, []);

  const handleAdminLogout = async () => {
    await logoutAdmin();
    setIsAdmin(false);
    navigate('/');
  };

  return (
    <footer className="border-t border-[#B0FF00]/20 bg-black py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Club Brand & Info with New Logo */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-block group">
              <ChathuryaLogo size="md" />
            </Link>
            <p className="text-sm text-gray-400 max-w-md font-sans leading-relaxed">
              Empowering the next generation of engineers with production-grade engineering practices, intensive daily code walkthroughs, and peer review feedback.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
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

          {/* Col 2: Navigation Routes */}
          <div className="space-y-2.5 font-mono text-xs">
            <p className="text-white font-semibold uppercase tracking-wider text-xs border-b border-zinc-800 pb-1.5">
              Portal Routes
            </p>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/" className="hover:text-[#B0FF00] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#B0FF00]" /> Workshop Overview
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#B0FF00] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#B0FF00]" /> Student Registration
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#B0FF00] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#B0FF00]" /> 18-Day Tracker Grid
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Admin Command Portal Access */}
          <div className="space-y-3 font-mono text-xs bg-[#0d0d0d] border border-zinc-800/80 rounded-2xl p-4">
            <div className="flex items-center gap-1.5 text-zinc-300 font-bold uppercase tracking-wider text-xs">
              <ShieldCheck className="w-4 h-4 text-[#B0FF00]" />
              <span>Instructor Portal</span>
            </div>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Authorized admin access for day unlocks, remark inspections, and live workshop metrics.
            </p>
            
            {isAdmin ? (
              <div className="flex items-center gap-2 pt-1">
                <Link
                  to="/admin"
                  className="flex-1 px-3 py-2 rounded-xl bg-[#B0FF00] text-black font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#39FF14] glow-accent transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </Link>
                <button
                  onClick={handleAdminLogout}
                  title="Logout Admin"
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-gray-400 hover:text-red-400 border border-zinc-700 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="w-full px-3 py-2 rounded-xl bg-black hover:bg-[#B0FF00] text-gray-300 hover:text-black border border-zinc-700 hover:border-[#B0FF00] font-semibold text-xs transition-all flex items-center justify-center gap-1.5 group cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#B0FF00] group-hover:text-black transition-colors" />
                <span>Admin Login</span>
              </Link>
            )}
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
