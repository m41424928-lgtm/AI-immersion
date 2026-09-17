/**
 * Utility functions for Emergency SOS System
 */

export function formatGoogleMapsUrl(latitude, longitude) {
  if (latitude === null || latitude === undefined || longitude === null || longitude === undefined) {
    return 'https://www.google.com/maps';
  }
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

export function generateEmergencyMessage({
  latitude,
  longitude,
  mapUrl,
  timestamp,
  userName = ''
}) {
  const timeStr = timestamp
    ? new Date(timestamp).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'medium'
      })
    : new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'medium'
      });

  const latText = latitude !== null && latitude !== undefined ? latitude : '[Pending GPS Fix]';
  const lngText = longitude !== null && longitude !== undefined ? longitude : '[Pending GPS Fix]';
  const finalMapUrl = mapUrl || formatGoogleMapsUrl(latitude, longitude);

  let message = `EMERGENCY SOS ALERT\n\nI need immediate assistance.`;
  
  if (userName) {
    message += `\nSent by: ${userName}`;
  }

  message += `\n\nMy current location:\nLatitude: ${latText}\nLongitude: ${lngText}\n\nMap:\n${finalMapUrl}\n\nTime:\n${timeStr}`;

  return message;
}

/**
 * Validates international/national phone numbers.
 * Accepts format like +919876543210, +1 555-123-4567, 9876543210, etc.
 * Must contain at least 7 digits, maximum 15 digits (E.164 standard).
 */
export function validatePhoneNumber(phone) {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, message: 'Phone number is required' };
  }

  const cleaned = phone.trim();
  // Regex allowing optional +, digits, spaces, hyphens, parentheses
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,14}$/;
  const digitsOnly = cleaned.replace(/\D/g, '');

  if (digitsOnly.length < 7) {
    return { isValid: false, message: 'Phone number must have at least 7 digits' };
  }

  if (digitsOnly.length > 15) {
    return { isValid: false, message: 'Phone number is too long (maximum 15 digits)' };
  }

  if (!phoneRegex.test(cleaned)) {
    return { isValid: false, message: 'Invalid phone number format (e.g. +919876543210 or 555-0199)' };
  }

  return { isValid: true, message: 'Valid phone number', cleanedDigits: digitsOnly };
}

/**
 * Formats a clean date time string for alerts
 */
export function formatAlertDateTime(date = new Date()) {
  const d = new Date(date);
  return {
    full: d.toLocaleString(),
    date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
    time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };
}
