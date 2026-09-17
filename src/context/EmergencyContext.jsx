import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { playCountdownBeep, playActivationAlert, startSiren, stopSiren } from '../utils/audio.js';
import { formatGoogleMapsUrl, generateEmergencyMessage, formatAlertDateTime } from '../utils/formatters.js';
import { REGIONAL_PRESETS, INITIAL_CONTACTS } from '../data/emergencyServices.js';

const EmergencyContext = createContext(null);

const STORAGE_KEYS = {
  CONTACTS: 'emergency_sos_contacts_v1',
  HISTORY: 'emergency_sos_history_v1',
  REGION: 'emergency_sos_region_v1',
  USER_PROFILE: 'emergency_sos_user_profile_v1'
};

export function EmergencyProvider({ children }) {
  // ----------------------------------------------------
  // Emergency SOS State
  // ----------------------------------------------------
  const [sosState, setSosState] = useState('idle'); // 'idle' | 'countdown' | 'active'
  const [countdown, setCountdown] = useState(5);
  const [activeAlert, setActiveAlert] = useState(null);
  const countdownIntervalRef = useRef(null);

  // ----------------------------------------------------
  // Geolocation State
  // ----------------------------------------------------
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null,
    status: 'idle', // 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable' | 'timeout'
    errorMessage: null,
    addressSummary: null
  });

  // ----------------------------------------------------
  // Siren & Strobe Controls
  // ----------------------------------------------------
  const [isSirenOn, setIsSirenOn] = useState(false);
  const [isStrobeOn, setIsStrobeOn] = useState(false);

  // ----------------------------------------------------
  // Contacts State with LocalStorage
  // ----------------------------------------------------
  const [contacts, setContacts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load contacts from localStorage:', e);
    }
    return INITIAL_CONTACTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    } catch (e) {
      console.warn('Failed to save contacts to localStorage:', e);
    }
  }, [contacts]);

  // ----------------------------------------------------
  // SOS History with LocalStorage
  // ----------------------------------------------------
  const [sosHistory, setSosHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load SOS history:', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(sosHistory));
    } catch (e) {
      console.warn('Failed to save SOS history:', e);
    }
  }, [sosHistory]);

  // ----------------------------------------------------
  // Emergency Services & Region Preset
  // ----------------------------------------------------
  const [selectedRegionId, setSelectedRegionId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.REGION) || 'us';
    } catch (e) {
      return 'us';
    }
  });

  const activeRegion = REGIONAL_PRESETS.find(r => r.id === selectedRegionId) || REGIONAL_PRESETS[0];

  const updateRegion = (regionId) => {
    setSelectedRegionId(regionId);
    try {
      localStorage.setItem(STORAGE_KEYS.REGION, regionId);
    } catch (e) {
      console.warn('Failed to persist region:', e);
    }
  };

  // ----------------------------------------------------
  // User Profile (for personal emergency message)
  // ----------------------------------------------------
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return { name: 'Emergency User', bloodType: 'O+', medicalNotes: 'No known allergies' };
  });

  const updateUserProfile = (profile) => {
    setUserProfile(profile);
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save user profile:', e);
    }
  };

  // ----------------------------------------------------
  // Geolocation System Implementation
  // ----------------------------------------------------
  const requestLocation = useCallback((silent = false) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        status: 'unavailable',
        errorMessage: 'Geolocation is not supported by this browser.'
      }));
      return Promise.reject(new Error('Geolocation not supported'));
    }

    if (!silent) {
      setLocation(prev => ({ ...prev, status: 'requesting', errorMessage: null }));
    }

    return new Promise((resolve, reject) => {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 15000
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const timestamp = position.timestamp || Date.now();
          const newLoc = {
            latitude: Number(latitude.toFixed(6)),
            longitude: Number(longitude.toFixed(6)),
            accuracy: Math.round(accuracy),
            timestamp,
            status: 'granted',
            errorMessage: null,
            addressSummary: `Coordinates: ${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`
          };
          setLocation(newLoc);
          resolve(newLoc);
        },
        (error) => {
          let status = 'unavailable';
          let errorMessage = 'Unable to retrieve location.';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              status = 'denied';
              errorMessage = 'Location permission was denied. Please allow location access in your browser settings for accurate emergency dispatch.';
              break;
            case error.POSITION_UNAVAILABLE:
              status = 'unavailable';
              errorMessage = 'GPS position is currently unavailable. Ensure your device location is switched on.';
              break;
            case error.TIMEOUT:
              status = 'timeout';
              errorMessage = 'Location request timed out. Retrying with network estimation.';
              break;
            default:
              status = 'unavailable';
              errorMessage = error.message || 'An unknown error occurred while retrieving location.';
          }

          setLocation(prev => ({
            ...prev,
            status,
            errorMessage
          }));
          reject(new Error(errorMessage));
        },
        options
      );
    });
  }, []);

  // Check initial permission status silently if Permissions API exists
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' })
        .then(permissionStatus => {
          if (permissionStatus.state === 'granted') {
            requestLocation(true).catch(() => {});
          } else if (permissionStatus.state === 'denied') {
            setLocation(prev => ({
              ...prev,
              status: 'denied',
              errorMessage: 'Location access is currently blocked in your browser settings.'
            }));
          }
          permissionStatus.onchange = () => {
            if (permissionStatus.state === 'granted') {
              requestLocation(true).catch(() => {});
            } else if (permissionStatus.state === 'denied') {
              setLocation(prev => ({ ...prev, status: 'denied', errorMessage: 'Location access blocked.' }));
            }
          };
        })
        .catch(() => {
          // Permissions API query not supported for geolocation in some browsers
        });
    }
  }, [requestLocation]);

  // ----------------------------------------------------
  // SOS Activation Workflow
  // ----------------------------------------------------

  // Step 1: Initiate SOS (User clicks large circular SOS button)
  const initiateSOS = useCallback(() => {
    // Prevent accidental duplicate triggers if already active or countdown
    if (sosState !== 'idle') {
      return;
    }

    // Set countdown state
    setCountdown(5);
    setSosState('countdown');
    playCountdownBeep(880, 0.2);

    // Attempt to acquire fresh location immediately in background
    requestLocation(true).catch(() => {
      // Handled in location state
    });

    // Clear any existing timer
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    let currentSec = 5;
    countdownIntervalRef.current = setInterval(() => {
      currentSec -= 1;
      setCountdown(currentSec);

      if (currentSec > 0) {
        // Play beep for remaining seconds (higher pitch as time runs out)
        playCountdownBeep(880 + (5 - currentSec) * 70, 0.15);
      } else {
        // Countdown reached 0: Activate SOS Alert!
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
        triggerActiveSOS();
      }
    }, 1000);
  }, [sosState, requestLocation]);

  // Step 2: Cancel SOS (User presses Cancel during 5-second countdown)
  const cancelSOS = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setSosState('idle');
    setCountdown(5);

    // Record cancelled event in history for safety audit trail
    const cancelRecord = {
      id: 'alert_' + Date.now(),
      status: 'CANCELLED_BY_USER',
      timestamp: Date.now(),
      dateTime: formatAlertDateTime(new Date()),
      notes: '5-second countdown safely aborted by user before dispatch.'
    };
    setSosHistory(prev => [cancelRecord, ...prev]);
  }, []);

  // Step 3: Trigger Active SOS
  const triggerActiveSOS = useCallback(async () => {
    setSosState('active');
    playActivationAlert();

    // Get current location values or try one more rapid fix
    let lat = location.latitude;
    let lng = location.longitude;
    let acc = location.accuracy;

    if (lat === null || lng === null) {
      try {
        const freshLoc = await requestLocation(true);
        lat = freshLoc.latitude;
        lng = freshLoc.longitude;
        acc = freshLoc.accuracy;
      } catch (err) {
        console.warn('Location fix failed at trigger time:', err);
      }
    }

    const now = new Date();
    const dateTime = formatAlertDateTime(now);
    const mapUrl = formatGoogleMapsUrl(lat, lng);
    const message = generateEmergencyMessage({
      latitude: lat,
      longitude: lng,
      mapUrl,
      timestamp: now.getTime(),
      userName: userProfile.name
    });

    const newAlert = {
      id: 'alert_' + now.getTime(),
      status: 'ACTIVE',
      timestamp: now.getTime(),
      dateStr: dateTime.date,
      timeStr: dateTime.time,
      latitude: lat,
      longitude: lng,
      accuracy: acc,
      mapUrl,
      message,
      contactsNotifiedCount: contacts.length,
      resolvedAt: null
    };

    setActiveAlert(newAlert);
    setSosHistory(prev => [newAlert, ...prev]);
  }, [location, requestLocation, userProfile.name, contacts.length]);

  // Step 4: Deactivate SOS (User marks "I am safe")
  const deactivateSOS = useCallback(() => {
    if (isSirenOn) {
      stopSiren();
      setIsSirenOn(false);
    }
    setIsStrobeOn(false);

    if (activeAlert) {
      const resolvedTimestamp = Date.now();
      const updatedAlert = {
        ...activeAlert,
        status: 'RESOLVED',
        resolvedAt: resolvedTimestamp
      };

      setSosHistory(prev =>
        prev.map(item => (item.id === activeAlert.id ? updatedAlert : item))
      );
    }

    setActiveAlert(null);
    setSosState('idle');
    setCountdown(5);
  }, [activeAlert, isSirenOn]);

  // Toggle Emergency Siren
  const toggleSiren = useCallback(() => {
    if (isSirenOn) {
      stopSiren();
      setIsSirenOn(false);
    } else {
      startSiren();
      setIsSirenOn(true);
    }
  }, [isSirenOn]);

  // Toggle Screen Strobe
  const toggleStrobe = useCallback(() => {
    setIsStrobeOn(prev => !prev);
  }, []);

  // ----------------------------------------------------
  // Contacts Management
  // ----------------------------------------------------
  const addContact = useCallback((newContact) => {
    setContacts(prev => {
      const contactWithId = {
        ...newContact,
        id: Date.now(),
        isPrimary: prev.length === 0 ? true : Boolean(newContact.isPrimary)
      };
      return [...prev, contactWithId];
    });
  }, []);

  const updateContact = useCallback((id, updatedData) => {
    setContacts(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updatedData } : c))
    );
  }, []);

  const deleteContact = useCallback((id) => {
    setContacts(prev => {
      const filtered = prev.filter(c => c.id !== id);
      // If deleted was primary and list is not empty, make first one primary
      if (filtered.length > 0 && !filtered.some(c => c.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  }, []);

  const setPrimaryContact = useCallback((id) => {
    setContacts(prev =>
      prev.map(c => ({
        ...c,
        isPrimary: c.id === id
      }))
    );
  }, []);

  const clearHistory = useCallback(() => {
    setSosHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch (e) {}
  }, []);

  // Cleanup timers & audio on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      stopSiren();
    };
  }, []);

  const value = {
    // SOS State
    sosState,
    countdown,
    activeAlert,
    initiateSOS,
    cancelSOS,
    triggerActiveSOS,
    deactivateSOS,

    // Geolocation
    location,
    requestLocation,

    // Siren & Strobe
    isSirenOn,
    toggleSiren,
    isStrobeOn,
    toggleStrobe,

    // Contacts
    contacts,
    addContact,
    updateContact,
    deleteContact,
    setPrimaryContact,

    // Services & Region
    activeRegion,
    selectedRegionId,
    updateRegion,
    allRegions: REGIONAL_PRESETS,

    // History & Profile
    sosHistory,
    clearHistory,
    userProfile,
    updateUserProfile
  };

  return (
    <EmergencyContext.Provider value={value}>
      {children}
    </EmergencyContext.Provider>
  );
}

export function useEmergency() {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
}
