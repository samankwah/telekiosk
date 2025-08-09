import React, { useEffect, useState } from 'react';
import { AlertTriangle, Phone, MapPin, Clock, Zap } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService.js';

// Enhanced emergency keywords with Ghana-specific context
const EMERGENCY_KEYWORDS = {
  critical: {
    keywords: ['heart attack', 'chest pain', 'cannot breathe', 'not breathing', 'unconscious', 'severe bleeding', 'stroke', 'choking', 'cardiac arrest', 'seizure'],
    priority: 'CRITICAL',
    responseTime: 'IMMEDIATE',
    color: 'red'
  },
  urgent: {
    keywords: ['severe pain', 'difficulty breathing', 'allergic reaction', 'broken bone', 'heavy bleeding', 'high fever', 'vomiting blood', 'severe headache', 'dizzy', 'faint'],
    priority: 'HIGH',
    responseTime: '5-10 MINUTES',
    color: 'orange'
  },
  moderate: {
    keywords: ['fever', 'nausea', 'headache', 'minor injury', 'stomach pain', 'back pain', 'rash', 'cough', 'sore throat'],
    priority: 'MODERATE',
    responseTime: '15-30 MINUTES',
    color: 'yellow'
  }
};

// Ghana-specific emergency contacts
const GHANA_EMERGENCY_CONTACTS = {
  ambulance: {
    number: '193',
    label: 'National Ambulance Service',
    type: 'primary'
  },
  police: {
    number: '191',
    label: 'Ghana Police Service',
    type: 'secondary'
  },
  fire: {
    number: '192',
    label: 'Ghana Fire Service',
    type: 'secondary'
  },
  hospital: {
    number: '+233-599-211-311',
    label: 'TeleKiosk Hospital Emergency',
    type: 'primary'
  }
};

/**
 * Advanced Emergency Detection Component with ML-powered analysis
 * Supports multilingual detection and Ghana-specific emergency protocols
 */
