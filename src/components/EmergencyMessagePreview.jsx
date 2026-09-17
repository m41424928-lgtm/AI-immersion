import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Send, 
  Share2, 
  ExternalLink,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext.jsx';
import { generateEmergencyMessage, formatGoogleMapsUrl } from '../utils/formatters.js';

export default function EmergencyMessagePreview() {
  const { location, contacts, userProfile } = useEmergency();
  const [copied, setCopied] = useState(false);

  // Generate real-time preview message with current location coordinates
  const mapUrl = formatGoogleMapsUrl(location.latitude, location.longitude);
  const previewMessage = generateEmergencyMessage({
    latitude: location.latitude,
    longitude: location.longitude,
    mapUrl,
    timestamp: Date.now(),
    userName: userProfile?.name
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(previewMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EMERGENCY SOS ALERT',
          text: previewMessage,
          url: mapUrl
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  // Primary contact phone
  const primaryContact = contacts.find(c => c.isPrimary) || contacts[0];
  const primaryPhone = primaryContact ? primaryContact.phone.replace(/[^0-9+]/g, '') : '';
  const smsUrl = primaryPhone
    ? `sms:${primaryPhone}?body=${encodeURIComponent(previewMessage)}`
    : `sms:?body=${encodeURIComponent(previewMessage)}`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(previewMessage)}`;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Emergency Message Format</h3>
            <p className="text-xs text-slate-400">Live preview of notification template</p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          Template Preview
        </span>
      </div>

      {/* Terminal / Document view of generated message */}
      <div className="relative my-3">
        <pre className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto selection:bg-red-500 selection:text-white">
          {previewMessage}
        </pre>
      </div>

      {/* Action dispatch buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            id="copy-preview-message-btn"
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white text-xs font-bold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Message'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Share</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={smsUrl}
            className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white text-xs font-bold border border-blue-500/40 transition flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Test SMS Draft</span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-white text-xs font-bold border border-emerald-500/40 transition flex items-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Draft</span>
          </a>
        </div>
      </div>
    </div>
  );
}
