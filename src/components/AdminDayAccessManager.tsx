import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Users, 
  Star, 
  MessageSquare, 
  RefreshCw, 
  Download, 
  Search, 
  Filter, 
  ArrowRight, 
  Sparkles,
  Sliders,
  ShieldCheck,
  Zap,
  Code2,
  Database,
  ThumbsUp,
  ThumbsDown,
  Clock
} from 'lucide-react';
import { 
  getFeedbackSettings, 
  updateDayAccess, 
  toggleAllDaysAccess, 
  subscribeFeedbackSettings,
  getDailyRemarksForDay,
  getAllDailyRemarks
} from '../lib/firebase';
import { 
  FeedbackSettings, 
  WORKSHOP_TOPICS, 
  Student, 
  Review, 
  DailyRemark,
  StreamType,
  CourseType,
  YearType,
  SectionType
} from '../types';

interface AdminDayAccessManagerProps {
  students: Student[];
  reviews: Review[];
  onRefreshData: () => void;
}

export const AdminDayAccessManager: React.FC<AdminDayAccessManagerProps> = ({
  students,
  reviews,
  onRefreshData
}) => {
  const [settings, setSettings] = useState<FeedbackSettings | null>(null);
  const [updatingDay, setUpdatingDay] = useState<number | null>(null);
  const [isBulkUpdating, setIsBulkUpdating] = useState<boolean>(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Inspector Day Selection
  const [selectedDayTab, setSelectedDayTab] = useState<number>(1);
  const [remarksSearch, setRemarksSearch] = useState<string>('');
  const [streamFilter, setStreamFilter] = useState<'ALL' | StreamType>('ALL');
  const [ratingFilter, setRatingFilter] = useState<number | 'ALL'>('ALL');

  useEffect(() => {
    // Real-time listener for instant multi-client feedback settings synchronization
    const unsubscribe = subscribeFeedbackSettings((newSettings) => {
      setSettings(newSettings);
    });

    return () => unsubscribe();
  }, []);

  const handleToggleDay = async (day: number, currentOpen: boolean) => {
    setUpdatingDay(day);
    try {
      const updated = await updateDayAccess(day, !currentOpen);
      setSettings(updated);
      setFeedbackNotice(
        !currentOpen 
          ? `Day ${day} is now OPEN. Students can now submit remarks and feedback for Day ${day}.`
          : `Day ${day} is now LOCKED. Student submissions for Day ${day} are restricted.`
      );
    } catch (err: any) {
      console.error('Failed to toggle day access:', err);
      alert('Error updating day access: ' + (err?.message || 'Firestore connection issue'));
    } finally {
      setUpdatingDay(null);
    }
  };

  const handleBulkToggle = async (openAll: boolean) => {
    const confirmation = window.confirm(
      openAll 
        ? 'Are you sure you want to UNLOCK all 18 days for student feedback and remarks?'
        : 'Are you sure you want to LOCK all 18 days? Students will not be able to submit new feedback until unlocked.'
    );
    if (!confirmation) return;

    setIsBulkUpdating(true);
    try {
      const updated = await toggleAllDaysAccess(openAll);
      setSettings(updated);
      setFeedbackNotice(
        openAll 
          ? 'All 18 workshop days have been UNLOCKED for student remarks.'
          : 'All 18 workshop days are now LOCKED.'
      );
    } catch (err: any) {
      console.error('Failed bulk day toggle:', err);
      alert('Error updating all days access: ' + (err?.message || 'Firestore error'));
    } finally {
      setIsBulkUpdating(false);
    }
  };

  // Compute metrics per day
  const unlockedDaySet = new Set(settings?.unlockedDays || []);

  const getSubmissionsForDay = (day: number) => {
    return reviews.filter(r => r.day === day);
  };

  const getDayAverageRating = (day: number) => {
    const dayRevs = getSubmissionsForDay(day);
    if (dayRevs.length === 0) return 0;
    const sum = dayRevs.reduce((acc, curr) => acc + curr.overallRating, 0);
    return Number((sum / dayRevs.length).toFixed(1));
  };

  // Filtered remarks for inspector
  const activeDayReviews = reviews.filter(r => r.day === selectedDayTab);
  
  const filteredActiveRemarks = activeDayReviews.filter(r => {
    const std = students.find(s => s.id === r.studentId);
    if (streamFilter !== 'ALL') {
      const stream = r.studentStream || std?.stream;
      if (stream !== streamFilter) return false;
    }
    if (ratingFilter !== 'ALL') {
      if (r.overallRating !== ratingFilter) return false;
    }
    if (remarksSearch.trim()) {
      const q = remarksSearch.toLowerCase().trim();
      const stdName = (r.studentName || std?.name || '').toLowerCase();
      const stdId = (r.idCardNo || std?.idCardNo || '').toLowerCase();
      const liked = (r.liked || '').toLowerCase();
      const improve = (r.improve || '').toLowerCase();
      if (!stdName.includes(q) && !stdId.includes(q) && !liked.includes(q) && !improve.includes(q)) {
        return false;
      }
    }
    return true;
  });

  // Export Daily Remarks CSV
  const exportDayRemarksCSV = () => {
    if (activeDayReviews.length === 0) {
      alert(`No remarks submitted yet for Day ${selectedDayTab}.`);
      return;
    }

    const headers = [
      "Day",
      "Student Name",
      "ID Card No",
      "Stream",
      "Course",
      "Section",
      "Overall Rating",
      "Session Remarks / Liked",
      "Doubts / Improvement Suggestions",
      "Recommended",
      "Submitted At"
    ];

    const rows = activeDayReviews.map(r => {
      const std = students.find(s => s.id === r.studentId);
      return [
        `"Day ${r.day}"`,
        `"${r.studentName || std?.name || 'N/A'}"`,
        `"${r.idCardNo || std?.idCardNo || 'N/A'}"`,
        `"${r.studentStream || std?.stream || 'N/A'}"`,
        `"${std?.course || 'N/A'}"`,
        `"${std?.section || 'N/A'}"`,
        `"${r.overallRating}"`,
        `"${(r.liked || '').replace(/"/g, '""')}"`,
        `"${(r.improve || '').replace(/"/g, '""')}"`,
        `"${r.recommend ? 'Yes' : 'No'}"`,
        `"${new Date(r.submittedAt).toLocaleString()}"`
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `chathurya_day_${selectedDayTab}_remarks_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedTopic = WORKSHOP_TOPICS.find(t => t.day === selectedDayTab);
  const isSelectedDayUnlocked = unlockedDaySet.has(selectedDayTab);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner / Switchboard Control Header */}
      <div className="bg-[#0d0d0d] border border-[#B0FF00]/40 rounded-2xl p-6 glow-accent space-y-6">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-[#B0FF00]/10 text-[#B0FF00] border border-[#B0FF00]/30 text-xs font-mono font-bold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                DAILY ACCESS CONTROL SWITCHBOARD
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-[#B0FF00] animate-pulse" />
                Live in Firestore
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-sans">
              Grant & Manage Student Remarks Access by Day
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-2xl">
              Toggle specific days to allow students to submit their session evaluation, remarks, key takeaways, and questions in real-time. Locked days prevent unauthorized or premature submissions.
            </p>
          </div>

          {/* Quick Bulk Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleBulkToggle(true)}
              disabled={isBulkUpdating}
              className="px-3.5 py-2 rounded-xl bg-black border border-[#B0FF00] text-[#B0FF00] hover:bg-[#B0FF00] hover:text-black font-mono text-xs font-bold transition-all glow-accent flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Unlock All 18 Days</span>
            </button>

            <button
              onClick={() => handleBulkToggle(false)}
              disabled={isBulkUpdating}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-gray-300 hover:text-red-400 border border-zinc-700 font-mono text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock All Days</span>
            </button>

            <button
              onClick={onRefreshData}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-gray-400 hover:text-white border border-zinc-800 text-xs transition-colors cursor-pointer"
              title="Refresh submissions"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notice alert */}
        {feedbackNotice && (
          <div className="p-3 bg-[#B0FF00]/10 border border-[#B0FF00]/40 rounded-xl text-xs font-mono text-[#B0FF00] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {feedbackNotice}
            </span>
            <button onClick={() => setFeedbackNotice(null)} className="text-zinc-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* 18-Day Switchboard Grid */}
        <div>
          <div className="flex items-center justify-between mb-3 text-xs font-mono text-zinc-400">
            <span>Day-by-Day Access Switches ({unlockedDaySet.size} of 18 Days Unlocked):</span>
            <span className="text-[#B0FF00]">Click any card button to toggle access instantly</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {WORKSHOP_TOPICS.map((topic) => {
              const isOpen = unlockedDaySet.has(topic.day);
              const isBusy = updatingDay === topic.day || isBulkUpdating;
              const subCount = getSubmissionsForDay(topic.day).length;
              const avgScore = getDayAverageRating(topic.day);

              return (
                <div
                  key={topic.day}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between select-none ${
                    isOpen
                      ? 'bg-[#0a1505] border-[#B0FF00]/60 shadow-[0_0_15px_rgba(176,255,0,0.15)]'
                      : 'bg-black border-zinc-800 opacity-90'
                  }`}
                >
                  <div>
                    {/* Top Row: Day + Status badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                        isOpen ? 'bg-[#B0FF00] text-black' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                      }`}>
                        DAY {topic.day.toString().padStart(2, '0')}
                      </span>

                      <span className={`text-[10px] font-mono flex items-center gap-1 font-bold ${
                        isOpen ? 'text-[#B0FF00]' : 'text-zinc-500'
                      }`}>
                        {isOpen ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                        {isOpen ? 'OPEN' : 'LOCKED'}
                      </span>
                    </div>

                    {/* Topic Short */}
                    <h4 className="text-xs font-semibold text-white font-sans line-clamp-1 mb-1" title={topic.fullStackTopic}>
                      {topic.fullStackTopic}
                    </h4>
                    <p className="text-[10px] text-zinc-400 line-clamp-1 mb-3">
                      {topic.dataAnalyticsTopic}
                    </p>
                  </div>

                  <div>
                    {/* Metrics Bar */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 py-1.5 border-t border-zinc-800/80 mb-2.5">
                      <span>{subCount} Submissions</span>
                      <span className="text-[#B0FF00] font-bold">
                        {avgScore > 0 ? `${avgScore} ★` : '—'}
                      </span>
                    </div>

                    {/* Action Toggle Button */}
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleToggleDay(topic.day, isOpen)}
                      className={`w-full py-1.5 px-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                        isOpen
                          ? 'bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50'
                          : 'bg-black hover:bg-[#B0FF00] text-[#B0FF00] hover:text-black border border-[#B0FF00]/50 glow-accent-subtle'
                      }`}
                    >
                      {isBusy ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : isOpen ? (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>Lock Day</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3 h-3" />
                          <span>Grant Access</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* SECTION 2: Daily Remarks & Student Feedback Viewer */}
      <div className="bg-[#0d0d0d] border border-zinc-800 rounded-2xl p-6 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#B0FF00] uppercase font-bold flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                DAY-WISE STUDENT REMARKS FEED
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                isSelectedDayUnlocked 
                  ? 'bg-[#B0FF00]/10 text-[#B0FF00] border border-[#B0FF00]/40' 
                  : 'bg-red-950/40 text-red-400 border border-red-800/40'
              }`}>
                {isSelectedDayUnlocked ? 'Access Active' : 'Access Locked'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-sans mt-0.5">
              Day {selectedDayTab}: {selectedTopic?.fullStackTopic}
            </h3>
            <p className="text-xs text-zinc-400 font-sans">
              Analytics Track Topic: <span className="text-cyan-400">{selectedTopic?.dataAnalyticsTopic}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportDayRemarksCSV}
              className="px-3.5 py-2 rounded-xl bg-black border border-[#B0FF00] text-[#B0FF00] hover:bg-[#B0FF00] hover:text-black font-mono text-xs font-semibold transition-all glow-accent flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Day {selectedDayTab} CSV</span>
            </button>
          </div>
        </div>

        {/* Day Selector Pill Navigation (Day 1 to 18) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-zinc-800/80 font-mono text-xs scrollbar-none">
          {WORKSHOP_TOPICS.map((topic) => {
            const count = getSubmissionsForDay(topic.day).length;
            const isUnlocked = unlockedDaySet.has(topic.day);
            const isSelected = selectedDayTab === topic.day;

            return (
              <button
                key={topic.day}
                onClick={() => setSelectedDayTab(topic.day)}
                className={`px-3 py-2 rounded-xl shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#B0FF00] text-black font-bold glow-accent shadow-md'
                    : isUnlocked
                    ? 'bg-zinc-900 text-gray-300 hover:text-white hover:bg-zinc-800 border border-zinc-700'
                    : 'bg-black text-zinc-500 hover:text-zinc-400 border border-zinc-900'
                }`}
              >
                <span>D{topic.day}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? 'bg-black text-[#B0FF00]' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filters & Search for this Day */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student name, ID, or remarks..."
              value={remarksSearch}
              onChange={(e) => setRemarksSearch(e.target.value)}
              className="w-full bg-black border border-zinc-800 focus:border-[#B0FF00] rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-zinc-600 outline-none"
            />
          </div>

          <div>
            <select
              value={streamFilter}
              onChange={(e) => setStreamFilter(e.target.value as any)}
              className="w-full bg-black border border-zinc-800 focus:border-[#B0FF00] rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
            >
              <option value="ALL">All Streams</option>
              <option value="Full Stack Development">Full Stack Development</option>
              <option value="Data Analytics">Data Analytics</option>
            </select>
          </div>

          <div>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value, 10))}
              className="w-full bg-black border border-zinc-800 focus:border-[#B0FF00] rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
            >
              <option value="ALL">All Ratings (1 - 5 Stars)</option>
              <option value="5">5 Stars Only (Outstanding)</option>
              <option value="4">4 Stars Only</option>
              <option value="3">3 Stars Only</option>
              <option value="2">2 Stars Only</option>
              <option value="1">1 Star Only</option>
            </select>
          </div>

        </div>

        {/* Student Remarks Feed */}
        {filteredActiveRemarks.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-black rounded-xl border border-zinc-800">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 mx-auto flex items-center justify-center text-zinc-500">
              <MessageSquare className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-zinc-300 font-sans">
              No Remarks Recorded for Day {selectedDayTab} Yet
            </p>
            <p className="text-xs text-zinc-500 font-mono max-w-md mx-auto">
              {isSelectedDayUnlocked
                ? 'Access is currently open. Once students complete today\'s workshop session and submit remarks, their responses will populate here live.'
                : 'Day access is currently locked. Click "Grant Access" above to enable students to submit remarks for Day ' + selectedDayTab + '.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>Showing {filteredActiveRemarks.length} student submission(s):</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredActiveRemarks.map((rev) => {
                const std = students.find(s => s.id === rev.studentId);
                const stream = rev.studentStream || std?.stream || 'Full Stack Development';

                return (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl bg-black border border-zinc-800 hover:border-[#B0FF00]/40 transition-all space-y-3"
                  >
                    {/* Card Header: Student identity & rating */}
                    <div className="flex items-start justify-between gap-2 border-b border-zinc-900 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white font-sans">
                            {rev.studentName || std?.name || 'Student'}
                          </h4>
                          <span className="text-xs font-mono text-zinc-400">
                            ({rev.idCardNo || std?.idCardNo || 'N/A'})
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 pt-0.5 text-[11px] font-mono">
                          <span className={`px-1.5 py-0.2 rounded border ${
                            stream === 'Full Stack Development'
                              ? 'bg-[#B0FF00]/10 text-[#B0FF00] border-[#B0FF00]/30'
                              : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                          }`}>
                            {stream}
                          </span>
                          <span className="text-zinc-500">
                            {std?.course || 'BCA'} • Sec {std?.section || 'A'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-[#B0FF00] font-mono font-bold text-xs">
                          {rev.overallRating}/5 ★
                        </span>
                        <div className="text-[10px] text-zinc-500 font-mono mt-1 flex items-center gap-1 justify-end">
                          {rev.recommend ? (
                            <span className="text-[#B0FF00] flex items-center gap-0.5">
                              <ThumbsUp className="w-2.5 h-2.5" /> Recommends
                            </span>
                          ) : (
                            <span className="text-red-400 flex items-center gap-0.5">
                              <ThumbsDown className="w-2.5 h-2.5" /> Neutral/No
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Remarks Body */}
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-0.5">
                          Daily Feedback / Session Remarks:
                        </span>
                        <p className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-gray-200 font-sans leading-relaxed">
                          "{rev.liked}"
                        </p>
                      </div>

                      {rev.improve && rev.improve.toLowerCase() !== 'none' && (
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-0.5">
                            Questions / Suggestions for Trainer:
                          </span>
                          <p className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 font-sans leading-relaxed">
                            "{rev.improve}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer timestamp */}
                    <div className="text-[10px] font-mono text-zinc-500 flex items-center justify-between pt-1 border-t border-zinc-900">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(rev.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>{new Date(rev.submittedAt).toLocaleDateString()}</span>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