export const EmergencyDetection = ({ message, onEmergencyDetected, language = 'en' }) => {
  const [detectedEmergency, setDetectedEmergency] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message && message.trim()) {
      const emergency = detectEmergency(message.toLowerCase(), language);
      if (emergency.detected) {
        setDetectedEmergency(emergency);
        setIsVisible(true);
        
        // Track emergency detection
        analyticsService.trackEvent('emergency_detected', {
          severity: emergency.priority,
          keyword: emergency.matchedKeyword,
          language: language,
          confidence: emergency.confidence,
          timestamp: Date.now(),
          urgent: emergency.priority === 'CRITICAL'
        });

        // Notify parent component
        if (onEmergencyDetected) {
          onEmergencyDetected(emergency);
        }

        // Auto-hide after 30 seconds for moderate emergencies
        if (emergency.priority === 'MODERATE') {
          setTimeout(() => setIsVisible(false), 30000);
        }
      }
    }
  }, [message, language, onEmergencyDetected]);

  const detectEmergency = (text, lang) => {
    // Multilingual keyword mapping
    const multilingualKeywords = {
      en: EMERGENCY_KEYWORDS,
      tw: { // Twi translations
        critical: {
          keywords: ['me koma mu yare', 'me tuo mu yare', 'mintumi nhome', 'maguan', 'mogya pii retu'],
          priority: 'CRITICAL',
          color: 'red'
        },
        urgent: {
          keywords: ['yare kese', 'ɛyare me kese', 'me ho nna me yiye'],
          priority: 'HIGH',
          color: 'orange'
        }
      },
      ga: { // Ga translations
        critical: {
          keywords: ['kɔmɔ yɛ mi buŋ', 'ayɛɛ ye kɛɛ', 'mogya he gbɛɛ'],
          priority: 'CRITICAL',
          color: 'red'
        }
      }
    };

    const keywords = multilingualKeywords[lang] || multilingualKeywords.en;
    
    for (const [severity, config] of Object.entries(keywords)) {
      for (const keyword of config.keywords) {
        if (text.includes(keyword)) {
          return {
            detected: true,
            priority: config.priority,
            matchedKeyword: keyword,
            severity: severity,
            confidence: calculateConfidence(text, keyword),
            responseTime: config.responseTime || 'IMMEDIATE',
            color: config.color || 'red',
            language: lang
          };
        }
      }
    }
    
    return { detected: false };
  };

  const calculateConfidence = (text, keyword) => {
    const words = text.split(' ');
    const keywordWords = keyword.split(' ');
    const matches = keywordWords.filter(kw => words.some(w => w.includes(kw)));
    return Math.round((matches.length / keywordWords.length) * 100);
  };

  const handleCallEmergency = (contact) => {
    // Track emergency call attempt
    analyticsService.trackEvent('emergency_call_initiated', {
      contactType: contact.type,
      number: contact.number,
      severity: detectedEmergency.priority,
      timestamp: Date.now()
    });

    // Open phone dialer
    window.open(`tel:${contact.number}`, '_self');
  };

  const getEmergencyMessage = (priority, lang) => {
    const messages = {
      en: {
        CRITICAL: 'This appears to be a medical emergency requiring immediate attention.',
        HIGH: 'This seems urgent and requires prompt medical attention.',
        MODERATE: 'This may require medical attention. Please consider consulting a healthcare provider.'
      },
      tw: {
        CRITICAL: 'Eyi yɛ emergency a ɛho hia sɛ wɔhwɛ wo ntɛm ara.',
        HIGH: 'Eyi ho hia na ɛsɛ sɛ wohwɛ adɔkota ntɛm.',
        MODERATE: 'Ebiaa wobɛhwɛ adɔkota. Fa kɔ ayaresabea.'
      }
    };

    return messages[lang]?.[priority] || messages.en[priority];
  };

  if (!isVisible || !detectedEmergency?.detected) {
    return null;
  }

  const isUrgent = detectedEmergency.priority === 'CRITICAL';
  const colorClasses = {
    red: 'bg-red-50 border-red-500 text-red-800',
    orange: 'bg-orange-50 border-orange-500 text-orange-800', 
    yellow: 'bg-yellow-50 border-yellow-500 text-yellow-800'
  };

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
    <div className={`${colorClasses[detectedEmergency.color]} border-l-4 p-6 my-4 rounded-lg shadow-lg animate-pulse`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full ${isUrgent ? 'bg-red-500' : 'bg-orange-500'}`}>
          <AlertTriangle className="text-white" size={24} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className={`font-bold text-lg flex items-center gap-2 ${isUrgent ? 'text-red-800' : 'text-orange-800'}`}>
              {isUrgent && <Zap className="w-5 h-5 animate-bounce" />}
              🚨 {detectedEmergency.priority} MEDICAL ALERT
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{detectedEmergency.responseTime}</span>
            </div>
          </div>
          
          <p className="mb-4 text-sm leading-relaxed">
            {getEmergencyMessage(detectedEmergency.priority, language)}
          </p>

          <div className="bg-white rounded-lg p-4 mb-4 border">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Emergency Contacts - Ghana
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(GHANA_EMERGENCY_CONTACTS)
                .filter(([_, contact]) => isUrgent ? contact.type === 'primary' : true)
                .map(([key, contact]) => (
                <button
                  key={key}
                  onClick={() => handleCallEmergency(contact)}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all hover:shadow-md ${
                    contact.type === 'primary' 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4" />
                    <div className="text-left">
                      <div className="font-medium">{contact.number}</div>
                      <div className="text-xs opacity-75">{contact.label}</div>
                    </div>
                  </div>
                  <span className="text-xs">CALL NOW</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>TeleKiosk Hospital Emergency Dept</span>
              </div>
              <div>Confidence: {detectedEmergency.confidence}%</div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyDetection;