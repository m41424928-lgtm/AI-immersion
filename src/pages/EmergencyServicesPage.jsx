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
  ExternalLink,
  LifeBuoy,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext.jsx';

const iconMap = {
  ShieldAlert,
  Ambulance,
  Flame,
  UserCheck,
  AlertTriangle,
  HeartHandshake,
  PhoneCall
};

const SAFETY_TIPS = [
  {
    title: 'During Personal Assault or Threat',
    color: 'red',
    points: [
      'Activate SOS immediately to establish GPS coordinates and timestamped record.',
      'Head towards crowded, well-lit public zones or commercial premises.',
      'Shout clear instructions ("Call Police!") rather than generic calls for help.',
      'Avoid isolated alleys, stairwells, or dead ends.'
    ]
  },
  {
    title: 'Medical Emergencies & First Aid',
    color: 'emerald',
    points: [
      'Call Ambulance (EMS) first before attempting complex movement of injured person.',
      'Check for responsiveness, pulse, and airway clearance.',
      'Apply firm direct pressure with clean cloth on severe arterial bleedings.',
      'Keep patient calm, warm, and conscious while emergency personnel are en route.'
    ]
  },
  {
    title: 'Fire & Smoke Evacuation',
    color: 'amber',
    points: [
      'Crawl low under smoke — clean air stays closest to the floor level.',
      'Test door handles with the back of your hand before turning.',
      'Never use elevators during a structural fire alert.',
      'Once outside at assembly point, never re-enter a burning structure.'
    ]
  }
];

export default function EmergencyServicesPage() {
  const { activeRegion, updateRegion, allRegions } = useEmergency();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Emergency Services & Hotlines
            </h1>
            <p className="text-xs text-slate-400">
              Verified national dispatch numbers and crisis response services
            </p>
          </div>
        </div>

        {/* Region selector tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
          {allRegions.map(reg => (
            <button
              key={reg.id}
              onClick={() => updateRegion(reg.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeRegion.id === reg.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{reg.flag}</span>
              <span>{reg.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeRegion.services.map(service => {
          const IconComponent = iconMap[service.icon] || PhoneCall;
          return (
            <div
              key={service.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-red-400 flex items-center justify-center group-hover:bg-red-600/20 group-hover:scale-105 transition">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                    24/7 Helpline
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1">
                  {service.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {service.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-semibold">
                    Direct Line
                  </span>
                  <span className="font-mono text-xl font-black text-white">
                    {service.number}
                  </span>
                </div>

                <a
                  href={`tel:${service.number}`}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-xs font-bold transition shadow-md flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency First-Aid and Crisis Protocols */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md mt-8">
        <div className="flex items-center gap-2.5 mb-4">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <h2 className="text-base font-bold text-white">
            Essential Emergency Guidelines & Immediate Protocols
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SAFETY_TIPS.map((tip, idx) => (
            <div key={idx} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-bold text-white mb-2.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span>{tip.title}</span>
              </h3>
              <ul className="space-y-2 text-[11px] text-slate-300">
                {tip.points.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-1.5">
                    <span className="text-slate-500 mt-0.5">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
