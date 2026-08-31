import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Terminal, 
  Lock, 
  Mail, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { loginAdmin } from '../lib/firebase';
import { ChathuryaLogo } from '../components/ChathuryaLogo';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide both administrator email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await loginAdmin(email, password);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error || 'Invalid administrator credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        
        {/* Return link */}
        <div className="text-left font-mono text-xs text-gray-400">
          <Link to="/" className="hover:text-[#B0FF00] flex items-center gap-1 transition-colors">
            ← Return to Workshop Portal
          </Link>
        </div>

        {/* Login Box */}
        <div className="bg-[#0d0d0d] border border-[#B0FF00]/40 rounded-2xl p-6 sm:p-8 glow-accent shadow-2xl relative">
          
          {/* Header */}
          <div className="text-center space-y-3 mb-6">
            <div className="flex justify-center">
              <ChathuryaLogo size="lg" showTagline={true} />
            </div>
            
            <h1 className="text-xl font-bold text-white font-sans mt-2">
              Admin Command Portal
            </h1>
            
            <p className="text-xs text-gray-400 font-mono">
              Workshop Daily Access & Evaluation Engine
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2 bg-red-950/40 border border-red-500/50 rounded-xl p-3 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#B0FF00]" /> Administrator Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email address"
                className="w-full bg-black border border-zinc-700 focus:border-[#B0FF00] focus:ring-1 focus:ring-[#B0FF00] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#B0FF00]" /> Secret Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-black border border-zinc-700 focus:border-[#B0FF00] focus:ring-1 focus:ring-[#B0FF00] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black border-2 border-[#B0FF00] text-[#B0FF00] hover:bg-[#B0FF00] hover:text-black font-mono font-bold text-sm py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all glow-accent cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-pulse flex items-center gap-2 font-mono">
                    <Terminal className="w-4 h-4 animate-spin" />
                    Authenticating with Firebase...
                  </span>
                ) : (
                  <>
                    <span>Enter Admin Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
