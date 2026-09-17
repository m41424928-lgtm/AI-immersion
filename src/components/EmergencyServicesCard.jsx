import React, { useState } from 'react';
import { 
  PhoneCall, 
  ShieldAlert, 
  Ambulance, 
  Flame, 
  UserCheck, 
  AlertTriangle, 
  HeartHandshake,
  Globe,
  ChevronRight
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext.jsx';

// Map string icon names to Lucide icons
const iconMap = {
  ShieldAlert,
  Ambulance,
  Flame,
  UserCheck,
  AlertTriangle,
  HeartHandshake,
  PhoneCall
};

export default function EmergencyServicesCard() {
  const { activeRegion, updateRegion, allRegions } = useEmergency();
  const [showRegionPicker, setShowRegionPicker] = useState(false);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md">
      {/* Header with Regional Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Emergency Services Quick-Dial</h3>
            <p className="text-xs text-slate-400">Direct one-touch phone dispatch lines</p>
          </div>
        </div>

        {/* Region Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowRegionPicker(prev => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>{activeRegion.flag} {activeRegion.name}</span>
            <span className="text-[10px] text-slate-400 font-mono">({activeRegion.code})</span>
          </button>

          {showRegionPicker && (
            <div className="absolute right-0 mt-1.5 w-60 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
              <div className="p-2 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Country / Helpline Preset
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/60">
                {allRegions.map(reg => (
                  <button
                    key={reg.id}
                    onClick={() => {
                      updateRegion(reg.id);
                      setShowRegionPicker(false);
                    }}
                    className={`w-full px-3 py-2.5 text-left text-xs flex items-center justify-between transition ${
                      activeRegion.id === reg.id
                        ? 'bg-red-600/20 text-red-300 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{reg.flag}</span>
                      <span>{reg.name}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{reg.code}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Services Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {activeRegion.services.map(service => {
          const IconComponent = iconMap[service.icon] || PhoneCall;
          return (
            <div
              key={service.id}
              className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 flex flex-col justify-between transition-all group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-red-400 flex items-center justify-center shrink-0 group-hover:bg-red-600/20 transition">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">
                      {service.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 mt-1">
                <div className="font-mono text-base font-black text-white">
                  {service.number}
                  {service.altNumber && (
                    <span className="text-[10px] text-slate-400 font-sans font-normal ml-1.5">
                      / {service.altNumber}
                    </span>
                  )}
                </div>

                <a
                  href={`tel:${service.number}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-xs font-bold transition shadow-sm"
                  title={`Call ${service.name}`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
