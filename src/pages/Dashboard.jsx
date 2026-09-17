import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  ChevronRight, 
  PhoneCall, 
  Info,
  Radio,
  CheckCircle2,
  AlertOctagon
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext.jsx';
import SOSButton from '../components/SOSButton.jsx';
import LocationCard from '../components/LocationCard.jsx';
import EmergencyServicesCard from '../components/EmergencyServicesCard.jsx';
import EmergencyMessagePreview from '../components/EmergencyMessagePreview.jsx';
import ActiveSOSBanner from '../components/ActiveSOSBanner.jsx';

export default function Dashboard() {
  const { 
    sosState, 
    location, 
    contacts, 
    sosHistory, 
    activeAlert, 
    activeRegion 
  } = useEmergency();

  // Find most recent alert from history
  const recentAlert = sosHistory.length > 0 ? sosHistory[0] : null;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Urgent Status Banner if SOS is Active */}
      <ActiveSOSBanner />

      {/* Main SOS Trigger Hero Section */}
      <section className="bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-2xl">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Dashboard Title & Emergency Readiness Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 max-w-4xl mx-auto">
          <div className="text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              Rapid Alert Dispatch
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Personal Safety & Emergency SOS
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              sosState === 'active'
                ? 'bg-red-950 text-red-300 border-red-800 animate-pulse'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                sosState === 'active' ? 'bg-red-500' : 'bg-emerald-400'
              }`} />
              <span>{sosState === 'active' ? 'ALERT BROADCASTING' : 'System Armed & Ready'}</span>
            </span>
          </div>
        </div>

        {/* The Central Large SOS Button */}
        <SOSButton />

        {/* Quick System Summary Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto mt-6 pt-6 border-t border-slate-800/80">
          {/* Metric 1: Emergency Contacts Count */}
          <Link
            to="/contacts"
            className="bg-slate-950/60 hover:bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-left transition group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Contacts</span>
              <Users className="w-4 h-4 text-red-400 group-hover:scale-110 transition" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              {contacts.length}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center justify-between mt-0.5">
              <span>Configured</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </div>
          </Link>

          {/* Metric 2: GPS Status */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-left">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider">GPS Fix</span>
              <MapPin className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono truncate">
              {location.latitude ? `${location.latitude.toFixed(2)}°` : 'Standby'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {location.status === 'granted' ? `±${location.accuracy || 10}m Accuracy` : 'Permission on request'}
            </div>
          </div>

          {/* Metric 3: Recent SOS Status */}
          <Link
            to="/history"
            className="bg-slate-950/60 hover:bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-left transition group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Recent SOS</span>
              <Clock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
            </div>
            <div className="text-base sm:text-lg font-black text-white font-mono truncate">
              {sosState === 'active' 
                ? 'ACTIVE NOW' 
                : recentAlert 
                ? (recentAlert.status === 'ACTIVE' ? 'Active' : recentAlert.status === 'RESOLVED' ? 'Resolved' : 'Cancelled')
                : 'None'}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center justify-between mt-0.5">
              <span>{recentAlert ? recentAlert.dateStr || 'Saved log' : 'Audit clean'}</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </div>
          </Link>

          {/* Metric 4: Direct Regional Dispatch Line */}
          <a
            href={`tel:${activeRegion.services[0]?.number || '911'}`}
            className="bg-slate-950/60 hover:bg-red-950/30 border border-slate-800 hover:border-red-800/80 rounded-xl p-3 text-left transition group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Direct Line</span>
              <PhoneCall className="w-4 h-4 text-red-400 group-hover:scale-110 transition" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              {activeRegion.services[0]?.number || '911'}
            </div>
            <div className="text-[10px] text-red-300 flex items-center justify-between mt-0.5">
              <span>Tap to Call</span>
              <ChevronRight className="w-3 h-3 text-red-400" />
            </div>
          </a>
        </div>
      </section>

      {/* Grid: Location System & Emergency Message Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LocationCard />
        <EmergencyMessagePreview />
      </div>

      {/* Emergency Services Quick Action Cards */}
      <EmergencyServicesCard />

      {/* Safety Instructions & Quick Checklist */}
      <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 text-slate-300 text-xs">
        <div className="flex items-center gap-2 mb-2 font-bold text-white text-sm">
          <Info className="w-4 h-4 text-blue-400" />
          <span>How the Emergency SOS System Works</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-slate-400">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <strong className="text-slate-200 block mb-1">1. Press SOS Button</strong>
            Initiates a loud 5-second countdown with cancellation safeguard to prevent accidental false alarms.
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <strong className="text-slate-200 block mb-1">2. Auto GPS Acquisition</strong>
            Captures current latitude & longitude and generates an instant Google Maps location link.
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <strong className="text-slate-200 block mb-1">3. Immediate Dispatch</strong>
            Formats the emergency notification ready for multi-contact SMS, WhatsApp, and one-touch police dialing.
          </div>
        </div>
      </section>
    </div>
  );
}
