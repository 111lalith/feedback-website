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
  Laptop, 
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
  LaptopStatusType,
  COURSES,
  YEARS,
  SECTIONS,
  LAPTOP_OPTIONS
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
  const [laptopStatus, setLaptopStatus] = useState<LaptopStatusType>('I have laptop');

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
        laptopStatus,
        hasLaptop: laptopStatus === 'I have laptop'
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
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Breadcrumb / Return Link */}
        <div className="mb-6 flex items-center justify-between font-mono text-xs text-gray-400">
          <Link to="/" className="hover:text-[#B0FF00] flex items-center gap-1 transition-colors">
            ← Back to Overview
          </Link>
          <button 
            onClick={onOpenLookup} 
            className="text-gray-400 hover:text-[#B0FF00] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[#B0FF00]" />
            <span>Open Student Tracker</span>
          </button>
        </div>

        {/* Main Registration Card */}
        <div className="bg-[#0d0d0d] border border-[#B0FF00]/40 rounded-2xl p-5 sm:p-8 glow-accent shadow-2xl relative">
          
          {/* Header */}
          <div className="border-b border-zinc-800 pb-5 mb-6">
            <ChathuryaLogo size="sm" className="mb-3" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
              Workshop Registration
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 font-sans mt-1">
              One-time registration for the 18-Day Flagship Workshop.
            </p>
          </div>

          {serverError && (
            <div className="mb-6 flex items-start gap-3 bg-red-950/40 border border-red-500/50 rounded-xl p-4 text-xs text-red-200">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold font-mono">Registration Warning</p>
                <p>{serverError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#B0FF00]" /> Full Name
                  <span className="text-[#B0FF00]">*</span>
                </span>
                {errors.name && (
                  <span className="text-red-400 text-[11px] lowercase">{errors.name}</span>
                )}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                placeholder="e.g. Aarav Sharma"
                className={`w-full bg-black border ${
                  errors.name ? 'border-red-500' : 'border-zinc-700'
                } focus:border-[#B0FF00] focus:ring-1 focus:ring-[#B0FF00] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all font-sans`}
              />
            </div>

            {/* Phone & ID Card (2-Col) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Phone */}
              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#B0FF00]" /> Phone Number (10 digits)
                    <span className="text-[#B0FF00]">*</span>
                  </span>
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/[^0-9]/g, ''));
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                  }}
                  placeholder="9876543210"
                  className={`w-full bg-black border ${
                    errors.phone ? 'border-red-500' : 'border-zinc-700'
                  } focus:border-[#B0FF00] focus:ring-1 focus:ring-[#B0FF00] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all font-mono`}
                />
                {errors.phone && (
                  <span className="text-red-400 text-[11px] font-mono mt-1 block">{errors.phone}</span>
                )}
              </div>

              {/* ID Card Number */}
              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#B0FF00]" /> College ID Card No
                    <span className="text-[#B0FF00]">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  value={idCardNo}
                  onChange={(e) => {
                    setIdCardNo(e.target.value);
                    if (errors.idCardNo) setErrors(prev => ({ ...prev, idCardNo: '' }));
                  }}
                  placeholder="e.g. 21BCA042"
                  className={`w-full bg-black border ${
                    errors.idCardNo ? 'border-red-500' : 'border-zinc-700'
                  } focus:border-[#B0FF00] focus:ring-1 focus:ring-[#B0FF00] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all font-mono uppercase tracking-wider`}
                />
                {errors.idCardNo && (
                  <span className="text-red-400 text-[11px] font-mono mt-1 block">{errors.idCardNo}</span>
                )}
              </div>

            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#B0FF00]" /> Email Address
                  <span className="text-[#B0FF00]">*</span>
                </span>
                {errors.email && (
                  <span className="text-red-400 text-[11px] lowercase">{errors.email}</span>
                )}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                placeholder="student.name@college.edu"
                className={`w-full bg-black border ${
                  errors.email ? 'border-red-500' : 'border-zinc-700'
                } focus:border-[#B0FF00] focus:ring-1 focus:ring-[#B0FF00] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all font-sans`}
              />
            </div>

            {/* Academic Classification: Course, Year, and Section */}
            <div className="p-4 bg-black rounded-xl border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                <span className="text-xs font-mono text-[#B0FF00] uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" /> Academic Course & Section Details
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  Preview: <span className="text-white font-bold">{course} • {year} • Sec {section}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Course Selection */}
                <div>
                  <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                    Course <span className="text-[#B0FF00]">*</span>
                  </label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value as CourseType)}
                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-[#B0FF00] rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white outline-none cursor-pointer"
                  >
                    {COURSES.map((c) => (
                      <option key={c} value={c} className="bg-zinc-900 text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Selection */}
                <div>
                  <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                    Year <span className="text-[#B0FF00]">*</span>
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value as YearType)}
                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-[#B0FF00] rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white outline-none cursor-pointer"
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y} className="bg-zinc-900 text-white">
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Section Selection */}
                <div>
                  <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
                    Section <span className="text-[#B0FF00]">*</span>
                  </label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value as SectionType)}
                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-[#B0FF00] rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white outline-none cursor-pointer"
                  >
                    {SECTIONS.map((sec) => (
                      <option key={sec} value={sec} className="bg-zinc-900 text-white">
                        Section {sec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Workshop Stream Selection */}
            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-[#B0FF00]" /> Enrolled Workshop Stream
                <span className="text-[#B0FF00]">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Full Stack Option */}
                <button
                  type="button"
                  onClick={() => setStream('Full Stack Development')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    stream === 'Full Stack Development'
                      ? 'bg-zinc-950 border-[#B0FF00] glow-accent'
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
                    HTML5, CSS3, SQLite, Python, Flask, Git & Full Canteen Capstone Project.
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

            {/* Laptop Availability: Exactly 3 options requested */}
            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5 text-[#B0FF00]" /> Laptop Availability
                <span className="text-[#B0FF00]">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {LAPTOP_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                      laptopStatus === opt.id
                        ? 'bg-zinc-950 border-[#B0FF00] text-white glow-accent-subtle'
                        : 'bg-black border-zinc-800 text-gray-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <input
                        type="radio"
                        name="laptopStatus"
                        checked={laptopStatus === opt.id}
                        onChange={() => setLaptopStatus(opt.id)}
                        className="accent-[#B0FF00]"
                      />
                      <span className={`font-mono text-xs font-bold ${
                        laptopStatus === opt.id ? 'text-[#B0FF00]' : 'text-gray-300'
                      }`}>
                        {opt.label}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-sans pl-5">
                      {opt.sublabel}
                    </span>
                  </label>
                ))}
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
