import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Code2, 
  Database, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Laptop, 
  Calendar, 
  Star, 
  ShieldCheck, 
  Clock, 
  Award,
  Users,
  Search,
  Zap,
  ChevronRight
} from 'lucide-react';
import { WORKSHOP_TOPICS } from '../types';
import { getLocalStudentId, getStudent } from '../lib/firebase';
import { ChathuryaLogo } from '../components/ChathuryaLogo';

interface LandingPageProps {
  onOpenLookup: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenLookup }) => {
  const [activeTrack, setActiveTrack] = useState<'Full Stack' | 'Data Analytics'>('Full Stack');
  const [existingStudentName, setExistingStudentName] = useState<string | null>(null);
  const [existingStudentIdCard, setExistingStudentIdCard] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const studentId = getLocalStudentId();
    if (studentId) {
      getStudent(studentId).then(s => {
        if (s) {
          setExistingStudentName(s.name);
          setExistingStudentIdCard(s.idCardNo);
        }
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-[#EAEAEA]">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-16 sm:pb-24 border-b border-[#B0FF00]/15">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#121212_1px,transparent_1px),linear-gradient(to_bottom,#121212_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Top Badge */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <ChathuryaLogo size="sm" showTagline={true} />
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d0d0d] border border-[#B0FF00]/40 text-xs font-mono text-[#B0FF00] glow-accent-subtle">
              <span className="w-2 h-2 rounded-full bg-[#B0FF00] animate-ping shrink-0" />
              <span>18-DAY FLAGSHIP TECHNICAL WORKSHOP</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="hero-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans">
                Daily Feedback & <br />
                <span className="text-[#B0FF00] glow-text">Review Portal</span>
              </h1>
              
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 font-sans max-w-2xl leading-relaxed">
                Welcome to the official 18-Day Workshop evaluation engine. 
                Register once, submit your daily ratings for <strong className="text-white">Full Stack Development</strong> or <strong className="text-white">Data Analytics</strong>, and directly influence each day's live exercises and trainer pace.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                {existingStudentName ? (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2.5 bg-black border-2 border-[#B0FF00] text-[#B0FF00] hover:bg-[#B0FF00] hover:text-black font-mono font-bold text-xs sm:text-sm md:text-base px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl transition-all glow-accent"
                  >
                    <span>Student Tracker ({existingStudentName.split(' ')[0]})</span>
                    <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
                  </Link>
                ) : (
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2.5 bg-black border-2 border-[#B0FF00] text-[#B0FF00] hover:bg-[#B0FF00] hover:text-black font-mono font-bold text-xs sm:text-sm md:text-base px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl transition-all glow-accent"
                  >
                    <span>Register as Student</span>
                    <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
                  </Link>
                )}

                <button
                  onClick={onOpenLookup}
                  className="inline-flex items-center gap-2 bg-[#0d0d0d] hover:bg-zinc-900 text-gray-300 hover:text-white font-mono text-xs sm:text-sm px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl border border-zinc-800 transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4 text-[#B0FF00]" />
                  <span>Student Tracker</span>
                </button>
              </div>

              {/* Quick Feature Chips */}
              <div className="pt-4 grid grid-cols-3 gap-2 sm:gap-3 max-w-xl font-mono text-[11px] sm:text-xs text-gray-400">
                <div className="bg-[#0d0d0d] p-2.5 sm:p-3 rounded-lg border border-zinc-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#B0FF00] shrink-0" />
                  <span>18 Daily Modules</span>
                </div>
                <div className="bg-[#0d0d0d] p-2.5 sm:p-3 rounded-lg border border-zinc-800 flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#B0FF00] shrink-0" />
                  <span>5-Criteria Ratings</span>
                </div>
                <div className="bg-[#0d0d0d] p-2.5 sm:p-3 rounded-lg border border-zinc-800 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#B0FF00] shrink-0" />
                  <span>~200 Students</span>
                </div>
              </div>

            </div>

            {/* Right Terminal Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#0d0d0d] border border-[#B0FF00]/40 rounded-2xl p-5 sm:p-6 glow-accent shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono text-xs text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-[#B0FF00] inline-block" />
                    <span className="ml-2 text-gray-300">workshop-engine.ts</span>
                  </div>
                  <span className="text-[#B0FF00] font-mono text-[11px]">LIVE WORKSHOP</span>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div className="text-zinc-500">
                    // Parallel Tracks Execution Matrix
                  </div>


                  <div className="p-3.5 rounded-lg bg-black border border-[#B0FF00]/30 space-y-1.5">
                    <div className="flex items-center justify-between text-[#B0FF00] font-bold">
                      <span className="flex items-center gap-1.5">
                        <Code2 className="w-4 h-4" /> Track 1: Full Stack Dev
                      </span>
                      <span className="text-[10px] bg-[#B0FF00]/10 px-2 py-0.5 rounded border border-[#B0FF00]/30">React • Node • Cloud</span>
                    </div>
                    <p className="text-[11px] text-gray-300 font-sans">
                      HTML5, Modern CSS, React 19, Express APIs, NoSQL/SQL databases, containerization, and production capstone.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-black border border-cyan-500/30 space-y-1.5">
                    <div className="flex items-center justify-between text-cyan-400 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Database className="w-4 h-4" /> Track 2: Data Analytics
                      </span>
                      <span className="text-[10px] bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">Python • Pandas • ML</span>
                    </div>
                    <p className="text-[11px] text-gray-300 font-sans">
                      Python computing, NumPy, Pandas wrangling, Matplotlib/Seaborn visualization, SQL queries, and predictive ML.
                    </p>
                  </div>

                  <div className="border-t border-zinc-800 pt-3 flex items-center justify-between text-[11px] text-gray-400">
                    <span>Admin Monitoring Active:</span>
                    <span className="text-[#B0FF00] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> chathuryastdclub@gmail.com
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Workshop Workflow Guide */}
      <section className="py-16 bg-zinc-950/60 border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-mono text-[#B0FF00] uppercase tracking-widest mb-2">
              Workflow Architecture
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-sans">
              How The Daily Review Works
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="bg-[#0d0d0d] border border-zinc-800 hover:border-[#B0FF00]/50 rounded-xl p-6 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-black border border-[#B0FF00]/40 flex items-center justify-center font-mono text-[#B0FF00] font-bold text-lg mb-4 group-hover:glow-accent">
                01
              </div>
              <h4 className="text-lg font-bold text-white mb-2 font-sans">
                One-Time Registration
              </h4>
              <p className="text-sm text-gray-400 font-sans leading-relaxed">
                Provide your Full Name, 10-digit Phone, College ID Card Number, Stream (Full Stack or DA), and Class Section.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#0d0d0d] border border-zinc-800 hover:border-[#B0FF00]/50 rounded-xl p-6 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-black border border-[#B0FF00]/40 flex items-center justify-center font-mono text-[#B0FF00] font-bold text-lg mb-4 group-hover:glow-accent">
                02
              </div>
              <h4 className="text-lg font-bold text-white mb-2 font-sans">
                18-Day Tracker Grid
              </h4>
              <p className="text-sm text-gray-400 font-sans leading-relaxed">
                Your personal dashboard automatically displays an 18-tile tracker. Tap any active or pending day tile to open that day's feedback form.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#0d0d0d] border border-zinc-800 hover:border-[#B0FF00]/50 rounded-xl p-6 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-black border border-[#B0FF00]/40 flex items-center justify-center font-mono text-[#B0FF00] font-bold text-lg mb-4 group-hover:glow-accent">
                03
              </div>
              <h4 className="text-lg font-bold text-white mb-2 font-sans">
                Evaluate & Impact Pace
              </h4>
              <p className="text-sm text-gray-400 font-sans leading-relaxed">
                Score Content, Trainer Delivery, Pace, and Hands-on quality. Submit your qualitative thoughts to guide the mentors in real time.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 18-Day Curriculum Roadmap Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-mono text-[#B0FF00] uppercase tracking-widest block mb-1">
                Curriculum Blueprint
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans">
                18-Day Workshop Topic Roadmap
              </h2>
            </div>

            {/* Track Switcher */}
            <div className="flex items-center bg-[#0d0d0d] border border-zinc-800 rounded-lg p-1 font-mono text-xs">
              <button
                onClick={() => setActiveTrack('Full Stack')}
                className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${
                  activeTrack === 'Full Stack'
                    ? 'bg-[#B0FF00] text-black font-bold glow-accent'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Full Stack Dev Track</span>
              </button>
              <button
                onClick={() => setActiveTrack('Data Analytics')}
                className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${
                  activeTrack === 'Data Analytics'
                    ? 'bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Data Analytics Track</span>
              </button>
            </div>
          </div>

          {/* Grid of Days */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WORKSHOP_TOPICS.map((topic) => {
              const currentTopicTitle = activeTrack === 'Full Stack' ? topic.fullStackTopic : topic.dataAnalyticsTopic;
              return (
                <div 
                  key={topic.day}
                  className="bg-[#0d0d0d] border border-zinc-800 hover:border-[#B0FF00]/40 rounded-xl p-4 transition-all hover:bg-zinc-950"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-[#B0FF00] px-2 py-0.5 rounded bg-[#B0FF00]/10 border border-[#B0FF00]/30">
                      DAY {topic.day.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">
                      Module {topic.day} / 18
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-white mb-1.5 font-sans line-clamp-2">
                    {currentTopicTitle}
                  </h4>
                  
                  <p className="text-xs text-zinc-400 font-sans line-clamp-2">
                    {topic.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center p-8 bg-[#0d0d0d] border border-[#B0FF00]/30 rounded-2xl glow-accent">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 font-sans">
              Ready to submit your workshop feedback?
            </h3>
            <p className="text-sm text-gray-400 max-w-lg mx-auto mb-6 font-sans">
              Ensure your voice is captured in today's session review and track your 18-day progress.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/register"
                className="bg-black border-2 border-[#B0FF00] text-[#B0FF00] hover:bg-[#B0FF00] hover:text-black font-mono font-bold text-sm px-6 py-3 rounded-xl transition-all glow-accent"
              >
                Register as Student
              </Link>
              <Link
                to="/dashboard"
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-sm px-6 py-3 rounded-xl border border-zinc-700 transition-colors"
              >
                Open 18-Day Tracker Grid
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
