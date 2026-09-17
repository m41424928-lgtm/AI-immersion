import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Info,
  Clock,
  Compass
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext.jsx';
import { formatGoogleMapsUrl } from '../utils/formatters.js';

export default function LocationCard() {
  const { location, requestLocation } = useEmergency();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleAcquireLocation = async () => {
    setIsRefreshing(true);
    try {
      await requestLocation(false);
    } catch (err) {
      // error is populated in location.status & location.errorMessage
    } finally {
      setIsRefreshing(false);
    }
  };

  const mapUrl = formatGoogleMapsUrl(location.latitude, location.longitude);
  const hasCoordinates = location.latitude !== null && location.longitude !== null;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              GPS Location System
            </h3>
            <p className="text-xs text-slate-400">Real-time Browser Geolocation API</p>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {location.status === 'granted' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Permission Granted</span>
            </span>
          )}
          {location.status === 'requesting' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-800">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Requesting Fix...</span>
            </span>
          )}
          {location.status === 'denied' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-950/80 text-red-300 border border-red-800">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Permission Blocked</span>
            </span>
          )}
          {location.status === 'unavailable' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-800">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>GPS Unavailable</span>
            </span>
          )}
          {location.status === 'timeout' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-800">
              <Clock className="w-3.5 h-3.5" />
              <span>Fix Timeout</span>
            </span>
          )}
          {location.status === 'idle' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              <Navigation className="w-3.5 h-3.5" />
              <span>Standby</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Coordinate Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        {/* Latitude */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block mb-1">
            Latitude
          </span>
          <div className="font-mono text-base sm:text-lg font-extrabold text-white">
            {location.latitude !== null ? location.latitude.toFixed(6) : '— — — — —'}
          </div>
          <span className="text-[10px] text-slate-400">Decimal Degrees (N/S)</span>
        </div>

        {/* Longitude */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block mb-1">
            Longitude
          </span>
          <div className="font-mono text-base sm:text-lg font-extrabold text-white">
            {location.longitude !== null ? location.longitude.toFixed(6) : '— — — — —'}
          </div>
          <span className="text-[10px] text-slate-400">Decimal Degrees (E/W)</span>
        </div>

        {/* Accuracy */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block mb-1">
            Accuracy
          </span>
          <div className="font-mono text-base sm:text-lg font-extrabold text-white flex items-center gap-1.5">
            {location.accuracy !== null ? (
              <>
                <span className="text-emerald-400">±{location.accuracy}m</span>
                <span className="text-[11px] font-sans font-normal text-slate-400">
                  {location.accuracy <= 20 ? '(High)' : '(Approx)'}
                </span>
              </>
            ) : (
              <span className="text-slate-500">—</span>
            )}
          </div>
          <span className="text-[10px] text-slate-400">Horizontal radius</span>
        </div>
      </div>

      {/* Error / Warning Notice if permission denied or unavailable */}
      {location.errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-200">Location Alert</p>
            <p className="mt-0.5 text-red-300/90">{location.errorMessage}</p>
            {location.status === 'denied' && (
              <p className="mt-1 text-[11px] text-slate-300">
                Tip: Click the padlock/settings icon in your browser address bar and set <strong>Location</strong> to <strong>Allow</strong>.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Action Controls & Map Link */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            id="request-location-button"
            type="button"
            onClick={handleAcquireLocation}
            disabled={isRefreshing || location.status === 'requesting'}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white text-xs font-bold border border-slate-700 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>
              {hasCoordinates ? 'Refresh GPS Fix' : 'Acquire GPS Location'}
            </span>
          </button>

          {!hasCoordinates && (
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Permission requested upon activation
            </span>
          )}
        </div>

        {/* Clickable Map Link */}
        {hasCoordinates ? (
          <a
            id="current-location-map-link"
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold transition"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>View on Google Maps</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        ) : (
          <span className="text-xs text-slate-400 italic">
            Map link generated when coordinates are acquired
          </span>
        )}
      </div>
    </div>
  );
}
