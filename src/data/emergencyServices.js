/**
 * Standard Emergency Services data and regional presets
 */

export const REGIONAL_PRESETS = [
  {
    id: 'in',
    name: 'India',
    flag: '🇮🇳',
    code: '+91',
    services: [
      { id: 'police', name: 'Police', number: '100', altNumber: '112', icon: 'ShieldAlert', description: 'Emergency Police assistance' },
      { id: 'ambulance', name: 'Ambulance', number: '102', altNumber: '108', icon: 'Ambulance', description: 'Medical emergency & patient transport' },
      { id: 'fire', name: 'Fire Brigade', number: '101', altNumber: '112', icon: 'Flame', description: 'Fire & rescue department' },
      { id: 'national', name: 'National Emergency', number: '112', icon: 'PhoneCall', description: 'All-in-one unified emergency helpline' },
      { id: 'women', name: "Women's Helpline", number: '1091', altNumber: '181', icon: 'UserCheck', description: '24/7 Women safety and crisis cell' },
      { id: 'disaster', name: 'Disaster Management', number: '1070', altNumber: '1077', icon: 'AlertTriangle', description: 'NDRF / State disaster response' },
    ]
  },
  {
    id: 'us',
    name: 'United States & Canada',
    flag: '🇺🇸',
    code: '+1',
    services: [
      { id: 'national', name: 'All Emergencies (911)', number: '911', icon: 'PhoneCall', description: 'Unified dispatch for Police, Fire, Ambulance' },
      { id: 'police', name: 'Police (Local Dispatch)', number: '911', icon: 'ShieldAlert', description: 'Immediate law enforcement response' },
      { id: 'ambulance', name: 'Ambulance & Paramedics', number: '911', icon: 'Ambulance', description: 'Emergency medical service (EMS)' },
      { id: 'fire', name: 'Fire Department', number: '911', icon: 'Flame', description: 'Fire rescue and hazmat team' },
      { id: 'crisis', name: 'Suicide & Crisis Lifeline', number: '988', icon: 'HeartHandshake', description: 'Free, confidential 24/7 crisis support' },
      { id: 'poison', name: 'Poison Control Center', number: '1-800-222-1222', icon: 'AlertTriangle', description: 'Expert medical guidance on toxic substances' },
    ]
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    code: '+44',
    services: [
      { id: 'national', name: 'Emergency Services (999)', number: '999', altNumber: '112', icon: 'PhoneCall', description: 'Police, Fire, Ambulance & Coastguard' },
      { id: 'police', name: 'Police', number: '999', altNumber: '101', icon: 'ShieldAlert', description: 'Emergency police response (101 non-emergency)' },
      { id: 'ambulance', name: 'Ambulance (NHS)', number: '999', altNumber: '111', icon: 'Ambulance', description: 'Immediate life-threatening medical care' },
      { id: 'fire', name: 'Fire & Rescue', number: '999', icon: 'Flame', description: 'Fire and structural emergencies' },
      { id: 'women', name: 'Domestic Abuse Helpline', number: '0808 2000 247', icon: 'UserCheck', description: 'Freephone 24/7 helpline' },
    ]
  },
  {
    id: 'au',
    name: 'Australia',
    flag: '🇦🇺',
    code: '+61',
    services: [
      { id: 'national', name: 'Emergency (000)', number: '000', altNumber: '112', icon: 'PhoneCall', description: 'Police, Fire and Ambulance Australia' },
      { id: 'police', name: 'Police', number: '000', altNumber: '131 444', icon: 'ShieldAlert', description: 'Emergency law enforcement' },
      { id: 'ambulance', name: 'Ambulance', number: '000', icon: 'Ambulance', description: 'State ambulance service' },
      { id: 'fire', name: 'Fire Brigade', number: '000', icon: 'Flame', description: 'Fire and rescue services' },
      { id: 'crisis', name: 'Lifeline Australia', number: '13 11 14', icon: 'HeartHandshake', description: '24-hour crisis support' },
    ]
  }
];

export const INITIAL_CONTACTS = [
  {
    id: 1,
    name: "Alex Morgan",
    phone: "+1 555-0199",
    relationship: "Family (Sibling)",
    isPrimary: true,
    notes: "Lives 10 minutes away"
  },
  {
    id: 2,
    name: "Dr. Sarah Jenkins",
    phone: "+1 555-0144",
    relationship: "Doctor / Physician",
    isPrimary: false,
    notes: "Primary care physician"
  },
  {
    id: 3,
    name: "Elena Rostova",
    phone: "+1 555-0182",
    relationship: "Close Friend / Neighbor",
    isPrimary: false,
    notes: "Has spare apartment key"
  }
];
