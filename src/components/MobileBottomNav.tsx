import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Info, 
  Sparkles, 
  BookOpen, 
  Plus 
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenLookup?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenLookup }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const isRegister = location.pathname === '/register';
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/review');

  const scrollToAbout = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('contact-club-info') || document.getElementById('about');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById('contact-club-info') || document.getElementById('about');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-3 inset-x-3 sm:hidden z-50 pointer-events-auto">
      <nav 
        className="bg-[#090b09]/95 border border-[#B0FF00]/30 backdrop-blur-lg rounded-2xl px-3 py-2 flex items-center justify-around shadow-[0_10px_25px_rgba(0,0,0,0.8),0_0_15px_rgba(176,255,0,0.15)]"
        aria-label="Mobile Navigation"
      >
        {/* Home */}
        <Link
          to="/"
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${
            isHome ? 'text-[#B0FF00]' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          {isHome && (
            <span className="absolute -top-2 w-7 h-0.5 bg-[#B0FF00] rounded-full shadow-[0_0_8px_#B0FF00]" />
          )}
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold font-sans">Home</span>
        </Link>

        {/* About */}
        <button
          onClick={scrollToAbout}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
        >
          <div className="w-5 h-5 flex items-center justify-center mb-0.5">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-500 hover:bg-zinc-300" />
          </div>
          <span className="text-[10px] font-medium font-sans">About</span>
        </button>

        {/* Events */}
        <Link
          to="/dashboard"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${
            isDashboard ? 'text-[#B0FF00]' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium font-sans">Events</span>
        </Link>

        {/* Courses */}
        <button
          onClick={() => {
            if (location.pathname !== '/') {
              navigate('/');
            }
            setTimeout(() => {
              const el = document.getElementById('curriculum');
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium font-sans">Courses</span>
        </button>

        {/* Join / Register (Vibrant Neon Circle) */}
        <Link
          to="/register"
          className="flex flex-col items-center justify-center -mt-1 group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-[#C6FF00] hover:bg-[#39FF14] text-black flex items-center justify-center shadow-[0_0_12px_rgba(198,255,0,0.6)] group-hover:scale-105 transition-all">
            <Plus className="w-5 h-5 stroke-[3]" />
          </div>
          <span className={`text-[10px] font-bold font-sans mt-0.5 ${
            isRegister ? 'text-[#B0FF00]' : 'text-zinc-300'
          }`}>
            Join
          </span>
        </Link>
      </nav>
    </div>
  );
};
