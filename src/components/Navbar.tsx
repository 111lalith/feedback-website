import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  ShieldCheck, 
  User, 
  LogOut, 
  Sparkles, 
  Layers, 
  Search,
  ExternalLink 
} from 'lucide-react';
import { getLocalStudentId, getStudent, clearLocalStudentId, isAdminAuthenticated, logoutAdmin } from '../lib/firebase';
import { Student } from '../types';
import { ChathuryaLogo } from './ChathuryaLogo';

interface NavbarProps {
  onOpenLookup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLookup }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    // Check local student
    const studentId = getLocalStudentId();
    if (studentId) {
      getStudent(studentId).then(std => {
        if (std) setCurrentStudent(std);
      });
    } else {
      setCurrentStudent(null);
    }

    setIsAdmin(isAdminAuthenticated());
  }, [location.pathname]);

  const handleStudentLogout = () => {
    clearLocalStudentId();
    setCurrentStudent(null);
    navigate('/');
  };

  const handleAdminLogout = async () => {
    await logoutAdmin();
    setIsAdmin(false);
    navigate('/');
  };

  return (
    <nav className="border-b border-[#B0FF00]/20 bg-black/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo matching provided image */}
          <Link to="/" className="group flex items-center">
            <ChathuryaLogo size="md" />
          </Link>

          {/* Nav Links & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Quick Navigation Links */}
            <Link 
              to="/" 
              className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-mono transition-colors ${
                location.pathname === '/' 
                  ? 'text-[#B0FF00] bg-[#B0FF00]/10 border border-[#B0FF00]/30 font-bold' 
                  : 'text-gray-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Overview
            </Link>

            <Link 
              to="/dashboard" 
              className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-mono transition-colors ${
                location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/review')
                  ? 'text-[#B0FF00] bg-[#B0FF00]/10 border border-[#B0FF00]/30 font-bold' 
                  : 'text-gray-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Student Tracker
            </Link>

            {/* Active Student Status or Lookup */}
            {currentStudent ? (
              <div className="flex items-center gap-1 sm:gap-1.5 bg-[#0d0d0d] border border-[#B0FF00]/40 rounded-md px-2 sm:px-2.5 py-1 text-xs">
                <User className="w-3.5 h-3.5 text-[#B0FF00] shrink-0" />
                <span className="font-mono text-gray-200 max-w-[80px] sm:max-w-[140px] truncate">
                  {currentStudent.name.split(' ')[0]} ({currentStudent.idCardNo})
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
                className="flex items-center gap-1.5 text-xs font-mono text-gray-300 hover:text-[#B0FF00] px-2 sm:px-2.5 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-[#B0FF00]" />
                <span className="hidden sm:inline">Student Tracker</span>
                <span className="sm:hidden">Tracker</span>
              </button>
            )}

            {/* Admin Portal Link */}
            {isAdmin ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 text-xs font-mono bg-[#B0FF00] text-black px-2.5 sm:px-3 py-1.5 rounded font-semibold hover:bg-[#39FF14] glow-accent transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Admin Panel</span>
                  <span className="sm:hidden">Admin</span>
                </Link>
                <button
                  onClick={handleAdminLogout}
                  title="Exit Admin"
                  className="text-gray-400 hover:text-red-400 p-1.5 rounded bg-zinc-900 border border-zinc-800 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className={`flex items-center gap-1.5 text-xs font-mono px-2.5 sm:px-3 py-1.5 rounded border transition-all ${
                  location.pathname === '/admin/login'
                    ? 'border-[#B0FF00] text-[#B0FF00] bg-[#B0FF00]/10 font-bold'
                    : 'border-zinc-800 text-gray-400 hover:text-[#B0FF00] hover:border-[#B0FF00]/40 bg-zinc-950'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

