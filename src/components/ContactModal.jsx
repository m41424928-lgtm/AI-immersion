import React, { useState, useEffect } from 'react';
import { X, User, Phone, Heart, Check, AlertCircle } from 'lucide-react';
import { validatePhoneNumber } from '../utils/formatters.js';

const RELATIONSHIP_OPTIONS = [
  'Family (Parent)',
  'Family (Spouse / Partner)',
  'Family (Sibling)',
  'Family (Child)',
  'Close Friend',
  'Neighbor',
  'Doctor / Healthcare Provider',
  'Work Colleague',
  'Guardian',
  'Other'
];

export default function ContactModal({ isOpen, onClose, onSave, contactToEdit = null }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('Family (Parent)');
  const [customRelationship, setCustomRelationship] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (contactToEdit) {
      setName(contactToEdit.name || '');
      setPhone(contactToEdit.phone || '');
      if (RELATIONSHIP_OPTIONS.includes(contactToEdit.relationship)) {
        setRelationship(contactToEdit.relationship);
        setCustomRelationship('');
      } else {
        setRelationship('Other');
        setCustomRelationship(contactToEdit.relationship || '');
      }
      setIsPrimary(Boolean(contactToEdit.isPrimary));
      setNotes(contactToEdit.notes || '');
      setErrors({});
    } else {
      setName('');
      setPhone('');
      setRelationship('Family (Parent)');
      setCustomRelationship('');
      setIsPrimary(false);
      setNotes('');
      setErrors({});
    }
  }, [contactToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Contact name is required';
    }

    const phoneValidation = validatePhoneNumber(phone);
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.message;
    }

    const finalRelationship = relationship === 'Other' ? (customRelationship.trim() || 'Other') : relationship;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...(contactToEdit ? { id: contactToEdit.id } : {}),
      name: name.trim(),
      phone: phone.trim(),
      relationship: finalRelationship,
      isPrimary,
      notes: notes.trim()
    });

    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {contactToEdit ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Contact Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Full Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: null }));
                }}
                placeholder="e.g., Sarah Connor"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.name ? 'border-red-500' : 'border-slate-800'
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Phone Number <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors(prev => ({ ...prev, phone: null }));
                }}
                placeholder="e.g., +91 98765 43210 or +1 555-0199"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono ${
                  errors.phone ? 'border-red-500' : 'border-slate-800'
                }`}
              />
            </div>
            {errors.phone ? (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.phone}</span>
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 mt-1">
                Include country code for automatic international SMS / WhatsApp dispatch.
              </p>
            )}
          </div>

          {/* Relationship */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Relationship
            </label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {RELATIONSHIP_OPTIONS.map(opt => (
                <option key={opt} value={opt} className="bg-slate-900 text-white">
                  {opt}
                </option>
              ))}
            </select>

            {relationship === 'Other' && (
              <input
                type="text"
                value={customRelationship}
                onChange={(e) => setCustomRelationship(e.target.value)}
                placeholder="Specify relationship (e.g. Caregiver)"
                className="w-full mt-2 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            )}
          </div>

          {/* Primary Contact Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">Primary Emergency Contact</span>
              <span className="text-[11px] text-slate-400">First recipient targeted for urgent SMS & calling</span>
            </div>
            <input
              type="checkbox"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="w-4 h-4 rounded text-red-600 focus:ring-red-500 bg-slate-900 border-slate-700"
            />
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Additional Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Has apartment key, speaks Spanish"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-xs font-bold transition shadow-lg flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{contactToEdit ? 'Save Changes' : 'Add Contact'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
