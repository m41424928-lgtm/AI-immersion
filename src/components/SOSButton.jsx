import React from 'react';
import { ShieldAlert, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext.jsx';

export default function SOSButton() {
  const { sosState, initiateSOS, activeAlert } = useEmergency();

  const isIdle = sosState === 'idle';
  const isCountdown = sosState === 'countdown';
  const isActive = sosState === 'active';

  return (
    <div className="flex flex-col items-center justify-center relative py-6">
      {/* Background Radiating Radar Rings for high visual prominence */}
      <div className="relative flex items-center justify-center">
        {isIdle && (
          <>
            <div className="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-red-600/10 animate-pulse-ring pointer-events-none"></div>
            <div className="absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-red-600/20 animate-pulse pointer-events-none"></div>
          </>
        )}

        {isCountdown && (
          <>
            <div className="absolute w-72 h-72 rounded-full bg-amber-500/20 animate-pulse-ring-fast pointer-events-none"></div>
            <div className="absolute w-60 h-60 rounded-full bg-amber-500/30 animate-pulse pointer-events-none"></div>
          </>
        )}

        {isActive && (
          <>
            <div className="absolute w-80 h-80 rounded-full bg-red-600/30 animate-pulse-ring-fast pointer-events-none"></div>
            <div className="absolute w-64 h-64 rounded-full bg-red-600/40 animate-ping pointer-events-none"></div>
          </>
        )}

        {/* The Central SOS Circular Button */}
        <button
          id="main-sos-button"
          type="button"
          onClick={initiateSOS}
          disabled={!isIdle}
          aria-label="Emergency SOS Alert Activation Button"
          className={`relative z-10 w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform select-none touch-manipulation focus:outline-none ${
            isIdle
              ? 'bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 active:scale-95 shadow-[0_0_50px_rgba(239,68,68,0.55)] border-4 border-red-300/40 hover:border-red-200 cursor-pointer'
              : isCountdown
              ? 'bg-gradient-to-b from-amber-500 to-amber-600 shadow-[0_0_50px_rgba(245,158,11,0.6)] border-4 border-amber-300/60 cursor-wait scale-105'
              : 'bg-gradient-to-b from-red-600 to-red-800 shadow-[0_0_70px_rgba(239,68,68,0.85)] border-4 border-white/80 animate-pulse cursor-default'
          }`}
        >
          {/* Inner metallic ring border */}
          <div className="absolute inset-2 rounded-full border border-white/20 pointer-events-none"></div>

          {isIdle && (
            <>
              <div className="p-2 bg-red-800/40 rounded-full mb-1">
                <ShieldAlert className="w-8 h-8 sm:w-9 sm:h-9 text-white drop-shadow-md" />
              </div>
              <span className="text-4xl sm:text-5xl font-black tracking-wider text-white drop-shadow-lg font-mono">
                SOS
              </span>
              <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-red-100 mt-1 drop-shadow">
                Press for Help
              </span>
            </>
          )}

          {isCountdown && (
            <>
              <AlertOctagon className="w-8 h-8 text-white mb-1 animate-spin" />
              <span className="text-2xl sm:text-3xl font-black tracking-wide text-white uppercase">
                PRIMING...
              </span>
              <span className="text-xs font-semibold text-amber-100 mt-1">
                Cancel in modal
              </span>
            </>
          )}

          {isActive && (
            <>
              <div className="w-10 h-10 rounded-full bg-white text-red-600 flex items-center justify-center mb-1 shadow-md">
                <AlertOctagon className="w-6 h-6 animate-bounce" />
              </div>
              <span className="text-2xl sm:text-3xl font-black tracking-wider text-white uppercase drop-shadow">
                ACTIVATED
              </span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-red-100 mt-1">
                Alert Live
              </span>
            </>
          )}
        </button>
      </div>

      {/* Button Subtext / Instructions */}
      <div className="mt-5 text-center max-w-sm px-4">
        {isIdle && (
          <p className="text-xs sm:text-sm text-slate-400">
            Tap once to initiate alert. A <strong className="text-slate-200">5-second safety timer</strong> with cancellation window will begin.
          </p>
        )}
        {isCountdown && (
          <p className="text-xs sm:text-sm text-amber-300 font-medium">
            Emergency countdown in progress! Touch &apos;Cancel SOS&apos; anytime to abort.
          </p>
        )}
        {isActive && (
          <div className="flex flex-col items-center gap-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-950/80 border border-red-800 text-red-300">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              Emergency signals broadcasted
            </span>
            <p className="text-xs text-slate-400 mt-1">
              Scroll down to inspect dispatch message or mark yourself safe.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
