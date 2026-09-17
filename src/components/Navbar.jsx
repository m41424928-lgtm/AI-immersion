import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShieldAlert, 
  Users, 
  PhoneCall, 
  History, 
  Volume2, 
  VolumeX, 
  Flashlight, 
  Menu, 
  X, 
  Radio, 
  MapPin,
  Flame
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext.jsx';

export default function Navbar() {
  const routerLocation = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { 
    sosState, 
    contacts, 
    location, 
    isSirenOn, 
    toggleSiren, 
    isStrobeOn, 
    toggleStrobe,
    activeRegion
  } = useEmergency();

  const isAlertActive = sosState === 'active';

  const navItems = [
    { path: '/', label: 'Home Dashboard', icon: Radio },
    { path: '/contacts', label: 'Emergency Contacts', icon: Users, badge: contacts.length },
    { path: '/services', label: 'Emergency Services', icon: PhoneCall },
    { path: '/history', label: 'Alert History', icon: History }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      {/* Active SOS High Alert Header Banner if triggered */}
      {isAlertActive && (
        <div className="bg-red-600 text-white px-4 py-2 font-bold flex items-center justify-between text-sm sm:text-base animate-pulse shadow-lg">
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-white rounded-full animate-ping"></span>
              <span>EMERGENCY SOS IS ACTIVATED — DISTRESS SIGNALS PRIMED</span>
            </div>
            <Link 
              to="/" 
              className="bg-white text-red-700 px-3 py-1 rounded text-xs font-extrabold uppercase hover:bg-red-50 transition"
            >
              View Active Alert
            </Link>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              isAlertActive 
                ? 'bg-red-600 shadow-lg shadow-red-600/50 animate-bounce' 
                : 'bg-red-500/10 border border-red-500/30 group-hover:bg-red-500/20'
            }`}>
              <ShieldAlert className={`w-6 h-6 ${isAlertActive ? 'text-white' : 'text-red-500'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                  Emergency SOS
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-red-950/80 text-red-400 border border-red-800/60">
                  Live Safety
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Personal Safety & Alert System</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = routerLocation.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                    isActive
                      ? 'bg-slate-800 text-white font-semibold shadow-inner border border-slate-700'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-red-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full text-xs font-bold ${
                      isActive ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Tools & Status Indicator */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Siren Toggle Button */}
            <button
              id="header-siren-toggle"
              onClick={toggleSiren}
              title={isSirenOn ? 'Turn off siren' : 'Sound emergency siren'}
              className={`p-2 sm:px-3 sm:py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border ${
                isSirenOn
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30 animate-pulse'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700'
              }`}
            >
              {isSirenOn ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
              <span className="hidden sm:inline">{isSirenOn ? 'Mute Siren' : 'Siren'}</span>
            </button>

            {/* Screen Strobe / Distress Light Toggle */}
            <button
              id="header-strobe-toggle"
              onClick={toggleStrobe}
              title="Toggle flashing strobe light for low-light rescue"
              className={`p-2 sm:px-3 sm:py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border ${
                isStrobeOn
                  ? 'bg-yellow-400 text-slate-950 border-yellow-300 shadow-md shadow-yellow-400/40'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700'
              }`}
            >
              <Flashlight className={`w-4 h-4 ${isStrobeOn ? 'text-slate-950' : 'text-yellow-400'}`} />
              <span className="hidden sm:inline">Strobe</span>
            </button>

            {/* GPS Status Indicator */}
            <div 
              title={
                location.status === 'granted'
                  ? `GPS Locked: ±${location.accuracy}m`
                  : location.status === 'denied'
                  ? 'GPS Permission Denied'
                  : 'GPS Standby'
              }
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium ${
                location.status === 'granted'
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
                  : location.status === 'denied'
                  ? 'bg-red-950/60 text-red-300 border-red-800/80'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                location.status === 'granted'
                  ? 'bg-emerald-400 animate-pulse'
                  : location.status === 'denied'
                  ? 'bg-red-400'
                  : 'bg-slate-500'
              }`} />
              <span>
                {location.status === 'granted' ? 'GPS Active' : location.status === 'denied' ? 'GPS Blocked' : 'GPS Ready'}
              </span>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = routerLocation.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive
                    ? 'bg-red-600/20 text-red-400 border border-red-500/40'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-slate-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Current Region Preset:</span>
            <span className="font-semibold text-slate-200">{activeRegion.flag} {activeRegion.name}</span>
          </div>
        </div>
      )}
    </header>
  );
}
