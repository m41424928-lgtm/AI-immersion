import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { EmergencyProvider } from './context/EmergencyContext.jsx';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ContactsPage from './pages/ContactsPage.jsx';
import EmergencyServicesPage from './pages/EmergencyServicesPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import SOSCountdownModal from './components/SOSCountdownModal.jsx';
import StrobeModal from './components/StrobeModal.jsx';
import { ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  return (
    <EmergencyProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-red-500 selection:text-white">
          {/* Navigation Bar */}
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/services" element={<EmergencyServicesPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </main>

          {/* Global Modals */}
          <SOSCountdownModal />
          <StrobeModal />

          {/* Application Footer */}
          <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
              <div className="flex flex-wrap items-center justify-center gap-2 text-slate-400">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Emergency SOS System
                </span>
                <span>&bull;</span>
                <span>Personal Safety & Real-time Location Alert</span>
              </div>
              <p className="text-[11px] text-slate-400 max-w-xl mx-auto leading-relaxed">
                Notice: This emergency alert system operates via your browser Geolocation and device communication channels. In critical or life-threatening emergencies, immediately dial your official regional emergency dispatch line (e.g., 911, 112, or 999).
              </p>
            </div>
          </footer>
        </div>
      </HashRouter>
    </EmergencyProvider>
  );
}
