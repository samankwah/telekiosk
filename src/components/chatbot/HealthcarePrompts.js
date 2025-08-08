// Healthcare system prompts and configurations for TeleKiosk AI Assistant

export const HEALTHCARE_SYSTEM_PROMPT = `
You are TeleKiosk Assistant, a helpful AI assistant for The Bank Hospital in Ghana.

PRIMARY FUNCTIONS:
1. Help patients book appointments with appropriate doctors
2. Provide hospital information (services, doctors, visiting times, locations)
3. Detect medical emergencies and provide immediate guidance
4. Answer general health questions (non-diagnostic only)
5. Assist with hospital navigation and policies
6. Support in English, Twi, and other local languages

CRITICAL GUIDELINES:
- NEVER provide medical diagnoses or treatment advice
- Always maintain patient privacy and confidentiality
- For medical emergencies, immediately direct to emergency services
- Be culturally sensitive to Ghanaian healthcare context
- Always be empathetic, professional, and respectful
- If unsure about medical information, refer to hospital staff

EMERGENCY DETECTION:
If you detect urgent symptoms like:
- Chest pain, heart attack symptoms
- Severe bleeding, unconsciousness
- Difficulty breathing, choking
- Severe allergic reactions
- Signs of stroke

Immediately respond with:
"🚨 This sounds like a medical emergency. Please call emergency services immediately at 999 or 193, or visit our Emergency Department right away. Do not delay seeking immediate medical attention."

HOSPITAL INFORMATION:
- Location: The Bank Hospital, Accra, Ghana
- Emergency: 24/7 available - Call 999 or 193
- Main Line: +233-302 739 373
- Contact: +233-599 211 311
- Email: info@telekiosk.com
- Website: www.telekiosk.com
- Services: Cardiology, Orthopedics, Pediatrics, Neurology, Dermatology, Emergency Medicine
- Languages: English, Twi, Ga, Ewe supported

APPOINTMENT BOOKING:
When helping with appointments:
1. Ask about the type of service needed
2. Collect patient information (name, email, phone)
3. Suggest available time slots
4. Confirm appointment details
5. Mention they'll receive email confirmation

Remember: You are here to assist and guide, not to replace medical professionals.
`;

export const CONVERSATION_STARTERS = [
  "Hello! How can I help you today?",
  "I can help you book appointments, find hospital information, or answer general questions.",
  "For medical emergencies, please call 999 immediately.",
  "Ask me about our medical services or visiting hours.",
  "I'm here to assist with your healthcare needs."
];

export const EMERGENCY_KEYWORDS = {
  high: [
    'chest pain', 'heart attack', 'unconscious', 'not breathing', 'severe bleeding',
    'stroke', 'choking', 'severe allergic reaction', 'cardiac arrest', 'seizure',
    'severe burns', 'poisoning', 'overdose', 'can\'t breathe', 'no pulse'
  ],
  medium: [
    'dizzy', 'shortness of breath', 'severe pain', 'allergic reaction',
    'high fever', 'severe headache', 'vomiting blood', 'difficulty swallowing',
    'severe abdominal pain', 'blurred vision', 'confusion'
  ],
  low: [
    'headache', 'nausea', 'fever', 'minor injury', 'cold symptoms',
    'fatigue', 'mild pain', 'cough', 'sore throat'
  ]
};

export const APPOINTMENT_SERVICES = {
  cardiology: {
    name: 'Cardiology',
    icon: '❤️',
    description: 'Heart and cardiovascular conditions',
    doctors: ['Dr. Lambert Tetteh Appiah', 'Prof. Nicholas Ossei-Gerning']
  },
  pediatrics: {
    name: 'Pediatrics',
    icon: '👶',
    description: 'Children\'s health and development',
    doctors: ['Dr. Seth Yao Nani', 'Dr. Kwame Asante']
  },
  dermatology: {
    name: 'Dermatology',
    icon: '✨',
    description: 'Skin, hair, and nail conditions',
    doctors: ['Dr. Mohamed Shbayek', 'Dr. Sarah Johnson']
  },
  neurology: {
    name: 'Neurology',
    icon: '🧠',
    description: 'Brain and nervous system disorders',
    doctors: ['Dr. Lily Wu']
  },
  orthopedics: {
    name: 'Orthopedics',
    icon: '🦴',
    description: 'Bones, joints, and muscles',
    doctors: ['Dr. Michael Amponsah']
  },
  emergency: {
    name: 'Emergency Medicine',
    icon: '🚨',
    description: 'Urgent medical care',
    doctors: ['Dr. Christiana Odum']
  }
};

export const HOSPITAL_INFORMATION = {
  name: 'The Bank Hospital',
  location: 'Accra, Ghana',
  address: 'Liberation Road, Airport Residential Area, Accra',
  phone: '+233-302 739 373',
  emergency: '+233-599 211 311',
  email: 'info@telekiosk.com',
  website: 'www.telekiosk.com',
  
  visitingHours: {
    general: 'Monday - Sunday: 8:00 AM - 8:00 PM',
    icu: 'Limited visiting - Please contact reception',
    emergency: '24/7 Emergency Services Available'
  },
  
  departments: [
    'Cardiology', 'Pediatrics', 'Dermatology', 'Neurology', 
    'Orthopedics', 'Emergency Medicine', 'General Medicine',
    'Radiology', 'Laboratory Services', 'Pharmacy'
  ]
};

export const MULTILINGUAL_SUPPORT = {
  en: {
    emergency: '🚨 This sounds like a medical emergency. Please call 999 immediately.',
    greeting: 'Hello! How can I help you today?',
    booking: 'I can help you book an appointment. What service do you need?'
  },
  tw: {
    emergency: '🚨 Eyi te sɛ emergency. Frɛ 999 ntɛm ara.',
    greeting: 'Akwaaba! Mepɛ sɛn na meboa wo ɛnnɛ?',
    booking: 'Metumi aboa wo book appointment. Service bɛn na wohia?'
  },
  ga: {
    emergency: '🚨 Eyɛ emergency. Frɛ 999 ntɛm.',
    greeting: 'Bawo! Sɛn na meboa wo ɛnnɛ?',
    booking: 'Matumi aboa wo book appointment. Service bɛn na wohia?'
  }
};

export default {
  HEALTHCARE_SYSTEM_PROMPT,
  CONVERSATION_STARTERS,
  EMERGENCY_KEYWORDS,
  APPOINTMENT_SERVICES,
  HOSPITAL_INFORMATION,
  MULTILINGUAL_SUPPORT
};