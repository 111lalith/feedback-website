import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { StudentLookupModal } from './components/StudentLookupModal';
import { LandingPage } from './pages/LandingPage';
import { RegisterPage } from './pages/RegisterPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { ReviewFormPage } from './pages/ReviewFormPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export default function App() {
  const [isLookupOpen, setIsLookupOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-black text-[#EAEAEA]">
        
        {/* Navigation Bar */}
        <Navbar onOpenLookup={() => setIsLookupOpen(true)} />

        {/* Global Student ID Lookup Modal */}
        <StudentLookupModal 
          isOpen={isLookupOpen} 
          onClose={() => setIsLookupOpen(false)} 
        />

        {/* Main Application Routes */}
        <main className="flex-1">
          <Routes>
            <Route 
              path="/" 
              element={<LandingPage onOpenLookup={() => setIsLookupOpen(true)} />} 
            />
            <Route 
              path="/register" 
              element={<RegisterPage onOpenLookup={() => setIsLookupOpen(true)} />} 
            />
            <Route 
              path="/dashboard" 
              element={<StudentDashboardPage onOpenLookup={() => setIsLookupOpen(true)} />} 
            />
            <Route 
              path="/review/:day" 
              element={<ReviewFormPage onOpenLookup={() => setIsLookupOpen(true)} />} 
            />
            <Route 
              path="/admin/login" 
              element={<AdminLoginPage />} 
            />
            <Route 
              path="/admin" 
              element={<AdminDashboardPage />} 
            />
            {/* Catch-all fallback */}
            <Route 
              path="*" 
              element={<Navigate to="/" replace />} 
            />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Mobile Floating Bottom Dock Navigation */}
        <MobileBottomNav onOpenLookup={() => setIsLookupOpen(true)} />
        
      </div>
    </BrowserRouter>
  );
}
