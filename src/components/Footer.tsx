import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ExternalLink,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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

  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Seshadripuram+College,+24+Nagappa+Street,+Seshadripuram,+Bengaluru,+Karnataka+560020";

  return (
    <footer id="contact-club-info" className="border-t border-[#B0FF00]/20 bg-black pt-8 pb-28 sm:pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Login Link at the top of footer */}
        <div className="mb-6 pb-4 border-b border-zinc-800/80 flex items-center justify-between">
          <Link
            to={isAdmin ? "/admin" : "/admin/login"}
            className="text-xs text-zinc-400 hover:text-[#C6FF00] font-sans transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
            <span>Admin Login</span>
          </Link>
          
          {isAdmin && (
            <button
              onClick={handleAdminLogout}
              className="text-xs text-red-400 hover:text-red-300 font-sans transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          )}
        </div>

        {/* Contact & Club Info Section - Pixel-matched to design */}
        <div className="space-y-4 mb-8">
          
          <h2 className="text-xl sm:text-2xl font-bold text-white font-sans tracking-tight">
            Contact & Club Info
          </h2>

          <div className="space-y-3 font-sans">
            
            {/* Department Name */}
            <h3 className="text-sm sm:text-base font-extrabold text-white uppercase tracking-wider">
              DEPARTMENT OF COMPUTER SCIENCE
            </h3>

            {/* Club Name in Arial */}
            <p 
              className="text-sm sm:text-base font-bold text-zinc-300"
              style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
            >
              Chathurya Student Developers Club
            </p>

            {/* College Location */}
            <div className="pt-0.5">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open location in Google Maps"
                className="inline-flex items-start gap-1.5 text-sm text-zinc-300 hover:text-[#C6FF00] transition-colors leading-relaxed group cursor-pointer"
              >
                <span className="text-red-500 shrink-0 text-base leading-none">📍</span>
                <span className="text-zinc-300 group-hover:text-[#C6FF00]">
                  Seshadripuram College, 24, Nagappa Road, Bengaluru North, Karnataka
                </span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 shrink-0 mt-0.5" />
              </a>
            </div>

            {/* Faculty Convener */}
            <div className="text-sm text-zinc-300">
              <span className="text-zinc-400">Faculty Convener:</span>{' '}
              <strong className="text-white font-semibold">Mr. Shivaswamy D S</strong>
            </div>

            {/* Student Coordinators */}
            <div className="space-y-1.5 text-sm">
              <p className="text-zinc-400 font-medium">
                Student Coordinators:
              </p>
              
              <div className="space-y-1 pl-0">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-300">Harishwar:</span>
                  <a 
                    href="tel:+919632165579" 
                    className="text-[#C6FF00] hover:text-[#39FF14] font-bold font-sans tracking-wide"
                  >
                    +91 96321 65579
                  </a>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-zinc-300">Harshitha:</span>
                  <a 
                    href="tel:+919449746460" 
                    className="text-[#C6FF00] hover:text-[#39FF14] font-bold font-sans tracking-wide"
                  >
                    +91 94497 46460
                  </a>
                </div>
              </div>
            </div>

            {/* Official Club Email */}
            <div className="flex items-center gap-2 text-sm pt-0.5">
              <span className="text-zinc-400 font-medium">Email:</span>
              <a 
                href="mailto:chathuryasdc@gmail.com" 
                className="text-[#C6FF00] hover:text-[#39FF14] font-bold font-sans"
              >
                chathuryasdc@gmail.com
              </a>
            </div>

          </div>
        </div>

        {/* Sub-Footer with Copyright & Design/Developer Attribution */}
        <div className="border-t border-zinc-800/80 pt-5 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 font-sans gap-3">
          <p className="text-center sm:text-left text-zinc-500">
            © 2026 Chathurya Student Developers Club. All Rights Reserved.
          </p>
          
          <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 px-3.5 py-1.5 rounded-full shadow-sm">
            <span className="text-zinc-400">Designed & Developed by</span>
            <span className="text-[#C6FF00] font-bold">
              B Lalith Anjan
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
