import React, { useState } from 'react';
import { 
  History, 
  Trash2, 
  MapPin, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  AlertOctagon, 
  Copy, 
  Check, 
  Calendar, 
  Clock, 
  ShieldAlert 
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext.jsx';

export default function HistoryPage() {
  const { sosHistory, clearHistory } = useEmergency();
  const [copiedId, setCopiedId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleCopyMessage = (id, message) => {
    if (message) {
      navigator.clipboard.writeText(message);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              SOS Alert History & Log
            </h1>
            <p className="text-xs text-slate-400">
              Audit trail of all triggered, resolved, and cancelled emergency broadcasts
            </p>
          </div>
        </div>

        {sosHistory.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-red-300 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4 text-slate-400" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* History Items */}
      {sosHistory.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
          <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Past Emergency Alerts</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            When you activate SOS on the Home Dashboard, a timestamped record with your GPS coordinates and message log will be preserved here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sosHistory.map((item, idx) => {
            const isCancelled = item.status === 'CANCELLED_BY_USER';
            const isActive = item.status === 'ACTIVE';
            const isResolved = item.status === 'RESOLVED';

            return (
              <div
                key={item.id || idx}
                className={`bg-slate-900/90 border rounded-2xl p-5 transition shadow-md ${
                  isActive 
                    ? 'border-red-500 bg-red-950/20' 
                    : isResolved
                    ? 'border-emerald-800/60'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${
                      isActive 
                        ? 'bg-red-500 animate-ping' 
                        : isResolved 
                        ? 'bg-emerald-500' 
                        : 'bg-slate-500'
                    }`} />
                    <span className="font-bold text-sm text-white">
                      {isActive && 'ACTIVE EMERGENCY ALERT'}
                      {isResolved && 'SAFELY RESOLVED ALERT'}
                      {isCancelled && 'CANCELLED DURING COUNTDOWN (False Alarm)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.dateStr || new Date(item.timestamp).toLocaleDateString()}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.timeStr || new Date(item.timestamp).toLocaleTimeString()}</span>
                    </span>
                  </div>
                </div>

                {isCancelled ? (
                  <p className="text-xs text-slate-400 italic">
                    {item.notes || 'Cancelled by user during 5-second countdown safeguard.'}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Location Info */}
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-400" />
                        <span>Coordinates at Dispatch:</span>
                      </div>

                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono text-xs text-slate-200">
                        {item.latitude !== null && item.longitude !== null ? (
                          <div className="flex items-center justify-between">
                            <span>{item.latitude}°, {item.longitude}°</span>
                            <span className="text-emerald-400 text-[11px]">±{item.accuracy || 15}m</span>
                          </div>
                        ) : (
                          <span className="text-slate-500">Location unavailable</span>
                        )}
                      </div>

                      {item.mapUrl && (
                        <a
                          href={item.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-medium transition"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View on Google Maps</span>
                        </a>
                      )}
                    </div>

                    {/* Message Preview */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                        <span>Dispatch Message:</span>
                        {item.message && (
                          <button
                            onClick={() => handleCopyMessage(item.id, item.message)}
                            className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                          >
                            {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        )}
                      </div>

                      <pre className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap max-h-24 overflow-y-auto">
                        {item.message || 'No message recorded'}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-950 border border-red-700/80 text-red-400 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Clear All SOS History?</h3>
            <p className="text-xs text-slate-400">
              This will permanently delete all past emergency alert records from your local storage.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700"
              >
                Keep Log
              </button>
              <button
                onClick={() => {
                  clearHistory();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
