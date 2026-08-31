import React, { useState } from 'react';
import { Search, UserCheck, AlertCircle, X, Terminal, ArrowRight } from 'lucide-react';
import { getStudentByIdCard, setLocalStudentId } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { ChathuryaLogo } from './ChathuryaLogo';

interface StudentLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const StudentLookupModal: React.FC<StudentLookupModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [idCardInput, setIdCardInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idCardInput.trim()) {
      setError('Please enter your ID card number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const student = await getStudentByIdCard(idCardInput.trim());
      if (student) {
        setLocalStudentId(student.id);
        if (onSuccess) onSuccess();
        onClose();
        navigate('/dashboard');
      } else {
        setError(`No registered student found with ID Card "${idCardInput.trim()}". Please check or register first.`);
      }
    } catch (err: any) {
      setError('Unable to query database. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#0d0d0d] border border-[#B0FF00]/40 rounded-2xl p-6 relative shadow-2xl glow-accent">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Chathurya Logo */}
        <div className="mb-5 pb-3 border-b border-zinc-800">
          <ChathuryaLogo size="sm" className="mb-3" />
          <h3 className="text-xl font-bold text-white font-sans">
            Student Tracker Lookup
          </h3>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Access your 18-day progress matrix and daily reviews
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLookup} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-1.5">
              College ID Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={idCardInput}
                onChange={(e) => {
                  setIdCardInput(e.target.value);
                  setError(null);
                }}
                placeholder="e.g. 21BCA042, 21BBA019, 21BCM104"
                autoFocus
                className="w-full bg-black border border-zinc-700 focus:border-[#B0FF00] focus:ring-1 focus:ring-[#B0FF00] rounded-lg px-3.5 py-2.5 text-sm font-mono text-white placeholder-zinc-600 outline-none uppercase tracking-wider transition-all"
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-1 font-mono">
              Enter your college ID Card Number as registered.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-950/40 border border-red-500/50 rounded-lg p-3 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black border border-[#B0FF00] text-[#B0FF00] hover:bg-[#B0FF00] hover:text-black font-mono text-xs sm:text-sm font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all glow-accent cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-pulse font-mono">Verifying...</span>
              ) : (
                <>
                  <span>Student Tracker</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/register');
              }}
              className="bg-zinc-900 hover:bg-zinc-800 text-gray-300 font-mono text-xs py-2.5 px-3 rounded-lg border border-zinc-800 transition-colors cursor-pointer"
            >
              Register
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

