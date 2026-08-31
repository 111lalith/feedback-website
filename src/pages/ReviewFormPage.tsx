import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown, 
  Star, 
  Code2, 
  Database,
  Calendar,
  Lock,
  MessageSquarePlus,
  Send
} from 'lucide-react';
import { StarRating } from '../components/StarRating';
import { 
  getLocalStudentId, 
  getStudent, 
  getStudentReviews, 
  submitReview 
} from '../lib/firebase';
import { Student, Review, WORKSHOP_TOPICS, DayTopic } from '../types';

interface ReviewFormPageProps {
  onOpenLookup: () => void;
}

export const ReviewFormPage: React.FC<ReviewFormPageProps> = ({ onOpenLookup }) => {
  const { day } = useParams<{ day: string }>();
  const navigate = useNavigate();
  const dayNumber = parseInt(day || '1', 10);

  const [student, setStudent] = useState<Student | null>(null);
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Form State
  const [overallRating, setOverallRating] = useState<number>(5);
  const [liked, setLiked] = useState<string>('');
  const [improve, setImprove] = useState<string>('');
  const [recommend, setRecommend] = useState<boolean>(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  // Find Day metadata
  const currentTopic: DayTopic = WORKSHOP_TOPICS.find(t => t.day === dayNumber) || {
    day: dayNumber,
    fullStackTopic: `Day ${dayNumber} Curriculum Module`,
    dataAnalyticsTopic: `Day ${dayNumber} Analytics Module`,
    fullStackDetail: "Full Stack Workshop Module",
    dataAnalyticsDetail: "Data Analytics Workshop Module",
    description: "Daily workshop session evaluation."
  };

  useEffect(() => {
    const studentId = getLocalStudentId();
    if (!studentId) {
      setLoading(false);
      return;
    }

    const init = async () => {
      try {
        const studentData = await getStudent(studentId);
        if (studentData) {
          setStudent(studentData);
          const studentReviews = await getStudentReviews(studentId);
          const currentDayRev = studentReviews.find(r => r.day === dayNumber);
          if (currentDayRev) {
            setExistingReview(currentDayRev);
          }
        }
      } catch (err) {
        console.error('Error fetching review context:', err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [dayNumber]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!overallRating) errs.overall = 'Please select overall day satisfaction rating';

    if (!liked.trim()) {
      errs.liked = 'Please write at least a brief comment on what you liked';
    } else if (liked.trim().length < 3) {
      errs.liked = 'Please provide a little more detail';
    }

    if (!improve.trim()) {
      errs.improve = 'Please note what could be improved or type "None"';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;
    if (!validate()) return;

    setSubmitting(true);
    setServerError(null);

    try {
      await submitReview({
        studentId: student.id,
        day: dayNumber,
        overallRating,
        liked: liked.trim(),
        improve: improve.trim(),
        recommend,
        studentName: student.name,
        studentStream: student.stream,
        idCardNo: student.idCardNo
      });

      // Joyful celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#B0FF00', '#39FF14', '#ffffff', '#22d3ee']
        });
      } catch (e) {
        // Safe fallback
      }

      setSubmittedSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1600);
    } catch (err: any) {
      console.error('Submit review failed:', err);
      setServerError(err?.message || 'Unable to submit review to Firestore. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-xl bg-black border-2 border-[#B0FF00] flex items-center justify-center glow-accent animate-pulse mb-4">
          <Terminal className="w-6 h-6 text-[#B0FF00]" />
        </div>
        <p className="font-mono text-sm text-[#B0FF00]">Loading Day {dayNumber} Feedback Portal...</p>
      </div>
    );
  }

  // Not enrolled or no student in local storage
  if (!student) {
    return (
      <div className="min-h-screen bg-black py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center space-y-6 bg-[#0d0d0d] border border-[#B0FF00]/40 rounded-2xl p-8 glow-accent">
          <div className="w-12 h-12 rounded-xl bg-black border border-red-500/60 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white font-sans">
            Student Identity Required
          </h2>
          <p className="text-xs text-gray-400 font-sans">
            You must register or load your student profile before submitting Day {dayNumber}'s review.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Link
              to="/register"
              className="bg-black border border-[#B0FF00] text-[#B0FF00] font-mono text-xs py-2.5 px-4 rounded-xl glow-accent"
            >
              Register as Student
            </Link>
            <button
              onClick={onOpenLookup}
              className="bg-zinc-900 text-gray-300 font-mono text-xs py-2.5 px-4 rounded-xl border border-zinc-800"
            >
              Find Existing Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  const topicTitle = student.stream === 'Full Stack Development' 
    ? currentTopic.fullStackTopic 
    : currentTopic.dataAnalyticsTopic;

  // Already submitted state
  if (existingReview) {
    return (
      <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6">
          
          <div className="flex items-center justify-between font-mono text-xs text-gray-400">
            <Link to="/dashboard" className="hover:text-[#B0FF00] flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to 18-Day Tracker
            </Link>
            <span className="text-[#B0FF00]">Day {dayNumber} Evaluation</span>
          </div>

          <div className="bg-[#0d0d0d] border border-[#B0FF00] rounded-2xl p-6 sm:p-8 glow-accent shadow-2xl space-y-6">
            
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <div className="w-12 h-12 rounded-xl bg-black border border-[#B0FF00] flex items-center justify-center font-mono text-[#B0FF00] font-bold text-lg glow-accent">
                {dayNumber}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#B0FF00] uppercase">Review Recorded</span>
                  <span className="px-2 py-0.5 rounded bg-[#B0FF00]/10 text-[#B0FF00] text-[10px] font-mono border border-[#B0FF00]/30 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Submitted & Locked
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-white font-sans mt-0.5">
                  {topicTitle}
                </h1>
              </div>
            </div>

            <div className="p-4 bg-black rounded-xl border border-zinc-800 flex items-center justify-between text-xs font-mono">
              <span className="text-gray-400">Overall Satisfaction Score:</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[#B0FF00] font-bold text-sm">{existingReview.overallRating}/5 ★</span>
                <span className="text-zinc-500 text-[11px]">
                  {existingReview.overallRating === 5 ? '(Outstanding)' : existingReview.overallRating === 4 ? '(Very Good)' : '(Good)'}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="font-mono text-zinc-500 uppercase tracking-wider text-[11px] mb-1">What you liked:</p>
                <p className="p-3 bg-black rounded-lg border border-zinc-800 text-gray-200 font-sans">
                  "{existingReview.liked}"
                </p>
              </div>

              <div>
                <p className="font-mono text-zinc-500 uppercase tracking-wider text-[11px] mb-1">What could be improved:</p>
                <p className="p-3 bg-black rounded-lg border border-zinc-800 text-gray-200 font-sans">
                  "{existingReview.improve}"
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-zinc-500">
                Submitted by {student.name} ({student.idCardNo})
              </span>
              <Link
                to="/dashboard"
                className="bg-black border border-[#B0FF00] text-[#B0FF00] hover:bg-[#B0FF00] hover:text-black font-mono text-xs py-2 px-4 rounded-lg transition-all glow-accent"
              >
                Return to Tracker
              </Link>
            </div>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between font-mono text-xs text-gray-400">
          <Link to="/dashboard" className="hover:text-[#B0FF00] flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to 18-Day Grid
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[#B0FF00]">{student.name.split(' ')[0]}</span>
            <span className="text-zinc-600">|</span>
            <span className="text-gray-300">{student.idCardNo}</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-[#0d0d0d] border border-[#B0FF00]/40 rounded-2xl p-6 sm:p-8 glow-accent shadow-2xl relative">
          
          {/* Day Topic Banner */}
          <div className="border-b border-zinc-800 pb-5 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#B0FF00]/10 border border-[#B0FF00]/30 text-[11px] font-mono text-[#B0FF00]">
                <Calendar className="w-3.5 h-3.5" />
                <span>DAY {dayNumber.toString().padStart(2, '0')} EVALUATION</span>
              </div>
              
              <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                {student.stream === 'Full Stack Development' ? <Code2 className="w-3.5 h-3.5" /> : <Database className="w-3.5 h-3.5" />}
                {student.stream}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-sans tracking-tight">
              {topicTitle}
            </h1>
            
            <p className="text-xs text-zinc-400 font-sans mt-1.5 leading-relaxed">
              {currentTopic.description}
            </p>
          </div>

          {serverError && (
            <div className="mb-6 flex items-start gap-3 bg-red-950/40 border border-red-500/50 rounded-xl p-4 text-xs text-red-200">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {submittedSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#B0FF00]/20 border-2 border-[#B0FF00] mx-auto flex items-center justify-center glow-accent-lg animate-bounce">
                <CheckCircle2 className="w-8 h-8 text-[#B0FF00]" />
              </div>
              <h2 className="text-2xl font-bold text-white font-sans">
                Day {dayNumber} Review Submitted!
              </h2>
              <p className="text-sm font-mono text-gray-400">
                Thank you, {student.name}. Updating your 18-day tracker matrix...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Overall Day Rating */}
              <div className="p-5 rounded-xl bg-zinc-950 border border-[#B0FF00]/40 glow-accent-subtle">
                <StarRating
                  label="Overall Day Satisfaction Score"
                  sublabel="Taking everything into consideration, how would you rate today's complete session?"
                  value={overallRating}
                  onChange={setOverallRating}
                  size="lg"
                  required
                />
                {errors.overall && (
                  <span className="text-red-400 text-xs font-mono mt-1 block">{errors.overall}</span>
                )}
              </div>

              {/* Qualitative Feedback 1: What did you like */}
              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>What did you like the most about today's session? <span className="text-[#B0FF00]">*</span></span>
                  {errors.liked && (
                    <span className="text-red-400 text-[11px] font-mono lowercase">{errors.liked}</span>
                  )}
                </label>
                <textarea
                  rows={3}
                  value={liked}
                  onChange={(e) => {
                    setLiked(e.target.value);
                    if (errors.liked) setErrors(prev => ({ ...prev, liked: '' }));
                  }}
                  placeholder="e.g. The live interactive coding challenge was awesome, and the trainer clarified async promises with very intuitive diagrams..."
                  className={`w-full bg-black border ${
                    errors.liked ? 'border-red-500' : 'border-zinc-700'
                  } focus:border-[#B0FF00] focus:ring-1 focus:ring-[#B0FF00] rounded-xl p-3.5 text-sm text-white placeholder-zinc-600 outline-none transition-all font-sans`}
                />
              </div>

              {/* Qualitative Feedback 2: What could be improved */}
              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>What could be improved or clarified tomorrow? <span className="text-[#B0FF00]">*</span></span>
                  {errors.improve && (
                    <span className="text-red-400 text-[11px] font-mono lowercase">{errors.improve}</span>
                  )}
                </label>
                <textarea
                  rows={3}
                  value={improve}
                  onChange={(e) => {
                    setImprove(e.target.value);
                    if (errors.improve) setErrors(prev => ({ ...prev, improve: '' }));
                  }}
                  placeholder="e.g. Give 5 more minutes before moving to the next exercise / Share starter repository link ahead of time..."
                  className={`w-full bg-black border ${
                    errors.improve ? 'border-red-500' : 'border-zinc-700'
                  } focus:border-[#B0FF00] focus:ring-1 focus:ring-[#B0FF00] rounded-xl p-3.5 text-sm text-white placeholder-zinc-600 outline-none transition-all font-sans`}
                />
              </div>

              {/* Net Promoter: Would you recommend */}
              <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2">
                <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider">
                  Would you recommend today's session to a fellow student? <span className="text-[#B0FF00]">*</span>
                </label>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setRecommend(true)}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-mono text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      recommend === true
                        ? 'bg-zinc-950 border-[#B0FF00] text-[#B0FF00] font-bold glow-accent-subtle'
                        : 'bg-black border-zinc-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Yes, Highly Recommended</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRecommend(false)}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-mono text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      recommend === false
                        ? 'bg-zinc-950 border-red-500 text-red-400 font-bold'
                        : 'bg-black border-zinc-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>No, Needs Improvement</span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-zinc-800">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-black border-2 border-[#B0FF00] text-[#B0FF00] hover:bg-[#B0FF00] hover:text-black font-mono font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all glow-accent cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="animate-pulse flex items-center gap-2 font-mono">
                      <Terminal className="w-4 h-4 animate-spin" />
                      Recording Day {dayNumber} Review in Firestore...
                    </span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Day {dayNumber} Review & Update Tracker</span>
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-zinc-500 font-mono mt-3">
                  This submission will be locked and saved under your student profile ({student.idCardNo}).
                </p>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
