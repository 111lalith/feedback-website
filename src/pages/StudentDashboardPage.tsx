import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Terminal, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Star, 
  Code2, 
  Database, 
  User, 
  Laptop, 
  AlertCircle, 
  Sparkles, 
  Eye, 
  X, 
  Calendar,
  Award,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Lock,
  Unlock
} from 'lucide-react';
import { 
  getLocalStudentId, 
  getStudent, 
  getStudentReviews, 
  clearLocalStudentId,
  subscribeFeedbackSettings
} from '../lib/firebase';
import { Student, Review, WORKSHOP_TOPICS, DayTopic, FeedbackSettings } from '../types';

interface StudentDashboardPageProps {
  onOpenLookup: () => void;
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({ onOpenLookup }) => {
  const navigate = useNavigate();
  
  const [student, setStudent] = useState<Student | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [feedbackSettings, setFeedbackSettings] = useState<FeedbackSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSubmittedReview, setSelectedSubmittedReview] = useState<{ review: Review; topic: DayTopic } | null>(null);

  const loadData = async () => {
    const studentId = getLocalStudentId();
    if (!studentId) {
      setLoading(false);
      return;
    }

    try {
      const studentData = await getStudent(studentId);
      if (studentData) {
        setStudent(studentData);
        const reviewList = await getStudentReviews(studentId);
        setReviews(reviewList);
      } else {
        clearLocalStudentId();
      }
    } catch (err) {
      console.error('Failed loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeFeedbackSettings((settings) => {
      setFeedbackSettings(settings);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-xl bg-black border-2 border-[#B0FF00] flex items-center justify-center glow-accent animate-pulse mb-4">
          <Terminal className="w-6 h-6 text-[#B0FF00]" />
        </div>
        <p className="font-mono text-sm text-[#B0FF00]">Loading 18-Day Progress Matrix...</p>
      </div>
    );
  }

  // If no student profile loaded, show prompt to register or search
  if (!student) {
    return (
      <div className="min-h-screen bg-black py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center space-y-6 bg-[#0d0d0d] border border-[#B0FF00]/40 rounded-2xl p-8 glow-accent shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-black border border-[#B0FF00]/60 mx-auto flex items-center justify-center glow-accent">
            <User className="w-7 h-7 text-[#B0FF00]" />
          </div>

          <h2 className="text-2xl font-bold text-white font-sans">
            No Active Student Profile Found
          </h2>

          <p className="text-sm text-gray-400 font-sans leading-relaxed">
            Please register once to obtain your unique 18-day review tracker, or look up your profile using your college ID Card Number.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-black border-2 border-[#B0FF00] text-[#B0FF00] hover:bg-[#B0FF00] hover:text-black font-mono font-bold text-xs sm:text-sm py-3 px-6 rounded-xl transition-all glow-accent"
            >
              Register as New Student
            </Link>
            
            <button
              onClick={onOpenLookup}
              className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-gray-300 font-mono text-xs sm:text-sm py-3 px-5 rounded-xl border border-zinc-700 transition-colors"
            >
              Lookup Existing Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  const completedDayNumbers = new Set(reviews.map(r => r.day));
  const completedCount = completedDayNumbers.size;
  const percentage = Math.round((completedCount / 18) * 100);

  return (
    <div className="min-h-screen bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Student Profile Overview Header */}
        <div className="bg-[#0d0d0d] border border-[#B0FF00]/40 rounded-2xl p-6 sm:p-8 glow-accent shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Left Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-[#B0FF00]/10 text-[#B0FF00] border border-[#B0FF00]/30 text-[11px] font-mono font-bold">
                  STUDENT COHORT 2026
                </span>
                <span className="text-zinc-500 text-xs font-mono">•</span>
                <span className="text-xs font-mono text-zinc-400">
                  ID: <strong className="text-white">{student.idCardNo}</strong>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans flex items-center gap-3">
                {student.name}
              </h1>

              {/* Student Metadata Chips */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold border ${
                  student.stream === 'Full Stack Development'
                    ? 'bg-[#B0FF00]/10 text-[#B0FF00] border-[#B0FF00]/40'
                    : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40'
                }`}>
                  {student.stream === 'Full Stack Development' ? <Code2 className="w-3.5 h-3.5" /> : <Database className="w-3.5 h-3.5" />}
                  {student.stream}
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-zinc-900 text-gray-300 border border-zinc-800">
                  {student.course || student.classSection?.split(' - ')[0] || 'BCA'} • {student.year || 'Year 1'}
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-zinc-900 text-[#B0FF00] border border-zinc-800 font-bold">
                  Sec {student.section || 'A'}
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-zinc-900 text-gray-300 border border-zinc-800">
                  <Laptop className="w-3.5 h-3.5 text-[#B0FF00]" />
                  {student.laptopStatus || (student.hasLaptop ? 'I have laptop' : 'Lab System')}
                </span>
              </div>
            </div>

            {/* Right Metric & Quick Actions */}
            <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-zinc-800">
              <div className="text-left md:text-right">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#B0FF00] glow-text">
                  {completedCount} <span className="text-base text-gray-400 font-normal">/ 18 Days</span>
                </div>
                <p className="text-xs text-gray-400 font-mono">
                  {percentage}% Attendance & Feedback Completed
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadData}
                  title="Refresh status"
                  className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-gray-300 hover:text-[#B0FF00] border border-zinc-800 transition-colors text-xs flex items-center gap-1.5 font-mono"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync</span>
                </button>
                <button
                  onClick={onOpenLookup}
                  className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-gray-300 hover:text-white border border-zinc-800 text-xs font-mono transition-colors"
                >
                  Switch Profile
                </button>
              </div>
            </div>

          </div>

          {/* Progress Bar Component */}
          <div className="mt-6 pt-6 border-t border-zinc-800/80">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-gray-300 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#B0FF00]" />
                Workshop Review Completion Gauge
              </span>
              <span className="text-[#B0FF00] font-bold">
                {percentage}% ({completedCount} of 18 Submitted)
              </span>
            </div>

            <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-zinc-800">
              <div 
                className="h-full bg-gradient-to-r from-[#B0FF00] to-[#39FF14] rounded-full shadow-[0_0_12px_rgba(176,255,0,0.6)] transition-all duration-500"
                style={{ width: `${Math.max(percentage, 2)}%` }}
              />
            </div>
          </div>

        </div>

        {/* 18-Day Interactive Tracker Grid */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#B0FF00]" />
                18-Day Review Grid
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                Tap an open day to fill today's feedback, or tap a completed tile to review your submitted evaluation.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-gray-300">
                <span className="w-3 h-3 rounded-full bg-[#B0FF00] shadow-[0_0_8px_#B0FF00]" />
                <span>Submitted</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400">
                <span className="w-3 h-3 rounded-full border border-[#B0FF00]/60 bg-black" />
                <span>Pending Review</span>
              </div>
            </div>
          </div>

          {/* Grid: 18 Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {WORKSHOP_TOPICS.map((topic) => {
              const isSubmitted = completedDayNumbers.has(topic.day);
              const matchingReview = reviews.find(r => r.day === topic.day);
              const topicTitle = student.stream === 'Full Stack Development' 
                ? topic.fullStackTopic 
                : topic.dataAnalyticsTopic;

              const isUnlockedByAdmin = Boolean(
                feedbackSettings?.globalOpen ||
                feedbackSettings?.unlockedDays?.includes(topic.day) ||
                feedbackSettings?.dayConfigs?.[topic.day]?.isOpen
              );

              return (
                <div
                  key={topic.day}
                  onClick={() => {
                    if (isSubmitted && matchingReview) {
                      setSelectedSubmittedReview({ review: matchingReview, topic });
                    } else {
                      navigate(`/review/${topic.day}`);
                    }
                  }}
                  className={`group relative rounded-xl p-5 border transition-all cursor-pointer select-none ${
                    isSubmitted
                      ? 'bg-[#0d0d0d] border-[#B0FF00]/60 hover:border-[#B0FF00] glow-accent-subtle hover:glow-accent'
                      : isUnlockedByAdmin
                      ? 'bg-black border-[#B0FF00]/40 hover:border-[#B0FF00] hover:bg-zinc-950 shadow-[0_0_15px_rgba(176,255,0,0.08)]'
                      : 'bg-black border-zinc-900 opacity-80 hover:opacity-100 hover:border-zinc-800'
                  }`}
                >
                  
                  {/* Top Bar: Day Header + Status Badge */}
                  <div className="flex items-center justify-between mb-2.5">
                    <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-md border ${
                      isSubmitted
                        ? 'bg-[#B0FF00] text-black border-[#B0FF00]'
                        : isUnlockedByAdmin
                        ? 'bg-black text-[#B0FF00] border-[#B0FF00]/50'
                        : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                    }`}>
                      DAY {topic.day.toString().padStart(2, '0')}
                    </span>

                    {isSubmitted ? (
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-[#B0FF00]">
                        <CheckCircle2 className="w-4 h-4 fill-[#B0FF00] text-black" />
                        <span className="font-bold">{matchingReview?.overallRating}/5 ★</span>
                      </span>
                    ) : isUnlockedByAdmin ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#B0FF00]">
                        <Unlock className="w-3 h-3" />
                        <span>Open for Remarks</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500">
                        <Lock className="w-3 h-3" />
                        <span>Locked by Admin</span>
                      </span>
                    )}
                  </div>

                  {/* Topic Title */}
                  <h3 className="text-sm font-semibold text-white font-sans mb-2 group-hover:text-[#B0FF00] transition-colors line-clamp-2">
                    {topicTitle}
                  </h3>

                  {/* Description Snippet */}
                  <p className="text-xs text-zinc-400 font-sans line-clamp-2 mb-3">
                    {topic.description}
                  </p>

                  {/* Footer state indicator */}
                  <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-500">
                      Module {topic.day} of 18
                    </span>
                    
                    {isSubmitted ? (
                      <span className="text-xs text-[#B0FF00] flex items-center gap-1">
                        <Eye className="w-3 h-3" /> View Summary
                      </span>
                    ) : isUnlockedByAdmin ? (
                      <span className="text-xs text-[#B0FF00] font-semibold flex items-center gap-1">
                        <span>Enter Today's Feedback</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-zinc-500 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Awaiting Unlock
                      </span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Submitted Review Modal Inspector */}
      {selectedSubmittedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0d0d0d] border border-[#B0FF00] rounded-2xl p-6 sm:p-7 glow-accent shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedSubmittedReview(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-zinc-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-5 border-b border-zinc-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-black border border-[#B0FF00] flex items-center justify-center font-mono text-[#B0FF00] font-bold text-base glow-accent">
                {selectedSubmittedReview.review.day}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#B0FF00] uppercase">
                    Submitted Day Review
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#B0FF00]/10 text-[#B0FF00] text-[10px] font-mono">
                    Locked
                  </span>
                </div>
                <h3 className="text-base font-bold text-white font-sans">
                  {student.stream === 'Full Stack Development' 
                    ? selectedSubmittedReview.topic.fullStackTopic 
                    : selectedSubmittedReview.topic.dataAnalyticsTopic}
                </h3>
              </div>
            </div>

            {/* Rating Scores Grid */}
            <div className="space-y-4 text-xs font-mono">
              
              <div className="p-3 bg-black rounded-xl border border-[#B0FF00]/30 flex items-center justify-between">
                <span className="text-gray-300">Overall Day Rating:</span>
                <span className="text-base font-bold text-[#B0FF00] flex items-center gap-1">
                  {selectedSubmittedReview.review.overallRating}/5 ★
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-zinc-300">
                <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">Session Content:</span>
                  <span className="text-[#B0FF00] font-semibold">{selectedSubmittedReview.review.contentRating}/5 ★</span>
                </div>
                <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">Trainer Delivery:</span>
                  <span className="text-[#B0FF00] font-semibold">{selectedSubmittedReview.review.trainerRating}/5 ★</span>
                </div>
                <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">Pace & Flow:</span>
                  <span className="text-[#B0FF00] font-semibold">{selectedSubmittedReview.review.paceRating}/5 ★</span>
                </div>
                <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">Practical Exposure:</span>
                  <span className="text-[#B0FF00] font-semibold">{selectedSubmittedReview.review.practicalRating}/5 ★</span>
                </div>
              </div>

              {/* Liked */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-gray-400">
                  What you liked:
                </label>
                <div className="p-3 bg-black rounded-lg border border-zinc-800 text-gray-200 text-xs font-sans">
                  "{selectedSubmittedReview.review.liked}"
                </div>
              </div>

              {/* Improved */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-gray-400">
                  What could be improved:
                </label>
                <div className="p-3 bg-black rounded-lg border border-zinc-800 text-gray-200 text-xs font-sans">
                  "{selectedSubmittedReview.review.improve}"
                </div>
              </div>

              {/* Recommendation */}
              <div className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 text-xs">
                <span className="text-gray-400">Recommend to friend?</span>
                <span className={`font-bold flex items-center gap-1 ${
                  selectedSubmittedReview.review.recommend ? 'text-[#B0FF00]' : 'text-red-400'
                }`}>
                  {selectedSubmittedReview.review.recommend ? <ThumbsUp className="w-3.5 h-3.5" /> : <ThumbsDown className="w-3.5 h-3.5" />}
                  {selectedSubmittedReview.review.recommend ? 'Yes, Recommended' : 'No'}
                </span>
              </div>

              <div className="text-[10px] text-zinc-500 text-right pt-1">
                Submitted on: {new Date(selectedSubmittedReview.review.submittedAt).toLocaleString()}
              </div>

            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 text-center">
              <button
                onClick={() => setSelectedSubmittedReview(null)}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs py-2.5 rounded-lg border border-zinc-700 transition-colors"
              >
                Close Review
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
