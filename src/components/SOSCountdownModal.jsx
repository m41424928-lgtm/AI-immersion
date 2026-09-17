import React from 'react';
import { AlertTriangle, XCircle, MapPin, Loader2, ShieldAlert } from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext.jsx';

export default function SOSCountdownModal() {
  const { sosState, countdown, cancelSOS, location } = useEmergency();

  if (sosState !== 'countdown') return null;

  // Progress percentage for circular ring
  const totalSeconds = 5;
  const progressPercent = ((totalSeconds - countdown) / totalSeconds) * 100;
  const strokeDashoffset = 283 - (283 * (totalSeconds - countdown)) / totalSeconds;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-modal-title"
    >
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-red-500/80 rounded-2xl p-6 sm:p-8 shadow-[0_0_80px_rgba(239,68,68,0.4)] text-center text-white overflow-hidden">
        {/* Urgent pulsating top bar */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 animate-pulse" />

        {/* Warning Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/90 border border-red-700/80 text-red-300 text-xs font-extrabold uppercase tracking-wider mb-4">
          <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />
          <span>Confirm Emergency SOS</span>
        </div>

        <h2 id="sos-modal-title" className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
          Activating Emergency Alert
        </h2>
        
        <p className="text-sm text-slate-300 mb-6">
          Distress alert will be broadcast with your live GPS location in:
        </p>

        {/* Countdown Ring Display */}
        <div className="relative flex items-center justify-center my-4">
          <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#334155"
              strokeWidth="8"
            />
            {/* Active Animated Progress */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#ef4444"
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Large Countdown Digit */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-6xl font-black font-mono tracking-tighter text-white drop-shadow-md">
              {countdown}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Seconds
            </span>
          </div>
        </div>

        {/* Live Location Status acquisition ticker during countdown */}
        <div className="my-5 p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-left flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-slate-200 flex items-center justify-between">
              <span>Acquiring Emergency Coordinates</span>
              {location.status === 'requesting' && (
                <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
              )}
            </div>
            <div className="text-slate-400 mt-0.5 font-mono text-[11px]">
              {location.latitude && location.longitude ? (
                <span className="text-emerald-300 font-medium">
                  {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}° (±{location.accuracy || 10}m)
                </span>
              ) : (
                <span className="text-amber-300">Retrieving browser GPS satellite fix...</span>
              )}
            </div>
          </div>
        </div>

        {/* Prominent CANCEL SOS Button */}
        <div className="space-y-3 pt-2">
          <button
            id="cancel-sos-countdown-button"
            type="button"
            onClick={cancelSOS}
            className="w-full py-4 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white font-extrabold text-base sm:text-lg tracking-wide border-2 border-slate-600 hover:border-slate-500 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <XCircle className="w-6 h-6 text-red-400" />
            <span>CANCEL SOS (False Alarm)</span>
          </button>
          
          <p className="text-[11px] text-slate-400">
            Press to abort before notification dispatch and prevent unnecessary response.
          </p>
        </div>
      </div>
    </div>
  );
}
