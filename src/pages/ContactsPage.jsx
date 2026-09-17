import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Phone, 
  MessageSquare, 
  Star, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  Heart,
  FileText
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext.jsx';
import ContactModal from '../components/ContactModal.jsx';
import { generateEmergencyMessage, formatGoogleMapsUrl } from '../utils/formatters.js';

export default function ContactsPage() {
  const { 
    contacts, 
    addContact, 
    updateContact, 
    deleteContact, 
    setPrimaryContact, 
    location,
    userProfile 
  } = useEmergency();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleOpenAddModal = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleSaveContact = (contactData) => {
    if (editingContact) {
      updateContact(editingContact.id, contactData);
    } else {
      addContact(contactData);
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.relationship.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate test message for direct dispatch
  const mapUrl = formatGoogleMapsUrl(location.latitude, location.longitude);
  const emergencyMessage = generateEmergencyMessage({
    latitude: location.latitude,
    longitude: location.longitude,
    mapUrl,
    timestamp: Date.now(),
    userName: userProfile.name
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Emergency Contacts
              </h1>
              <p className="text-xs text-slate-400">
                Predefined recipients alerted automatically with GPS coordinates upon SOS trigger
              </p>
            </div>
          </div>
        </div>

        <button
          id="add-contact-button"
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-xs font-bold transition shadow-lg flex items-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Emergency Contact</span>
        </button>
      </div>

      {/* Search & Statistics Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone or relationship..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Count Pill */}
        <div className="text-xs text-slate-400 font-medium">
          Total Contacts: <strong className="text-white font-mono">{contacts.length}</strong>
        </div>
      </div>

      {/* Contacts List Grid */}
      {filteredContacts.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">
            {searchQuery ? 'No contacts match your search' : 'No emergency contacts registered'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            {searchQuery 
              ? 'Try searching with a different name or phone number.'
              : 'Add at least one trusted friend, family member or doctor so they receive your emergency alert.'}
          </p>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition inline-flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add First Contact</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map(contact => {
            const cleanPhone = contact.phone.replace(/[^0-9+]/g, '');
            const smsUrl = `sms:${cleanPhone}?body=${encodeURIComponent(emergencyMessage)}`;

            return (
              <div
                key={contact.id}
                className={`bg-slate-900/90 border rounded-2xl p-5 flex flex-col justify-between transition-all shadow-md relative overflow-hidden group ${
                  contact.isPrimary 
                    ? 'border-red-500/80 shadow-red-950/40' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Primary Contact Ribbon */}
                {contact.isPrimary && (
                  <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-bl-xl shadow flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Primary</span>
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-red-300 transition">
                        {contact.name}
                      </h3>
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700/80 mt-1">
                        {contact.relationship}
                      </span>
                    </div>
                  </div>

                  <div className="my-3 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{contact.phone}</span>
                    </div>

                    {contact.notes && (
                      <p className="text-[11px] text-slate-400 italic bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                        &quot;{contact.notes}&quot;
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-800 mt-2 space-y-2">
                  {/* Call & SMS Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${cleanPhone}`}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Call</span>
                    </a>

                    <a
                      href={smsUrl}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                      <span>Send Alert</span>
                    </a>
                  </div>

                  {/* Settings / Edit / Delete buttons */}
                  <div className="flex items-center justify-between pt-1">
                    {!contact.isPrimary ? (
                      <button
                        onClick={() => setPrimaryContact(contact.id)}
                        className="text-[11px] font-semibold text-slate-400 hover:text-amber-300 transition flex items-center gap-1"
                      >
                        <Star className="w-3 h-3" />
                        <span>Set as Primary</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-red-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Primary Alert Target</span>
                      </span>
                    )}

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(contact)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title="Edit contact"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(contact.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
                        title="Delete contact"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-700/80 text-red-400 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Delete Emergency Contact?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to remove this person from your emergency contacts list?
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteContact(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveContact}
        contactToEdit={editingContact}
      />
    </div>
  );
}
