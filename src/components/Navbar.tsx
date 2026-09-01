import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  User, 
  LogOut, 
  Search,
  Sun,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { getLocalStudentId, getStudent, clearLocalStudentId } from '../lib/firebase';
import { Student } from '../types';
import { ChathuryaLogo } from './ChathuryaLogo';

interface NavbarProps {
  onOpenLookup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLookup }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);

  useEffect(() => {
    const studentId = getLocalStudentId();
    if (studentId) {
      getStudent(studentId).then(std => {
        if (std) setCurrentStudent(std);
      });
    } else {
      setCurrentStudent(null);
    }
  }, [location.pathname]);

  const handleStudentLogout = () => {
    clearLocalStudentId();
    setCurrentStudent(null);
    navigate('/');
  };

  return (
    <header className="border-b border-[#B0FF00]/20 bg-black/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-18">
          
          {/* Brand Logo with CX Glyph and Arial font text */}
          <Link to="/" className="group flex items-center shrink-0">
            <ChathuryaLogo size="sm" className="sm:hidden" />
            <ChathuryaLogo size="md" className="hidden sm:inline-flex" />
          </Link>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-2">
              <Link 
                to="/" 
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                  location.pathname === '/' 
                    ? 'text-[#B0FF00] bg-[#B0FF00]/10 border border-[#B0FF00]/30 font-bold' 
                    : 'text-gray-300 hover:text-white hover:bg-zinc-900'
                }`}
              >
                Overview
              </Link>

              <Link 
                to="/dashboard" 
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                  location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/review')
                    ? 'text-[#B0FF00] bg-[#B0FF00]/10 border border-[#B0FF00]/30 font-bold' 
                    : 'text-gray-300 hover:text-white hover:bg-zinc-900'
                }`}
              >
                Tracker
              </Link>
            </div>

            {/* Student Logged In Indicator / Lookup Button */}
            {currentStudent ? (
              <div className="flex items-center gap-1 sm:gap-1.5 bg-[#0d0d0d] border border-[#B0FF00]/40 rounded-lg px-2 sm:px-2.5 py-1 text-xs">
                <User className="w-3.5 h-3.5 text-[#B0FF00] shrink-0" />
                <span className="font-mono text-gray-200 max-w-[70px] sm:max-w-[120px] truncate">
                  {currentStudent.name.split(' ')[0]}
                </span>
                <button
                  onClick={handleStudentLogout}
                  title="Switch student profile"
                  className="text-gray-400 hover:text-red-400 p-0.5 ml-0.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLookup}
                title="Search student review status"
                className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-gray-300 hover:text-[#B0FF00] px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-[#B0FF00]" />
                <span>Search ID</span>
              </button>
            )}

            {/* Sun / Theme Button matching Screenshot */}
            <div 
              className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 hover:text-amber-300 transition-all cursor-default select-none shadow-inner"
              title="Dark Mode Active"
            >
              <Sun className="w-4 h-4 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
            </div>

            {/* Register Now Action Button matching Screenshot */}
            <Link
              to="/register"
              className="bg-[#C6FF00] hover:bg-[#39FF14] text-black font-sans font-bold text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl flex items-center gap-1.5 shadow-[0_0_12px_rgba(198,255,0,0.4)] transition-all whitespace-nowrap active:scale-95"
            >
              <span>Register Now</span>
            </Link>

          </div>
        </div>
      </div>
    </header>
  );
};
