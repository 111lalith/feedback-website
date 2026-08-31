import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Star, 
  Code2, 
  Database, 
  Laptop, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  LogOut, 
  RefreshCw, 
  ThumbsUp, 
  Eye, 
  X, 
  Plus, 
  Terminal, 
  TrendingUp, 
  ChevronRight, 
  MessageSquare,
  Sparkles,
  BarChart3,
  ListFilter,
  Trash2,
  History,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  getAllStudents, 
  getAllReviews, 
  isAdminAuthenticated, 
  logoutAdmin, 
  seedSampleData,
  getStudentReviews,
  deleteStudent,
  clearEntireDatabase
} from '../lib/firebase';
import { 
  Student, 
  Review, 
  WORKSHOP_TOPICS, 
  StreamType,
  CourseType,
  YearType,
  SectionType,
  LaptopStatusType,
  COURSES,
  YEARS,
  SECTIONS,
  LAPTOP_OPTIONS
} from '../types';
import { ChathuryaLogo } from '../components/ChathuryaLogo';
import { HistoryArchiveView } from '../components/HistoryArchiveView';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState<Student[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [seeding, setSeeding] = useState<boolean>(false);
  const [seedNotice, setSeedNotice] = useState<string | null>(null);

  // Active Tab: 'analytics' | 'students' | 'day_feedback' | 'data_tools' | 'history'
  const [activeTab, setActiveTab] = useState<'analytics' | 'students' | 'day_feedback' | 'data_tools' | 'history'>('analytics');

  // Deletion & Safety States
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeletingStudent, setIsDeletingStudent] = useState<boolean>(false);
  const [showClearDbModal, setShowClearDbModal] = useState<boolean>(false);
  const [clearDbInput, setClearDbInput] = useState<string>('');
  const [isClearingDb, setIsClearingDb] = useState<boolean>(false);

  // Student Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState<'ALL' | CourseType>('ALL');
  const [yearFilter, setYearFilter] = useState<'ALL' | YearType>('ALL');
  const [sectionFilter, setSectionFilter] = useState<'ALL' | SectionType>('ALL');
  const [streamFilter, setStreamFilter] = useState<'ALL' | StreamType>('ALL');
  const [laptopFilter, setLaptopFilter] = useState<'ALL' | LaptopStatusType>('ALL');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<{ student: Student; reviews: Review[] } | null>(null);

  // Day Feedback Filter State
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [dayCourseFilter, setDayCourseFilter] = useState<'ALL' | CourseType>('ALL');
  const [dayYearFilter, setDayYearFilter] = useState<'ALL' | YearType>('ALL');
  const [daySectionFilter, setDaySectionFilter] = useState<'ALL' | SectionType>('ALL');
  const [dayStreamFilter, setDayStreamFilter] = useState<'ALL' | StreamType>('ALL');
  const [dayFeedbackSearch, setDayFeedbackSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allStudents, allReviews] = await Promise.all([
        getAllStudents(),
        getAllReviews()
      ]);
      setStudents(allStudents);
      setReviews(allReviews);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login');
  };

  const handleSeed = async () => {
    if (window.confirm('Do you want to seed sample student registrations and multi-day reviews into Firestore? This will enrich the analytics charts immediately.')) {
      setSeeding(true);
      try {
        const res = await seedSampleData();
        setSeedNotice(`Successfully populated ${res.studentsCount} students and ${res.reviewsCount} daily reviews!`);
        await fetchData();
      } catch (e: any) {
        setSeedNotice(`Seeding error: ${e?.message || 'Failed'}`);
      } finally {
        setSeeding(false);
      }
    }
  };

  const handleConfirmDeleteStudent = async () => {
    if (!studentToDelete) return;
    setIsDeletingStudent(true);
    try {
      await deleteStudent(studentToDelete.id);
      setSeedNotice(`Student "${studentToDelete.name}" (${studentToDelete.idCardNo}) deleted and archived into history.`);
      setStudentToDelete(null);
      if (selectedStudentForModal?.student.id === studentToDelete.id) {
        setSelectedStudentForModal(null);
      }
      await fetchData();
    } catch (err: any) {
      console.error('Delete student failed:', err);
      alert('Error deleting student: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsDeletingStudent(false);
    }
  };

  const handleConfirmClearDatabase = async () => {
    if (clearDbInput.trim().toUpperCase() !== 'CLEAR') {
      alert('Please type CLEAR exactly to confirm database wipe.');
      return;
    }

    setIsClearingDb(true);
    try {
      const res = await clearEntireDatabase();
      setSeedNotice(`Database cleared! Archived ${res.studentsCount} students and ${res.reviewsCount} reviews to history.`);
      setShowClearDbModal(false);
      setClearDbInput('');
      setSelectedStudentForModal(null);
      await fetchData();
    } catch (err: any) {
      console.error('Clear database failed:', err);
      alert('Error clearing database: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsClearingDb(false);
    }
  };

  // --- Computations ---
  const totalStudents = students.length;
  const totalReviews = reviews.length;
  
  const fullStackCount = students.filter(s => s.stream === 'Full Stack Development').length;
  const dataAnalyticsCount = students.filter(s => s.stream === 'Data Analytics').length;
  
  const avgOverallRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.overallRating, 0) / totalReviews).toFixed(2)
    : '0.0';

  const recommendRate = totalReviews > 0
    ? Math.round((reviews.filter(r => r.recommend).length / totalReviews) * 100)
    : 0;

  // Student reviews map for quick progress lookup
  const reviewsByStudentId = useMemo(() => {
    const map: Record<string, Review[]> = {};
    for (const r of reviews) {
      if (!map[r.studentId]) map[r.studentId] = [];
      map[r.studentId].push(r);
    }
    return map;
  }, [reviews]);

  // Day-wise submission and average ratings data for Recharts
  const dayStatsData = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => i + 1).map(dayNum => {
      const dayReviews = reviews.filter(r => r.day === dayNum);
      const fsReviews = dayReviews.filter(r => {
        const std = students.find(s => s.id === r.studentId);
        return (r.studentStream || std?.stream) === 'Full Stack Development';
      });
      const daReviews = dayReviews.filter(r => {
        const std = students.find(s => s.id === r.studentId);
        return (r.studentStream || std?.stream) === 'Data Analytics';
      });

      const count = dayReviews.length;
      const avgOverall = count > 0 ? Number((dayReviews.reduce((a, b) => a + b.overallRating, 0) / count).toFixed(2)) : 0;
      const avgContent = count > 0 ? Number((dayReviews.reduce((a, b) => a + b.contentRating, 0) / count).toFixed(2)) : 0;
      const avgTrainer = count > 0 ? Number((dayReviews.reduce((a, b) => a + b.trainerRating, 0) / count).toFixed(2)) : 0;
      const avgPace = count > 0 ? Number((dayReviews.reduce((a, b) => a + b.paceRating, 0) / count).toFixed(2)) : 0;
      const avgPractical = count > 0 ? Number((dayReviews.reduce((a, b) => a + b.practicalRating, 0) / count).toFixed(2)) : 0;

      return {
        day: `Day ${dayNum}`,
        dayNum,
        submissions: count,
        fullStack: fsReviews.length,
        dataAnalytics: daReviews.length,
        avgOverall,
        avgContent,
        avgTrainer,
        avgPace,
        avgPractical
      };
    });
  }, [reviews, students]);

  // Breakdown by 3 Laptop options
  const laptopHaveCount = students.filter(s => s.laptopStatus === 'I have laptop' || (s.hasLaptop && !s.laptopStatus)).length;
  const laptopNoCount = students.filter(s => s.laptopStatus === "I don't have laptop" || (!s.hasLaptop && !s.laptopStatus)).length;
  const laptopHomeCount = students.filter(s => s.laptopStatus === 'I have at home').length;

  // Stream breakdown pie data
  const streamPieData = [
    { name: 'Full Stack Dev', value: fullStackCount || 0, color: '#B0FF00' },
    { name: 'Data Analytics', value: dataAnalyticsCount || 0, color: '#22d3ee' }
  ];

  // Laptop pie data (3 options)
  const laptopPieData = [
    { name: 'I have laptop', value: laptopHaveCount || 0, color: '#B0FF00' },
    { name: "I don't have laptop", value: laptopNoCount || 0, color: '#f87171' },
    { name: 'I have at home', value: laptopHomeCount || 0, color: '#38bdf8' }
  ].filter(item => item.value > 0 || totalStudents === 0);

  // Course distribution data
  const courseStatsData = useMemo(() => {
    return COURSES.map(courseName => {
      const count = students.filter(s => s.course === courseName || s.classSection?.startsWith(courseName)).length;
      return { name: courseName, count };
    });
  }, [students]);

  // Filtered Students List
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = q === '' || 
        student.name.toLowerCase().includes(q) ||
        student.idCardNo.toLowerCase().includes(q) ||
        student.email.toLowerCase().includes(q) ||
        (student.course && student.course.toLowerCase().includes(q)) ||
        (student.year && student.year.toLowerCase().includes(q)) ||
        (student.section && student.section.toLowerCase().includes(q)) ||
        (student.classSection && student.classSection.toLowerCase().includes(q));

      const matchesCourse = courseFilter === 'ALL' || student.course === courseFilter || (student.classSection && student.classSection.startsWith(courseFilter));
      const matchesYear = yearFilter === 'ALL' || student.year === yearFilter || (student.classSection && student.classSection.includes(yearFilter));
      const matchesSection = sectionFilter === 'ALL' || student.section === sectionFilter || (student.classSection && student.classSection.includes(`Sec ${sectionFilter}`));
      const matchesStream = streamFilter === 'ALL' || student.stream === streamFilter;
      
      const studentLaptop = student.laptopStatus || (student.hasLaptop ? 'I have laptop' : "I don't have laptop");
      const matchesLaptop = laptopFilter === 'ALL' || studentLaptop === laptopFilter;

      return matchesSearch && matchesCourse && matchesYear && matchesSection && matchesStream && matchesLaptop;
    });
  }, [students, searchQuery, courseFilter, yearFilter, sectionFilter, streamFilter, laptopFilter]);

  // Day Reviews List for selected day with full filters
  const selectedDayReviews = useMemo(() => {
    return reviews.filter(r => {
      if (r.day !== selectedDay) return false;
      const std = students.find(s => s.id === r.studentId);
      
      if (dayStreamFilter !== 'ALL') {
        const stream = r.studentStream || std?.stream;
        if (stream !== dayStreamFilter) return false;
      }

      if (dayCourseFilter !== 'ALL') {
        const course = std?.course || (std?.classSection?.startsWith(dayCourseFilter) ? dayCourseFilter : undefined);
        if (course !== dayCourseFilter) return false;
      }

      if (dayYearFilter !== 'ALL') {
        const year = std?.year || (std?.classSection?.includes(dayYearFilter) ? dayYearFilter : undefined);
        if (year !== dayYearFilter) return false;
      }

      if (daySectionFilter !== 'ALL') {
        const sec = std?.section || (std?.classSection?.includes(`Sec ${daySectionFilter}`) ? daySectionFilter : undefined);
        if (sec !== daySectionFilter) return false;
      }

      if (dayFeedbackSearch.trim() !== '') {
        const q = dayFeedbackSearch.toLowerCase().trim();
        const stdName = (r.studentName || std?.name || '').toLowerCase();
        const stdId = (r.idCardNo || std?.idCardNo || '').toLowerCase();
        const likedText = (r.liked || '').toLowerCase();
        const improveText = (r.improve || '').toLowerCase();
        if (!stdName.includes(q) && !stdId.includes(q) && !likedText.includes(q) && !improveText.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [reviews, selectedDay, dayStreamFilter, dayCourseFilter, dayYearFilter, daySectionFilter, dayFeedbackSearch, students]);

  // Export CSV functions
  const exportStudentsCSV = () => {
    if (students.length === 0) {
      alert('No student records to export.');
      return;
    }
    const headers = ["Student ID", "Full Name", "ID Card No", "Phone", "Email", "Course", "Year", "Section", "Class Section", "Stream", "Laptop Availability", "Submitted Days Count", "Registered At"];
    const rows = students.map(s => {
      const stdReviews = reviewsByStudentId[s.id] || [];
      const laptopStatusDisplay = s.laptopStatus || (s.hasLaptop ? 'I have laptop' : "I don't have laptop");
      return [
        `"${s.id}"`,
        `"${s.name}"`,
        `"${s.idCardNo}"`,
        `"${s.phone}"`,
        `"${s.email}"`,
        `"${s.course || 'BCA'}"`,
        `"${s.year || 'Year 1'}"`,
        `"${s.section || 'A'}"`,
        `"${s.classSection}"`,
        `"${s.stream}"`,
        `"${laptopStatusDisplay}"`,
        `"${stdReviews.length}/18"`,
        `"${new Date(s.registeredAt).toLocaleString()}"`
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `chathurya_students_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportReviewsCSV = () => {
    if (reviews.length === 0) {
      alert('No reviews to export.');
      return;
    }
    const headers = ["Review ID", "Student Name", "ID Card No", "Course", "Year", "Section", "Stream", "Day", "Overall Rating", "Content Rating", "Trainer Rating", "Pace Rating", "Practical Rating", "Recommend", "Liked", "Improve", "Submitted At"];
    const rows = reviews.map(r => {
      const std = students.find(s => s.id === r.studentId);
      return [
        `"${r.id}"`,
        `"${r.studentName || std?.name || 'N/A'}"`,
        `"${r.idCardNo || std?.idCardNo || 'N/A'}"`,
        `"${std?.course || 'N/A'}"`,
        `"${std?.year || 'N/A'}"`,
        `"${std?.section || 'N/A'}"`,
        `"${r.studentStream || std?.stream || 'N/A'}"`,
        `"${r.day}"`,
        `"${r.overallRating}"`,
        `"${r.contentRating}"`,
        `"${r.trainerRating}"`,
        `"${r.paceRating}"`,
        `"${r.practicalRating}"`,
        `"${r.recommend ? 'Yes' : 'No'}"`,
        `"${(r.liked || '').replace(/"/g, '""')}"`,
        `"${(r.improve || '').replace(/"/g, '""')}"`,
        `"${new Date(r.submittedAt).toLocaleString()}"`
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `chathurya_reviews_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openStudentDossier = (student: Student) => {
    const studentRevs = reviewsByStudentId[student.id] || [];
    setSelectedStudentForModal({ student, reviews: studentRevs.sort((a, b) => a.day - b.day) });
  };

  return (
    <div className="min-h-screen bg-black text-[#EAEAEA] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Admin Header Bar */}
        <div className="bg-[#0d0d0d] border border-[#B0FF00]/40 rounded-2xl p-5 sm:p-6 glow-accent flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <ChathuryaLogo size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#B0FF00]/10 text-[#B0FF00] border border-[#B0FF00]/30 text-[10px] font-mono font-bold">
                  ADMIN COMMAND CENTER
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white font-sans mt-0.5">
                Workshop Review Intelligence
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-gray-300 hover:text-[#B0FF00] border border-zinc-800 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Refresh dataset from Firestore"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#B0FF00]' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={exportStudentsCSV}
              className="px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-gray-300 hover:text-white border border-zinc-800 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#B0FF00]" />
              <span>Export Students</span>
            </button>

            <button
              onClick={exportReviewsCSV}
              className="px-3.5 py-2.5 rounded-xl bg-black border border-[#B0FF00] text-[#B0FF00] hover:bg-[#B0FF00] hover:text-black text-xs font-mono font-semibold transition-all glow-accent flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Reviews</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-900/40 text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer"
              title="Sign Out Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Seed Notification Banner */}
        {seedNotice && (
          <div className="flex items-center justify-between p-3.5 bg-[#B0FF00]/10 border border-[#B0FF00]/40 rounded-xl text-xs font-mono text-[#B0FF00]">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {seedNotice}
            </span>
            <button onClick={() => setSeedNotice(null)} className="text-zinc-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Key Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <div className="bg-[#0d0d0d] border border-zinc-800 p-4 rounded-xl space-y-1">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">Registered</span>
            <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-1">
              {totalStudents} <span className="text-xs text-zinc-500 font-normal">/ ~200</span>
            </div>
            <span className="text-[10px] font-mono text-[#B0FF00]">Enrolled Cohort</span>
          </div>

          <div className="bg-[#0d0d0d] border border-zinc-800 p-4 rounded-xl space-y-1">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">Total Reviews</span>
            <div className="text-2xl font-bold font-mono text-[#B0FF00] glow-text">
              {totalReviews}
            </div>
            <span className="text-[10px] font-mono text-zinc-400">18-Day Submissions</span>
          </div>

          <div className="bg-[#0d0d0d] border border-zinc-800 p-4 rounded-xl space-y-1">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">Avg Satisfaction</span>
            <div className="text-2xl font-bold font-mono text-[#B0FF00]">
              {avgOverallRating} <span className="text-xs text-zinc-500 font-normal">/ 5.0</span>
            </div>
            <span className="text-[10px] font-mono text-[#B0FF00]">Overall Quality</span>
          </div>

          <div className="bg-[#0d0d0d] border border-zinc-800 p-4 rounded-xl space-y-1">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">Recommend Rate</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {recommendRate}%
            </div>
            <span className="text-[10px] font-mono text-zinc-400">Peer NPS Score</span>
          </div>

          <div className="bg-[#0d0d0d] border border-zinc-800 p-4 rounded-xl space-y-1">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">Track Split</span>
            <div className="text-xs font-mono space-y-0.5 pt-1">
              <div className="text-[#B0FF00] flex justify-between">
                <span>Full Stack:</span> <strong>{fullStackCount}</strong>
              </div>
              <div className="text-cyan-400 flex justify-between">
                <span>Data Analytics:</span> <strong>{dataAnalyticsCount}</strong>
              </div>
            </div>
          </div>

          <div className="bg-[#0d0d0d] border border-zinc-800 p-4 rounded-xl space-y-1">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">Laptop Status (3 Types)</span>
            <div className="text-xs font-mono space-y-0.5 pt-1">
              <div className="text-emerald-400 flex justify-between">
                <span>I have laptop:</span> <strong>{laptopHaveCount}</strong>
              </div>
              <div className="text-red-400 flex justify-between">
                <span>No laptop:</span> <strong>{laptopNoCount}</strong>
              </div>
              <div className="text-sky-400 flex justify-between">
                <span>At home:</span> <strong>{laptopHomeCount}</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto font-mono text-xs">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-[#B0FF00] text-black font-bold glow-accent'
                : 'text-gray-400 hover:text-white bg-zinc-950'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Visual Analytics & Trends</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'students'
                ? 'bg-[#B0FF00] text-black font-bold glow-accent'
                : 'text-gray-400 hover:text-white bg-zinc-950'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Student Directory ({filteredStudents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('day_feedback')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'day_feedback'
                ? 'bg-[#B0FF00] text-black font-bold glow-accent'
                : 'text-gray-400 hover:text-white bg-zinc-950'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Day-wise Feedback Explorer</span>
          </button>

          <button
            onClick={() => setActiveTab('data_tools')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'data_tools'
                ? 'bg-[#B0FF00] text-black font-bold glow-accent'
                : 'text-gray-400 hover:text-white bg-zinc-950'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Data Operations</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#B0FF00] text-black font-bold glow-accent'
                : 'text-gray-400 hover:text-white bg-zinc-950'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History & Archive</span>
          </button>
        </div>

        {/* TAB 1: VISUAL ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* Chart 1: Daily Submissions Bar Chart */}
            <div className="bg-[#0d0d0d] border border-zinc-800 p-6 rounded-2xl glow-accent-subtle space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#B0FF00]" />
                    Daily Submissions Volume (Day 1 - 18)
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    Total volume of feedback logged per day across Full Stack and Data Analytics tracks.
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-[#B0FF00]">
                    <span className="w-3 h-3 rounded bg-[#B0FF00]" /> Full Stack
                  </span>
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <span className="w-3 h-3 rounded bg-cyan-400" /> Data Analytics
                  </span>
                </div>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dayStatsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
                    <XAxis dataKey="day" stroke="#888888" fontSize={11} tickLine={false} />
                    <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000000', borderColor: '#B0FF00', borderRadius: '8px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}
                      cursor={{ fill: 'rgba(176,255,0,0.05)' }}
                    />
                    <Bar dataKey="fullStack" name="Full Stack Dev" fill="#B0FF00" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="dataAnalytics" name="Data Analytics" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom 2 mini pies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-[#0d0d0d] border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white font-sans mb-1">
                    Track Distribution
                  </h4>
                  <p className="text-xs text-zinc-400 font-mono">
                    Cohort split between Full Stack and Data Analytics.
                  </p>
                </div>

                <div className="h-48 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={streamPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {streamPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333', fontSize: '11px' }} />
                      <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#0d0d0d] border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white font-sans mb-1">
                    Hardware Infrastructure (Laptop vs Lab)
                  </h4>
                  <p className="text-xs text-zinc-400 font-mono">
                    Ratio of students bringing their own laptops to lab terminals.
                  </p>
                </div>

                <div className="h-48 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={laptopPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {laptopPieData.map((entry, index) => (
                          <Cell key={`cell-laptop-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333', fontSize: '11px' }} />
                      <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: STUDENT DIRECTORY */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            
            {/* Search & Comprehensive Filter Toolbar */}
            <div className="bg-[#0d0d0d] border border-zinc-800 p-4 sm:p-5 rounded-2xl space-y-3">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                
                {/* Search Box */}
                <div className="relative w-full lg:w-96">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, ID card, course, year, section..."
                    className="w-full bg-black border border-zinc-700 focus:border-[#B0FF00] rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder-zinc-500 outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-zinc-500 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Reset Filters */}
                {(courseFilter !== 'ALL' || yearFilter !== 'ALL' || sectionFilter !== 'ALL' || streamFilter !== 'ALL' || laptopFilter !== 'ALL' || searchQuery) && (
                  <button
                    onClick={() => {
                      setCourseFilter('ALL');
                      setYearFilter('ALL');
                      setSectionFilter('ALL');
                      setStreamFilter('ALL');
                      setLaptopFilter('ALL');
                      setSearchQuery('');
                    }}
                    className="text-xs font-mono text-[#B0FF00] hover:underline flex items-center gap-1 self-end lg:self-center cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> Reset all filters ({filteredStudents.length} of {students.length})
                  </button>
                )}
              </div>

              {/* Multi-Dimensional Filter Dropdowns */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 font-mono text-xs pt-1 border-t border-zinc-900">
                
                {/* Course Filter */}
                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase mb-1">Course</label>
                  <select
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value as any)}
                    className="w-full bg-black border border-zinc-700 rounded-lg px-2.5 py-2 text-gray-200 outline-none cursor-pointer focus:border-[#B0FF00]"
                  >
                    <option value="ALL">All Courses</option>
                    {COURSES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase mb-1">Year</label>
                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value as any)}
                    className="w-full bg-black border border-zinc-700 rounded-lg px-2.5 py-2 text-gray-200 outline-none cursor-pointer focus:border-[#B0FF00]"
                  >
                    <option value="ALL">All Years</option>
                    {YEARS.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                {/* Section Filter (A to K) */}
                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase mb-1">Section (A-K)</label>
                  <select
                    value={sectionFilter}
                    onChange={(e) => setSectionFilter(e.target.value as any)}
                    className="w-full bg-black border border-zinc-700 rounded-lg px-2.5 py-2 text-gray-200 outline-none cursor-pointer focus:border-[#B0FF00]"
                  >
                    <option value="ALL">All Sections (A-K)</option>
                    {SECTIONS.map(s => (
                      <option key={s} value={s}>Section {s}</option>
                    ))}
                  </select>
                </div>

                {/* Stream Filter */}
                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase mb-1">Workshop Stream</label>
                  <select
                    value={streamFilter}
                    onChange={(e) => setStreamFilter(e.target.value as any)}
                    className="w-full bg-black border border-zinc-700 rounded-lg px-2.5 py-2 text-gray-200 outline-none cursor-pointer focus:border-[#B0FF00]"
                  >
                    <option value="ALL">All Streams</option>
                    <option value="Full Stack Development">Full Stack Dev</option>
                    <option value="Data Analytics">Data Analytics</option>
                  </select>
                </div>

                {/* Laptop Filter (3 options) */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] text-zinc-500 uppercase mb-1">Laptop Availability</label>
                  <select
                    value={laptopFilter}
                    onChange={(e) => setLaptopFilter(e.target.value as any)}
                    className="w-full bg-black border border-zinc-700 rounded-lg px-2.5 py-2 text-gray-200 outline-none cursor-pointer focus:border-[#B0FF00]"
                  >
                    <option value="ALL">All Laptop Statuses</option>
                    <option value="I have laptop">I have laptop</option>
                    <option value="I don't have laptop">I don't have laptop</option>
                    <option value="I have at home">I have at home</option>
                  </select>
                </div>

              </div>

            </div>

            {/* Students Table */}
            <div className="bg-[#0d0d0d] border border-zinc-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-black border-b border-zinc-800 text-zinc-400 uppercase font-mono text-[11px]">
                    <tr>
                      <th className="px-4 py-3.5">Student Details</th>
                      <th className="px-4 py-3.5">ID Card</th>
                      <th className="px-4 py-3.5">Course & Year</th>
                      <th className="px-4 py-3.5">Section</th>
                      <th className="px-4 py-3.5">Stream</th>
                      <th className="px-4 py-3.5">Laptop Status</th>
                      <th className="px-4 py-3.5">18-Day Progress</th>
                      <th className="px-4 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center text-zinc-500 font-mono">
                          <p className="text-sm text-zinc-400">No student records matched your filters.</p>
                          <p className="text-xs text-zinc-600 mt-1">Try resetting the Course, Year, Section, or Search criteria.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((student) => {
                        const stdReviews = reviewsByStudentId[student.id] || [];
                        const completedCount = stdReviews.length;
                        const pct = Math.round((completedCount / 18) * 100);
                        const laptopStatusDisplay = student.laptopStatus || (student.hasLaptop ? 'I have laptop' : "I don't have laptop");

                        return (
                          <tr key={student.id} className="hover:bg-zinc-950 transition-colors">
                            <td className="px-4 py-3.5">
                              <div className="font-semibold text-white">{student.name}</div>
                              <div className="text-[11px] text-zinc-500 font-mono">{student.email} • {student.phone}</div>
                            </td>

                            <td className="px-4 py-3.5 font-mono text-zinc-200 font-bold">
                              {student.idCardNo}
                            </td>

                            <td className="px-4 py-3.5 font-mono text-zinc-300 text-[11px]">
                              <span className="font-semibold text-white">{student.course || student.classSection?.split(' - ')[0] || 'BCA'}</span>
                              <span className="text-zinc-500 block text-[10px]">{student.year || 'Year 1'}</span>
                            </td>

                            <td className="px-4 py-3.5 font-mono text-zinc-300 text-[11px]">
                              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200">
                                Sec {student.section || 'A'}
                              </span>
                            </td>

                            <td className="px-4 py-3.5">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono ${
                                student.stream === 'Full Stack Development'
                                   ? 'bg-[#B0FF00]/10 text-[#B0FF00] border border-[#B0FF00]/30'
                                  : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                              }`}>
                                {student.stream === 'Full Stack Development' ? 'Full Stack' : 'Data Analytics'}
                              </span>
                            </td>

                            <td className="px-4 py-3.5 font-mono text-[11px]">
                              {laptopStatusDisplay === 'I have laptop' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                                  <Laptop className="w-3 h-3" /> Laptop
                                </span>
                              )}
                              {laptopStatusDisplay === "I don't have laptop" && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                                  No Laptop
                                </span>
                              )}
                              {laptopStatusDisplay === 'I have at home' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-950/60 border border-sky-500/30 text-sky-400">
                                  At Home
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                                  <div 
                                    className="h-full bg-[#B0FF00]" 
                                    style={{ width: `${Math.max(pct, 2)}%` }} 
                                  />
                                </div>
                                <span className="font-mono text-[11px] text-[#B0FF00] font-bold">
                                  {completedCount}/18
                                </span>
                              </div>
                            </td>

                            <td className="px-4 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => openStudentDossier(student)}
                                  className="bg-black border border-zinc-700 hover:border-[#B0FF00] text-zinc-300 hover:text-[#B0FF00] font-mono text-[11px] px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                                  title="View Student 18-Day Reviews Dossier"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Reviews</span>
                                </button>

                                <button
                                  onClick={() => setStudentToDelete(student)}
                                  className="bg-zinc-900/80 hover:bg-red-950/80 border border-zinc-800 hover:border-red-500/60 text-zinc-400 hover:text-red-300 font-mono text-[11px] p-1.5 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                                  title={`Delete ${student.name} and archive reviews`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: DAY-WISE FEEDBACK EXPLORER */}
        {activeTab === 'day_feedback' && (
          <div className="space-y-6">
            
            {/* Day Selector Ribbon */}
            <div className="bg-[#0d0d0d] border border-zinc-800 p-4 sm:p-5 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-mono text-[#B0FF00] uppercase tracking-wider font-bold">
                  Select Workshop Day (1 to 18):
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  Showing Day {selectedDay} • {selectedDayReviews.length} Submissions
                </span>
              </div>

              {/* Day Tiles */}
              <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-18 gap-1.5 font-mono text-xs">
                {Array.from({ length: 18 }, (_, i) => i + 1).map(d => {
                  const isSelected = d === selectedDay;
                  const dayReviewCount = reviews.filter(r => r.day === d).length;
                  return (
                    <button
                      key={d}
                      onClick={() => setSelectedDay(d)}
                      className={`py-2 rounded-lg border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#B0FF00] text-black border-[#B0FF00] font-bold glow-accent'
                          : 'bg-black border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                      }`}
                    >
                      <span className="block text-[11px]">D{d}</span>
                      <span className="text-[9px] opacity-70">({dayReviewCount})</span>
                    </button>
                  );
                })}
              </div>

              {/* Day Feedback Filters */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 font-mono text-xs pt-3 border-t border-zinc-900">
                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase mb-1">Filter Stream</label>
                  <select
                    value={dayStreamFilter}
                    onChange={(e) => setDayStreamFilter(e.target.value as any)}
                    className="w-full bg-black border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="ALL">All Streams</option>
                    <option value="Full Stack Development">Full Stack Dev</option>
                    <option value="Data Analytics">Data Analytics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase mb-1">Filter Course</label>
                  <select
                    value={dayCourseFilter}
                    onChange={(e) => setDayCourseFilter(e.target.value as any)}
                    className="w-full bg-black border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="ALL">All Courses</option>
                    {COURSES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase mb-1">Filter Year</label>
                  <select
                    value={dayYearFilter}
                    onChange={(e) => setDayYearFilter(e.target.value as any)}
                    className="w-full bg-black border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="ALL">All Years</option>
                    {YEARS.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase mb-1">Filter Section</label>
                  <select
                    value={daySectionFilter}
                    onChange={(e) => setDaySectionFilter(e.target.value as any)}
                    className="w-full bg-black border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="ALL">All Sections (A-K)</option>
                    {SECTIONS.map(s => (
                      <option key={s} value={s}>Sec {s}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] text-zinc-500 uppercase mb-1">Search Feedback</label>
                  <input
                    type="text"
                    value={dayFeedbackSearch}
                    onChange={(e) => setDayFeedbackSearch(e.target.value)}
                    placeholder="Search in quotes..."
                    className="w-full bg-black border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#B0FF00]"
                  />
                </div>
              </div>
            </div>

            {/* Day Overview Summary */}
            {(() => {
              const topic = WORKSHOP_TOPICS.find(t => t.day === selectedDay);
              const count = selectedDayReviews.length;
              const avgScore = count > 0 
                ? (selectedDayReviews.reduce((a, b) => a + b.overallRating, 0) / count).toFixed(2) 
                : '0.0';

              return (
                <div className="bg-[#0d0d0d] border border-[#B0FF00]/30 rounded-2xl p-6 glow-accent-subtle space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                    <div>
                      <span className="text-xs font-mono text-[#B0FF00] uppercase tracking-wider block mb-1">
                        DAY {selectedDay.toString().padStart(2, '0')} EVALUATION FEEDBACK
                      </span>
                      <h2 className="text-lg sm:text-xl font-bold text-white font-sans">
                        FS: {topic?.fullStackTopic} <br className="sm:hidden" />
                        <span className="text-zinc-500 font-normal">| DA: {topic?.dataAnalyticsTopic}</span>
                      </h2>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div className="text-right">
                        <span className="text-zinc-500 block text-[10px]">Submissions</span>
                        <span className="text-xl font-bold text-white">{count}</span>
                      </div>
                      <div className="text-right border-l border-zinc-800 pl-4">
                        <span className="text-zinc-500 block text-[10px]">Avg Score</span>
                        <span className="text-xl font-bold text-[#B0FF00]">{avgScore}/5 ★</span>
                      </div>
                    </div>
                  </div>

                  {/* Verbatim Reviews Grid */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                      Student Qualitative Feedback ({selectedDayReviews.length} responses):
                    </h3>

                    {selectedDayReviews.length === 0 ? (
                      <div className="p-8 text-center bg-black rounded-xl border border-zinc-900 text-zinc-500 font-mono text-xs">
                        No submissions recorded for Day {selectedDay} yet.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedDayReviews.map((rev) => {
                          const std = students.find(s => s.id === rev.studentId);
                          return (
                            <div key={rev.id} className="bg-black border border-zinc-800 rounded-xl p-4 space-y-2.5">
                              
                              <div className="flex items-center justify-between border-b border-zinc-900 pb-2 text-xs">
                                <div>
                                  <span className="font-bold text-white font-sans">
                                    {rev.studentName || std?.name || 'Student'}
                                  </span>
                                  <span className="text-zinc-500 font-mono ml-1.5 text-[11px]">
                                    ({rev.idCardNo || std?.idCardNo})
                                  </span>
                                </div>
                                <span className="font-mono text-[#B0FF00] font-bold">
                                  {rev.overallRating}/5 ★
                                </span>
                              </div>

                              <div className="text-xs space-y-1.5">
                                <div>
                                  <span className="text-[10px] font-mono text-[#B0FF00] uppercase block">Liked:</span>
                                  <p className="text-zinc-300 font-sans text-xs bg-zinc-950 p-2 rounded border border-zinc-900">
                                    "{rev.liked}"
                                  </p>
                                </div>

                                <div>
                                  <span className="text-[10px] font-mono text-amber-400 uppercase block">Improvement:</span>
                                  <p className="text-zinc-300 font-sans text-xs bg-zinc-950 p-2 rounded border border-zinc-900">
                                    "{rev.improve}"
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-1">
                                <span>{rev.recommend ? '👍 Recommended' : '👎 Did not recommend'}</span>
                                <span>{new Date(rev.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              );
            })()}

          </div>
        )}

        {/* TAB 4: DATA OPERATIONS & SEEDING */}
        {activeTab === 'data_tools' && (
          <div className="space-y-6">
            
            <div className="bg-[#0d0d0d] border border-zinc-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#B0FF00]" />
                Dataset Generator & Seed Tool
              </h3>
              <p className="text-xs text-gray-400 font-sans leading-relaxed max-w-2xl">
                If this is a newly deployed instance or you want to preview how the administrator charts and reporting look with a realistic cohort, click below to populate mock student registrations and multi-day feedback into Firestore.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={handleSeed}
                  disabled={seeding}
                  className="bg-black border-2 border-[#B0FF00] text-[#B0FF00] hover:bg-[#B0FF00] hover:text-black font-mono font-bold text-xs sm:text-sm py-3 px-6 rounded-xl flex items-center gap-2 transition-all glow-accent cursor-pointer disabled:opacity-50"
                >
                  {seeding ? (
                    <span className="animate-pulse flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Injecting Student Submissions into Firestore...
                    </span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Seed Cohort (~10 Students & ~80 Reviews)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Export Section */}
            <div className="bg-[#0d0d0d] border border-zinc-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                <Download className="w-5 h-5 text-[#B0FF00]" />
                CSV Reports Download
              </h3>
              <p className="text-xs text-gray-400 font-sans">
                Export clean, formatted CSV spreadsheets containing all student rosters and all submitted 18-day ratings.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
                <button
                  onClick={exportStudentsCSV}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl border border-zinc-700 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4 text-[#B0FF00]" />
                  <span>Export Students CSV ({students.length} rows)</span>
                </button>

                <button
                  onClick={exportReviewsCSV}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl border border-zinc-700 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Export Reviews CSV ({reviews.length} rows)</span>
                </button>
              </div>
            </div>

            {/* Danger Zone: Clear Entire Database */}
            <div className="bg-red-950/20 border border-red-500/40 p-6 rounded-2xl space-y-4 glow-accent-subtle">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 text-[10px] font-mono font-bold uppercase">
                  Danger Zone & High Impact Action
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-400" />
                Clear Entire Database & Snapshot to Archive
              </h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed max-w-2xl">
                Need to reset for a fresh batch or workshop cycle? This action wipes all active student profiles and all submitted daily reviews from the active database. <strong>A complete snapshot is automatically preserved in the "History & Archive" tab</strong>, allowing you to restore everything with one click if needed.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setClearDbInput('');
                    setShowClearDbModal(true);
                  }}
                  className="bg-red-950/60 hover:bg-red-900 text-red-200 hover:text-white border border-red-500/60 font-mono font-bold text-xs py-3 px-5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:shadow-red-900/40"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <span>Clear Entire Database (Wipe Students & Reviews)</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: HISTORY & ARCHIVE */}
        {activeTab === 'history' && (
          <HistoryArchiveView onDataRestored={fetchData} />
        )}

      </div>

      {/* Single Student Deletion Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#0d0d0d] border border-red-500/80 rounded-2xl p-6 glow-accent shadow-2xl space-y-5">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
              <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/60 text-red-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-red-400 uppercase font-bold">Confirm Deletion</span>
                <h3 className="text-lg font-bold text-white font-sans">Delete Student Record?</h3>
              </div>
            </div>

            <div className="text-xs font-sans text-zinc-300 space-y-2 bg-black p-3.5 rounded-xl border border-zinc-800">
              <p>You are about to delete the student profile and all submitted reviews for:</p>
              <div className="font-mono text-white text-sm font-bold">{studentToDelete.name}</div>
              <div className="font-mono text-zinc-400 text-xs">
                ID: {studentToDelete.idCardNo} • {studentToDelete.course} (Year {studentToDelete.year}, Sec {studentToDelete.section})
              </div>
              <p className="text-[11px] text-[#B0FF00] font-mono pt-1">
                ✓ A safety snapshot will be stored in "History & Archive" so you can restore them anytime.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                disabled={isDeletingStudent}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDeleteStudent}
                disabled={isDeletingStudent}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isDeletingStudent ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Archiving & Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Database Security Modal */}
      {showClearDbModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0d0d0d] border border-red-500 rounded-2xl p-6 sm:p-7 glow-accent shadow-2xl space-y-5">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
              <div className="p-3 rounded-xl bg-red-950 border border-red-500 text-red-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-red-400 uppercase font-bold">Critical Security Check</span>
                <h3 className="text-xl font-bold text-white font-sans">Clear Entire Database</h3>
              </div>
            </div>

            <div className="text-xs font-sans text-zinc-300 space-y-3">
              <p>
                This will delete all <strong className="text-white">{students.length} students</strong> and all <strong className="text-white">{reviews.length} reviews</strong> currently active in Firestore.
              </p>
              <div className="p-3 bg-black rounded-xl border border-zinc-800 font-mono text-[11px] text-[#B0FF00]">
                🛡️ Automatic Safety Backup: All wiped records will be archived into the <strong>"History & Archive"</strong> vault with full restoration capability.
              </div>
              <div>
                <label className="block font-mono text-[11px] text-zinc-400 uppercase mb-1.5">
                  To confirm, type <strong className="text-red-400">CLEAR</strong> below:
                </label>
                <input
                  type="text"
                  value={clearDbInput}
                  onChange={(e) => setClearDbInput(e.target.value)}
                  placeholder="Type CLEAR to confirm"
                  className="w-full bg-black border-2 border-red-500/60 focus:border-red-400 rounded-xl px-4 py-2.5 font-mono text-sm text-white uppercase outline-none"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => {
                  setShowClearDbModal(false);
                  setClearDbInput('');
                }}
                disabled={isClearingDb}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmClearDatabase}
                disabled={clearDbInput.trim().toUpperCase() !== 'CLEAR' || isClearingDb}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isClearingDb ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Backing up & Wiping Database...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Wipe All Data</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Dossier Modal */}
      {selectedStudentForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-3xl bg-[#0d0d0d] border border-[#B0FF00] rounded-2xl p-6 sm:p-7 glow-accent shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedStudentForModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-zinc-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-[#B0FF00] uppercase">Student 18-Day Evaluation Dossier</span>
              </div>
              <h2 className="text-2xl font-bold text-white font-sans">
                {selectedStudentForModal.student.name}
              </h2>
              <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs text-zinc-400">
                <span>ID: <strong className="text-white">{selectedStudentForModal.student.idCardNo}</strong></span>
                <span>•</span>
                <span>Stream: <strong className="text-[#B0FF00]">{selectedStudentForModal.student.stream}</strong></span>
                <span>•</span>
                <span>Course: {selectedStudentForModal.student.course} ({selectedStudentForModal.student.year}, Sec {selectedStudentForModal.student.section})</span>
                <span>•</span>
                <span>Completed: <strong className="text-[#B0FF00]">{selectedStudentForModal.reviews.length}/18 Days</strong></span>
              </div>
            </div>

            {/* 18-Day Reviews List */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Submitted Reviews History ({selectedStudentForModal.reviews.length}):
              </h3>

              {selectedStudentForModal.reviews.length === 0 ? (
                <p className="text-zinc-500 font-mono text-xs p-6 bg-black rounded-xl border border-zinc-900 text-center">
                  This student has not submitted any daily reviews yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedStudentForModal.reviews.map((rev) => {
                    const topic = WORKSHOP_TOPICS.find(t => t.day === rev.day);
                    const topicTitle = selectedStudentForModal.student.stream === 'Full Stack Development'
                      ? topic?.fullStackTopic
                      : topic?.dataAnalyticsTopic;

                    return (
                      <div key={rev.id} className="bg-black border border-zinc-800 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#B0FF00] text-black">
                              DAY {rev.day}
                            </span>
                            <span className="text-xs font-semibold text-white font-sans">
                              {topicTitle}
                            </span>
                          </div>
                          <span className="font-mono text-xs text-[#B0FF00] font-bold">
                            {rev.overallRating}/5 ★
                          </span>
                        </div>

                        <div className="text-xs space-y-1">
                          <p className="text-zinc-300 font-sans">
                            <strong className="text-[#B0FF00] font-mono text-[10px] uppercase block">Liked:</strong>
                            "{rev.liked}"
                          </p>
                          {rev.improve && (
                            <p className="text-zinc-300 font-sans">
                              <strong className="text-amber-400 font-mono text-[10px] uppercase block">Improvement:</strong>
                              "{rev.improve}"
                            </p>
                          )}
                        </div>

                        <div className="text-[10px] text-zinc-500 font-mono flex items-center justify-between pt-1">
                          <span>{rev.recommend ? '👍 Recommended' : '👎 Did not recommend'}</span>
                          <span>Submitted: {new Date(rev.submittedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setStudentToDelete(selectedStudentForModal.student);
                }}
                className="bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-white border border-red-500/50 font-mono text-xs py-2 px-4 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Student & Archive</span>
              </button>

              <button
                onClick={() => setSelectedStudentForModal(null)}
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs py-2 px-5 rounded-lg border border-zinc-700 transition-colors cursor-pointer"
              >
                Close Dossier
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
