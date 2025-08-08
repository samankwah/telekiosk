import React from 'react';
import { AlertTriangle, Phone, MapPin, X } from 'lucide-react';

export const EmergencyDetection = ({ emergency, onDismiss }) => {
  if (!emergency || !emergency.detected) return null;

  const getEmergencyLevel = (severity) => {
    switch (severity) {
      case 'high':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-500',
          textColor: 'text-red-800',
          iconColor: 'text-red-500',
          title: '🚨 MEDICAL EMERGENCY DETECTED',
          urgency: 'IMMEDIATE ACTION REQUIRED'
        };
      case 'medium':
        return {
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-500',
          textColor: 'text-orange-800',
          iconColor: 'text-orange-500',
          title: '⚠️ URGENT MEDICAL SITUATION',
          urgency: 'PROMPT MEDICAL ATTENTION NEEDED'
        };
      default:
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-500',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-500',
          title: '⚠️ MEDICAL CONCERN DETECTED',
          urgency: 'CONSIDER MEDICAL CONSULTATION'
        };
    }
  };

  const level = getEmergencyLevel(emergency.severity);

  return (
    <div className={`${level.bgColor} border-l-4 ${level.borderColor} p-4 m-4 rounded-lg shadow-lg relative`}>
      {/* Dismiss Button */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1 hover:bg-black hover:bg-opacity-10 rounded"
          aria-label="Dismiss emergency alert"
        >
          <X size={16} className={level.textColor} />
        </button>
      )}

      <div className="flex items-start">
        <AlertTriangle className={`${level.iconColor} mr-3 flex-shrink-0 mt-1`} size={24} />
        <div className="flex-1">
          <h3 className={`${level.textColor} font-bold text-lg mb-2`}>
            {level.title}
          </h3>
          
          <p className={`${level.textColor} text-sm font-medium mb-3`}>
            {level.urgency}
          </p>

          {emergency.severity === 'high' && (
            <>
              <p className={`${level.textColor} mb-4`}>
                This sounds like a medical emergency. Please take immediate action:
              </p>
              
              <div className="space-y-3 mb-4">
                <div className={`${level.textColor} font-semibold`}>
                  • Call emergency services immediately: 999 or 193
                </div>
                <div className={`${level.textColor} font-semibold`}>
                  • Visit our Emergency Department right away
                </div>
                <div className={`${level.textColor} font-semibold`}>
                  • Do not delay seeking immediate medical attention
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href="tel:999" 
                  className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  <Phone size={16} />
                  Call 999 Emergency
                </a>
                
                <a 
                  href="tel:+233599211311" 
                  className="flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Phone size={16} />
                  Call Hospital: +233-599-211-311
                </a>
                
                <button 
                  onClick={() => {
                    // Open Google Maps to hospital location
                    window.open('https://maps.google.com/?q=The+Bank+Hospital+Accra+Ghana', '_blank');
                  }}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MapPin size={16} />
                  Get Directions to ER
                </button>
              </div>
            </>
          )}

          {emergency.severity === 'medium' && (
            <>
              <p className={`${level.textColor} mb-3`}>
                Your symptoms require prompt medical attention. Please consider:
              </p>
              
              <div className="space-y-2 mb-4">
                <div className={`${level.textColor}`}>
                  • Contact our hospital immediately for guidance
                </div>
                <div className={`${level.textColor}`}>
                  • Consider visiting our Emergency Department
                </div>
                <div className={`${level.textColor}`}>
                  • Monitor your symptoms closely
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href="tel:+233599211311" 
                  className="flex items-center justify-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Phone size={16} />
                  Call Hospital Now
                </a>
                
                <button 
                  onClick={() => {
                    window.open('https://maps.google.com/?q=The+Bank+Hospital+Accra+Ghana', '_blank');
                  }}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MapPin size={16} />
                  Get Directions
                </button>
              </div>
            </>
          )}

          {emergency.severity === 'low' && (
            <>
              <p className={`${level.textColor} mb-3`}>
                While not an emergency, it's good to seek medical consultation:
              </p>
              
              <div className="space-y-2 mb-4">
                <div className={`${level.textColor}`}>
                  • Book an appointment with our doctors
                </div>
                <div className={`${level.textColor}`}>
                  • Monitor your symptoms
                </div>
                <div className={`${level.textColor}`}>
                  • Contact us if symptoms worsen
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    // Trigger appointment booking flow
                    document.querySelector('textarea')?.focus();
                    if (document.querySelector('textarea')) {
                      document.querySelector('textarea').value = 'I want to book an appointment';
                    }
                  }}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Book Appointment
                </button>
                
                <a 
                  href="tel:+233599211311" 
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Phone size={16} />
                  Call for Advice
                </a>
              </div>
            </>
          )}

          {/* Hospital Information */}
          <div className={`${level.textColor} text-sm mt-4 p-3 bg-white bg-opacity-50 rounded-lg`}>
            <strong>The Bank Hospital Emergency Department</strong><br />
            📍 Liberation Road, Airport Residential Area, Accra<br />
            📞 Emergency: 999 or 193<br />
            📞 Direct: +233-599-211-311<br />
            🏥 24/7 Emergency Services Available
          </div>
        </div>
      </div>
    </div>
  );
};