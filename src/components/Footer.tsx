import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Database, 
  ShieldCheck, 
  ArrowRight,
  LogOut,
  MapPin,
  Mail,
  UserCheck,
  Building2,
  Sparkles
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
    <footer className="border-t border-[#B0FF00]/20 bg-black pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          
          {/* Col 1: Club Brand & Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="inline-block group">
              <ChathuryaLogo size="md" />
            </Link>
            
            <div className="space-y-2">
              <p className="text-xs font-mono text-[#B0FF00] font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>Department of Computer Science</span>
              </p>
              <p className="text-sm text-gray-400 font-sans leading-relaxed">
                Empowering the next generation of engineers with production-grade engineering practices, intensive daily code walkthroughs, and peer review feedback.
              </p>
            </div>

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

          {/* Col 2: Contact & Institutional Info from Official Banner (4 cols) */}
          <div className="md:col-span-4 space-y-3.5 font-sans text-xs">
            <p className="text-white font-bold uppercase tracking-wider text-xs font-mono border-b border-zinc-800 pb-2">
              Contact & Club Info
            </p>

            <div className="space-y-2.5 text-gray-300">
              <div className="flex items-start gap-2 text-zinc-300">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Seshadripuram College, 24, Nagappa Road, Bengaluru North, Karnataka
                </span>
              </div>

              <div className="flex items-center gap-2 text-zinc-300 pt-1">
                <UserCheck className="w-4 h-4 text-[#B0FF00] shrink-0" />
                <span>
                  <strong className="text-zinc-400 font-normal">Faculty Convener:</strong> <span className="text-white font-semibold">Mr. Shivaswamy D S</span>
                </span>
              </div>

              <div className="flex items-center gap-2 text-zinc-300">
                <Mail className="w-4 h-4 text-yellow-400 shrink-0" />
                <a 
                  href="mailto:chathuryasdc@gmail.com" 
                  className="font-mono text-[#B0FF00] hover:underline font-medium"
                >
                  chathuryasdc@gmail.com
                </a>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 italic pt-1 leading-relaxed">
              Conducted as part of the official student technical and learning activities of Chathurya Student Developers Club.
            </p>
          </div>

          {/* Col 3: Portal Links & Admin Access (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <div className="space-y-2 font-mono text-xs">
              <p className="text-white font-bold uppercase tracking-wider text-xs border-b border-zinc-800 pb-2">
                Quick Routes
              </p>
              <ul className="space-y-1.5 text-gray-400">
                <li>
                  <Link to="/" className="hover:text-[#B0FF00] transition-colors flex items-center gap-1.5 py-0.5">
                    <ArrowRight className="w-3 h-3 text-[#B0FF00]" /> Workshop Overview
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-[#B0FF00] transition-colors flex items-center gap-1.5 py-0.5">
                    <ArrowRight className="w-3 h-3 text-[#B0FF00]" /> Student Registration
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-[#B0FF00] transition-colors flex items-center gap-1.5 py-0.5">
                    <ArrowRight className="w-3 h-3 text-[#B0FF00]" /> 18-Day Tracker Grid
                  </Link>
                </li>
              </ul>
            </div>

            {/* Admin Command Portal Access */}
            <div className="bg-[#0d0d0d] border border-zinc-800/90 rounded-xl p-3.5 font-mono text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-zinc-300 font-bold uppercase text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B0FF00]" />
                <span>Instructor Portal</span>
              </div>
              
              {isAdmin ? (
                <div className="flex items-center gap-2 pt-1">
                  <Link
                    to="/admin"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#B0FF00] text-black font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#39FF14] glow-accent transition-all"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin Panel</span>
                  </Link>
                  <button
                    onClick={handleAdminLogout}
                    title="Logout Admin"
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-gray-400 hover:text-red-400 border border-zinc-700 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/admin/login"
                  className="w-full px-3 py-1.5 rounded-lg bg-black hover:bg-[#B0FF00] text-gray-300 hover:text-black border border-zinc-700 hover:border-[#B0FF00] font-semibold text-xs transition-all flex items-center justify-center gap-1.5 group cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B0FF00] group-hover:text-black transition-colors" />
                  <span>Admin Login</span>
                </Link>
              )}
            </div>
          </div>

        </div>

        {/* Sub-Footer with Copyright & Design/Developer Attribution */}
        <div className="border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 font-mono gap-3">
          <p className="text-center sm:text-left text-zinc-500">
            © 2026 Chathurya Student Developers Club. All Rights Reserved.
          </p>
          
          <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800/80 px-3 py-1.5 rounded-full">
            <span className="text-zinc-400">Designed & Developed by</span>
            <span className="text-[#B0FF00] font-bold glow-accent-subtle">
              B Lalith Anjan
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
