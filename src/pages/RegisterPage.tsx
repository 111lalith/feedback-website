import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Terminal, 
  User, 
  Phone, 
  CreditCard, 
  Mail, 
  GraduationCap, 
  Code2, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Search,
  Sparkles,
  Calendar,
  Layers
} from 'lucide-react';
import { registerStudent } from '../lib/firebase';
import { 
  StreamType, 
  CourseType, 
  YearType, 
  SectionType, 
  COURSES,
  YEARS,
  SECTIONS
} from '../types';
import { ChathuryaLogo } from '../components/ChathuryaLogo';

interface RegisterPageProps {
  onOpenLookup: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onOpenLookup }) => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [idCardNo, setIdCardNo] = useState('');
  const [email, setEmail] = useState('');
  
  // Structured Academic Details
  const [course, setCourse] = useState<CourseType>('BCA');
  const [year, setYear] = useState<YearType>('Year 1');
  const [section, setSection] = useState<SectionType>('A');

  const [stream, setStream] = useState<StreamType>('Full Stack Development');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!name.trim()) {
      errs.name = 'Full Name is required';
    } else if (name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    // 10-digit phone number validation
    const cleanedPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanedPhone) {
      errs.phone = 'Phone Number is required';
    } else if (cleanedPhone.length !== 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }

    // ID Card validation
    if (!idCardNo.trim()) {
      errs.idCardNo = 'College ID Card Number is required';
    } else if (idCardNo.trim().length < 2) {
      errs.idCardNo = 'Please enter a valid college ID (e.g. 21BCA042)';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Please provide a valid email format';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError(null);

    const formattedClassSection = `${course} - ${year} (Sec ${section})`;

    try {
      await registerStudent({
        name,
        phone: phone.replace(/[^0-9]/g, ''),
        idCardNo,
        email,
        course,
        year,
        section,
        classSection: formattedClassSection,
        stream,
        laptopStatus: 'I have laptop',
        hasLaptop: true
      });

      // Successful registration! Redirect to 18-day dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration failed:', err);
      setServerError(err?.message || 'Unable to register student. Please check network and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-8 sm:py-12 px-3 sm:px-6 lg:px-8 pb-28 sm:pb-16">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Navigation & Lookup helper */}
        <div className="flex items-center justify-between text-xs font-mono text-gray-400">
          <Link to="/" className="hover:text-[#B0FF00] flex items-center gap-1 transition-colors">
            ← Return to Workshop Overview
          </Link>
          <button 
            onClick={onOpenLookup}
            className="text-[#B0FF00] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" /> Already registered? Find ID
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-[#0d0d0d] border border-[#B0FF00]/40 rounded-2xl p-4 sm:p-8 glow-accent shadow-2xl relative">
          
          {/* Header */}
          <div className="text-center space-y-3 mb-6 sm:mb-8">
            <div className="flex justify-center">
              <ChathuryaLogo size="md" className="mb-2" />
            </div>
            
            <h1 className="text-xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
              18-Day Workshop Registration
            </h1>
            
            <p className="text-xs sm:text-sm text-gray-400 font-sans max-w-md mx-auto leading-relaxed">
              Enter your student details to generate your verified profile for daily session reviews and code feedback.
            </p>
          </div>

          {/* Server Error Alert */}
          {serverError && (
            <div className="mb-6 flex items-start gap-3 bg-red-950/40 border border-red-500/50 rounded-xl p-4 text-xs text-red-200">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Student Full Name */}
            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#B0FF00]" /> Full Name
                <span className="text-[#B0FF00]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className={`w-full bg-black border ${
                  errors.name ? 'border-red-500' : 'border-zinc-700 focus:border-[#B0FF00]'
                } focus:ring-1 focus:ring-[#B0FF00] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all font-sans`}
              />
              {errors.name && <p className="text-red-400 text-xs font-mono mt-1">{errors.name}</p>}
            </div>

            {/* 10-Digit Phone Number */}
            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#B0FF00]" /> Mobile Number (10 Digits)
                <span className="text-[#B0FF00]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 font-mono text-sm">
                  +91
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="9876543210"
                  className={`w-full bg-black border ${
                    errors.phone ? 'border-red-500' : 'border-zinc-700 focus:border-[#B0FF00]'
                  } focus:ring-1 focus:ring-[#B0FF00] rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all font-mono`}
                />
              </div>
              {errors.phone && <p className="text-red-400 text-xs font-mono mt-1">{errors.phone}</p>}
            </div>

            {/* College ID Card Number */}
            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#B0FF00]" /> College ID Card Number
                <span className="text-[#B0FF00]">*</span>
              </label>
              <input
                type="text"
                value={idCardNo}
                onChange={(e) => setIdCardNo(e.target.value.toUpperCase())}
                placeholder="e.g. 21BCA042"
                className={`w-full bg-black border ${
                  errors.idCardNo ? 'border-red-500' : 'border-zinc-700 focus:border-[#B0FF00]'
                } focus:ring-1 focus:ring-[#B0FF00] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all font-mono uppercase`}
              />
              {errors.idCardNo && <p className="text-red-400 text-xs font-mono mt-1">{errors.idCardNo}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#B0FF00]" /> Email Address
                <span className="text-[#B0FF00]">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className={`w-full bg-black border ${
                  errors.email ? 'border-red-500' : 'border-zinc-700 focus:border-[#B0FF00]'
                } focus:ring-1 focus:ring-[#B0FF00] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all font-sans`}
              />
              {errors.email && <p className="text-red-400 text-xs font-mono mt-1">{errors.email}</p>}
            </div>

            {/* Academic Structure (Course, Year, Section) */}
            <div className="bg-black/60 border border-zinc-800 rounded-xl p-4 space-y-3">
              <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#B0FF00]" /> Academic Class Details
                <span className="text-[#B0FF00]">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Course Selection */}
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                    Degree / Course
                  </label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value as CourseType)}
                    className="w-full bg-[#0d0d0d] border border-zinc-700 focus:border-[#B0FF00] rounded-lg px-3 py-2.5 text-xs text-white outline-none font-mono"
                  >
                    {COURSES.map((c) => (
                      <option key={c} value={c} className="bg-black text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Selection */}
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                    Academic Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value as YearType)}
                    className="w-full bg-[#0d0d0d] border border-zinc-700 focus:border-[#B0FF00] rounded-lg px-3 py-2.5 text-xs text-white outline-none font-mono"
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y} className="bg-black text-white">
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Section Selection */}
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                    Class Section
                  </label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value as SectionType)}
                    className="w-full bg-[#0d0d0d] border border-zinc-700 focus:border-[#B0FF00] rounded-lg px-3 py-2.5 text-xs text-white outline-none font-mono"
                  >
                    {SECTIONS.map((s) => (
                      <option key={s} value={s} className="bg-black text-white">
                        Section {s}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="pt-1 text-[11px] font-mono text-zinc-400 flex items-center justify-between border-t border-zinc-900">
                <span>Selected Cohort:</span>
                <span className="text-[#B0FF00] font-bold">
                  {course} — {year} (Section {section})
                </span>
              </div>
            </div>

            {/* Workshop Stream Selection */}
            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-[#B0FF00]" /> Choose Workshop Learning Track
                <span className="text-[#B0FF00]">*</span>
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Full Stack Option */}
                <button
                  type="button"
                  onClick={() => setStream('Full Stack Development')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    stream === 'Full Stack Development'
                      ? 'bg-zinc-950 border-[#B0FF00] shadow-[0_0_15px_rgba(176,255,0,0.25)]'
                      : 'bg-black border-zinc-800 hover:border-zinc-700 text-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`font-bold font-sans text-sm flex items-center gap-2 ${
                      stream === 'Full Stack Development' ? 'text-[#B0FF00]' : 'text-gray-300'
                    }`}>
                      <Code2 className="w-4 h-4" /> Full Stack Dev
                    </span>
                    {stream === 'Full Stack Development' && (
                      <CheckCircle2 className="w-4 h-4 text-[#B0FF00]" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 font-sans">
                    Modern Frontend, Backend APIs, State Architecture & Real-world Full Stack Deployment.
                  </p>
                </button>

                {/* Data Analytics Option */}
                <button
                  type="button"
                  onClick={() => setStream('Data Analytics')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    stream === 'Data Analytics'
                      ? 'bg-zinc-950 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                      : 'bg-black border-zinc-800 hover:border-zinc-700 text-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`font-bold font-sans text-sm flex items-center gap-2 ${
                      stream === 'Data Analytics' ? 'text-cyan-400' : 'text-gray-300'
                    }`}>
                      <Database className="w-4 h-4" /> Data Analytics
                    </span>
                    {stream === 'Data Analytics' && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 font-sans">
                    Advanced Excel (Formulas, Power Query, Pivot Tables) & Tableau Visualizations.
                  </p>
                </button>

              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-zinc-800">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black border-2 border-[#B0FF00] text-[#B0FF00] hover:bg-[#B0FF00] hover:text-black font-mono font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all glow-accent cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-pulse flex items-center gap-2 font-mono">
                    <Terminal className="w-4 h-4 animate-spin" />
                    Enrolling Student in Firestore...
                  </span>
                ) : (
                  <>
                    <span>Complete Registration & Open 18-Day Tracker</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-zinc-500 font-mono mt-3">
                By submitting, your profile is stored securely in Firebase Firestore.
              </p>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
