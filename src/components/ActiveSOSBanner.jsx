import React, { useState } from 'react';
import { 
  AlertOctagon, 
  MapPin, 
  ExternalLink, 
  Copy, 
  Check, 
  MessageSquare, 
  Share2, 
  PhoneCall, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  ShieldCheck,
  Send
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext.jsx';

export default function ActiveSOSBanner() {
  const { 
    sosState, 
    activeAlert, 
    deactivateSOS, 
    contacts, 
    isSirenOn, 
    toggleSiren,
    activeRegion 
  } = useEmergency();

  const [copied, setCopied] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  if (sosState !== 'active' || !activeAlert) return null;

  const handleCopyMessage = () => {
    if (activeAlert?.message) {
      navigator.clipboard.writeText(activeAlert.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleShare = async () => {
    if (navigator.share && activeAlert?.message) {
      try {
        await navigator.share({
          title: 'EMERGENCY SOS ALERT',
          text: activeAlert.message,
          url: activeAlert.mapUrl
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyMessage();
        }
      }
    } else {
      handleCopyMessage();
    }
  };

  // WhatsApp share URL
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(activeAlert.message || '')}`;

  // Multi-recipient or primary SMS link
  const primaryContact = contacts.find(c => c.isPrimary) || contacts[0];
  const primaryPhone = primaryContact ? primaryContact.phone.replace(/[^0-9+]/g, '') : '';
  const smsUrl = primaryPhone 
    ? `sms:${primaryPhone}?body=${encodeURIComponent(activeAlert.message || '')}`
    : `sms:?body=${encodeURIComponent(activeAlert.message || '')}`;

  const defaultEmergencyNumber = activeRegion.services[0]?.number || '911';

  return (
    <div className="w-full bg-gradient-to-b from-red-950/90 via-slate-900 to-slate-900 border-2 border-red-500 rounded-2xl p-4 sm:p-6 shadow-[0_0_50px_rgba(239,68,68,0.35)] text-white mb-8 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-500/30 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center animate-bounce shadow-lg shadow-red-600/50">
            <AlertOctagon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
                SOS ACTIVATED
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white uppercase animate-pulse">
                LIVE
              </span>
            </div>
            <p className="text-xs text-red-200">
              Distress broadcast logged at {activeAlert.dateStr} &bull; {activeAlert.timeStr}
            </p>
          </div>
        </div>

        {/* Siren & Safety Quick Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSiren}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition border ${
              isSirenOn
                ? 'bg-amber-500 text-slate-950 border-amber-300 animate-pulse'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700'
            }`}
          >
            {isSirenOn ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            <span>{isSirenOn ? 'Mute Siren' : 'Play Siren'}</span>
          </button>

          <button
            id="deactivate-sos-button"
            onClick={() => setShowDeactivateConfirm(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5 shadow"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>I Am Safe (Resolve)</span>
          </button>
        </div>
      </div>

      {/* Grid of Alert Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {/* Location & GPS Info */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-400" />
              Recorded Coordinates
            </span>
            <span className="text-emerald-400 font-mono">
              Accurate to ±{activeAlert.accuracy || 15}m
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-sm">
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 block font-sans">Latitude</span>
              <span className="font-bold text-white text-base">
                {activeAlert.latitude !== null ? activeAlert.latitude : 'Acquiring...'}
              </span>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 block font-sans">Longitude</span>
              <span className="font-bold text-white text-base">
                {activeAlert.longitude !== null ? activeAlert.longitude : 'Acquiring...'}
              </span>
            </div>
          </div>

          {/* Clickable Map Link */}
          {activeAlert.mapUrl && (
            <a
              id="sos-map-link"
              href={activeAlert.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-white border border-red-500/40 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Exact Location on Google Maps</span>
            </a>
          )}
        </div>

        {/* Emergency Dispatch Message Preview */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                Prepared Emergency Dispatch
              </span>
              <span className="text-slate-400">{contacts.length} Contact(s) Listed</span>
            </div>

            <pre className="text-xs bg-slate-950/80 p-3 rounded-lg border border-slate-800 font-mono text-slate-300 whitespace-pre-wrap max-h-32 overflow-y-auto leading-relaxed">
              {activeAlert.message}
            </pre>
          </div>

          {/* Quick Action Dispatch Buttons */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <button
              onClick={handleCopyMessage}
              className="py-2 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition"
              title="Copy message text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <a
              href={smsUrl}
              className="py-2 px-2.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/40 text-blue-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-blue-500/40 transition"
              title="Open phone SMS with prepared coordinates"
            >
              <Send className="w-3.5 h-3.5" />
              <span>SMS App</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-2.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-emerald-500/40 transition"
              title="Send via WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Emergency Phone Call Action Bar */}
      <div className="bg-red-950/60 border border-red-800/80 rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-600/30 flex items-center justify-center text-red-400">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Call Emergency Line Directly</p>
            <p className="text-[11px] text-red-300">
              One-touch direct dial to {activeRegion.name} dispatch ({defaultEmergencyNumber})
            </p>
          </div>
        </div>

        <a
          href={`tel:${defaultEmergencyNumber}`}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg transition"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Call {defaultEmergencyNumber} Now</span>
        </a>
      </div>

      {/* Deactivation Confirmation Modal */}
      {showDeactivateConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Confirm Safety & Deactivate?</h3>
            <p className="text-xs text-slate-300">
              This will stop the emergency alert and log this incident as safely resolved in your history.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowDeactivateConfirm(false)}
                className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700"
              >
                Keep SOS Active
              </button>
              <button
                onClick={() => {
                  setShowDeactivateConfirm(false);
                  deactivateSOS();
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow"
              >
                Yes, I Am Safe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
