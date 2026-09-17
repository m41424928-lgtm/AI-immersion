import React, { useEffect, useState } from 'react';
import { X, AlertOctagon, Volume2, VolumeX } from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext.jsx';

export default function StrobeModal() {
  const { isStrobeOn, toggleStrobe, isSirenOn, toggleSiren } = useEmergency();
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (!isStrobeOn) return;

    const interval = setInterval(() => {
      setFlash(prev => !prev);
    }, 120); // 120ms strobe frequency

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        toggleStrobe();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isStrobeOn, toggleStrobe]);

  if (!isStrobeOn) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 transition-colors duration-75 select-none ${
        flash ? 'bg-red-600 text-white' : 'bg-white text-black'
      }`}
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-black uppercase tracking-widest backdrop-blur">
          <AlertOctagon className="w-4 h-4 animate-spin" />
          <span>Distress Beacon Active</span>
        </div>

        <button
          onClick={toggleStrobe}
          className="p-3 rounded-full bg-black/70 hover:bg-black text-white font-bold transition shadow-xl"
          title="Exit Strobe Mode (Press Esc)"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="text-center">
        <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter uppercase drop-shadow-md">
          SOS
        </h1>
        <p className="text-lg sm:text-2xl font-black uppercase tracking-widest mt-2">
          Emergency Distress Light
        </p>
        <p className="text-xs sm:text-sm font-semibold opacity-80 mt-1 max-w-sm mx-auto">
          Display brightness turned up for maximum visibility to searchers and first responders.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleSiren}
          className="px-5 py-3 rounded-xl bg-black text-white font-bold text-sm flex items-center gap-2 shadow-2xl hover:scale-105 transition"
        >
          {isSirenOn ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
          <span>{isSirenOn ? 'Mute Siren' : 'Enable Audible Siren'}</span>
        </button>

        <button
          onClick={toggleStrobe}
          className="px-5 py-3 rounded-xl bg-black text-white font-bold text-sm shadow-2xl hover:scale-105 transition"
        >
          Close Beacon
        </button>
      </div>
    </div>
  );
}
