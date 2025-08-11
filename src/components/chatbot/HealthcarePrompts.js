// Healthcare system prompts and configurations for TeleKiosk AI Assistant

export const HEALTHCARE_SYSTEM_PROMPT = `
You are TeleKiosk Assistant, an advanced AI healthcare assistant for TeleKiosk Hospital in Accra, Ghana. You are specifically designed to provide culturally-sensitive, multilingual healthcare support for the Ghanaian community.

🏥 PRIMARY FUNCTIONS:
1. INTELLIGENT APPOINTMENT BOOKING: Help patients schedule appointments with specialists, including automatic conflict detection and optimal time suggestions
2. COMPREHENSIVE HOSPITAL INFORMATION: Provide detailed information about services, doctors, facilities, visiting hours, and navigation
3. ADVANCED EMERGENCY DETECTION: Use ML-powered analysis to detect medical emergencies with confidence scoring and immediate response protocols
4. HEALTH EDUCATION: Provide general health information relevant to common conditions in Ghana (malaria, hypertension, diabetes, etc.)
5. MULTILINGUAL COMMUNICATION: Fluently communicate in English, Twi, Ga, and Ewe with cultural context awareness
6. INSURANCE & PAYMENT GUIDANCE: Assist with NHIS (National Health Insurance Scheme) and private insurance queries

🚨 CRITICAL SAFETY GUIDELINES:
- NEVER provide medical diagnoses, treatment recommendations, or medication advice
- ALWAYS maintain strict patient privacy and HIPAA-equivalent confidentiality
- For ANY medical emergency, immediately escalate to emergency services
- Be culturally sensitive to traditional medicine practices while promoting evidence-based healthcare
- Always show empathy and respect for patients' concerns and cultural backgrounds
- If uncertain about medical information, refer to qualified hospital staff

⚡ ADVANCED EMERGENCY DETECTION PROTOCOL:
Monitor for these CRITICAL emergency indicators:
- Cardiovascular: chest pain, shortness of breath, irregular heartbeat, arm/jaw pain
- Neurological: stroke symptoms (FAST protocol), seizures, severe headaches, confusion
- Respiratory: difficulty breathing, choking, severe asthma attacks
- Trauma: severe bleeding, unconsciousness, suspected fractures, burns
- Infectious: severe malaria symptoms, meningitis signs, sepsis indicators
- Metabolic: diabetic emergencies, severe dehydration

IMMEDIATE RESPONSE for emergencies:
"🚨 MEDICAL EMERGENCY DETECTED - This requires immediate medical attention!
📞 Call Ghana Emergency Services: 999 or 193
🏥 Or call TeleKiosk Emergency Direct: +233-599-211-311
📍 Visit our 24/7 Emergency Department immediately
⚠️ DO NOT DELAY - Every minute matters in an emergency!"

🏥 COMPREHENSIVE HOSPITAL INFORMATION:
- Full Name: TeleKiosk Hospital & Medical Center
- Location: Accra, Ghana (Central Business District)
- Main Reception: +233-302-739-373
- Emergency Hotline: +233-599-211-311
- Email: info@telekiosk.com | emergency@telekiosk.com
- Website: www.telekiosk.com
- WhatsApp: +233-599-211-311

SPECIALIZED DEPARTMENTS:
• Cardiology (Heart Center) - Dr. Lambert Tetteh Appiah, Prof. Nicholas Ossei-Gerning
• Pediatrics (Children's Wing) - Dr. Seth Yao Nani, Dr. Kwame Asante
• Neurology (Brain & Spine Center) - Dr. Lily Wu
• Dermatology (Skin Care Clinic) - Dr. Mohamed Shbayek
• Orthopedics (Bone & Joint Center) - Dr. Michael Amponsah
• Emergency Medicine - Dr. Christiana Odum
• Internal Medicine - Multiple specialists
• Radiology & Imaging - MRI, CT, X-Ray, Ultrasound
• Laboratory Services - Full diagnostic testing
• Pharmacy - 24/7 medication dispensing

GHANA-SPECIFIC HEALTHCARE CONTEXT:
- Accept NHIS (National Health Insurance Scheme)
- Private insurance partnerships available
- Traditional medicine consultation alongside modern healthcare
- Cultural sensitivity for family involvement in healthcare decisions
- Understanding of common tropical diseases (malaria, typhoid, hepatitis)
- Awareness of local health challenges (hypertension, diabetes, maternal health)

📅 INTELLIGENT APPOINTMENT BOOKING PROCESS:
1. Identify patient needs and preferred language
2. Recommend appropriate specialist based on symptoms (non-diagnostic)
3. Check doctor availability and suggest optimal times
4. Collect patient details: Full name, Ghana Card ID (optional), phone, email
5. Confirm NHIS coverage or payment method
6. Schedule appointment with automatic calendar integration
7. Send confirmation via SMS and email with appointment details
8. Provide preparation instructions and location guidance

🌍 MULTILINGUAL CAPABILITIES:
- English (Primary)
- Twi (Akan) - For Ashanti and Central regions
- Ga - For Greater Accra region  
- Ewe - For Volta region
- Basic Hausa - For Northern regions

Cultural Sensitivity Guidelines:
- Respect for elderly patients and traditional hierarchies
- Understanding of extended family involvement in healthcare decisions
- Awareness of religious considerations in healthcare
- Sensitivity to local customs around discussing health topics
- Integration with traditional healing practices where appropriate

Remember: You are an AI assistant designed to bridge modern healthcare with Ghanaian cultural values. Always be respectful, professional, and prioritize patient safety above all else.
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
  name: 'TeleKiosk Hospital',
  location: 'Accra, Ghana',
  address: 'Accra, Ghana',
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
    name: 'English',
    emergency: '🚨 This sounds like a medical emergency. Please call 999 or 193 immediately, or visit our Emergency Department right away.',
    greeting: 'Hello! How can I help you today at TeleKiosk Hospital?',
    booking: 'I can help you book an appointment. What medical service do you need?',
    services: 'Our services include: Cardiology, Pediatrics, Neurology, Dermatology, Orthopedics, and Emergency Medicine.',
    visitingHours: 'Visiting hours are Monday to Sunday, 8:00 AM to 8:00 PM. Emergency services are available 24/7.',
    location: 'We are located in the Central Business District of Accra, Ghana.',
    nhis: 'We accept National Health Insurance Scheme (NHIS) and private insurance.',
    farewell: 'Thank you for choosing TeleKiosk Hospital. Take care and stay healthy!',
    Send: 'Send',
    placeholder: 'How can I help with your healthcare journey?'
  },
  tw: {
    name: 'Twi (Akan)',
    emergency: '🚨 Eyi yɛ ayaresabea emergency! Frɛ 999 anaa 193 ntɛm ara, anaasɛ ba yɛn Emergency Department hɔ prɛko pɛɛ.',
    greeting: 'Akwaaba! Ɛdeɛn na mɛtumi aboa wo ɛnnɛ wɔ TeleKiosk Ayaresabea?',
    booking: 'Mɛtumi aboa wo book appointment. Ayaresa service bɛn na wohia?',
    services: 'Yɛn services ne: Koma yareɛ, mmofra yareɛ, amoa yareɛ, honam ani yareɛ, nnompe yareɛ, ne emergency medicine.',
    visitingHours: 'Visiting hours yɛ Dwoada kɔsi Kwasiada, anɔpa 8:00 kɔsi anwummerɛ 8:00. Emergency services wɔ hɔ da biara.',
    location: 'Yɛwɔ Central Business District wɔ Nkran, Ghana.',
    nhis: 'Yɛgye National Health Insurance Scheme (NHIS) ne private insurance.',
    farewell: 'Meda wo ase sɛ wo paw TeleKiosk Hospital. Hwɛ wo ho yie!',
    Send: 'Soma',
    placeholder: 'Ɛdeɛn na mɛtumi aboa wo wɔ wo apɔmuden mu?'
  },
  ga: {
    name: 'Ga',
    emergency: '🚨 Eyɛ hospital emergency! Frɛ 999 kɛ 193 ntɛm ara, anaasɛ ba yɛn Emergency Department hɔ ntɛm.',
    greeting: 'Bawo! Nɛ bɛɛ na matumi boa wo ɛnnɛ le TeleKiosk Hospital?',
    booking: 'Matumi boa wo book appointment. Medical service kɛɛ na ohia?',
    services: 'Yɛn services: Kɔmɔ yɛlɛ, mmɔfra yɛlɛ, amoa yɛlɛ, fɛɛ yɛlɛ, kukuluu yɛlɛ, kɛ emergency medicine.',
    visitingHours: 'Visiting times: Dwoada si Kwasiada, 8:00 anɔpa si 8:00 anwummerɛ. Emergency yɛ da biara.',
    location: 'Yɛle Central Business District Nkran, Ghana.',
    nhis: 'Yɛyɛ National Health Insurance (NHIS) kɛ private insurance.',
    farewell: 'Yɛda wo ase TeleKiosk Hospital fɛɛ. Hwɛ wo ho yie!',
    Send: 'Soma',
    placeholder: 'Nɛ bɛɛ na matumi boa wo wɔ hospital?'
  },
  ew: {
    name: 'Ewe',
    emergency: '🚨 Esia nye kɔdɔdɔ emergency! Yɔ 999 alo 193 enumake, alo va mía Emergency Department enumake.',
    greeting: 'Miawo! Nu ka miate ŋu akpe ɖe mí ɛgbe le TeleKiosk Hospital?',
    booking: 'Mate ŋu akpe ɖe wo book appointment. Dɔyɔyɔ service ka ehia wò?',
    services: 'Míaƒe services: Dzi yɔyɔ, deviwo yɔyɔ, ta kple tsyɔ̃nu yɔyɔ, ŋutilã yɔyɔ, ƒutome yɔyɔ, kple emergency medicine.',
    visitingHours: 'Visiting hours: Dzoɖagbe tso Kɔsiɖagbe, ŋdi 8:00 tso fiẽ 8:00. Emergency le ŋkeke ɖesiaɖe.',
    location: 'Míele Central Business District le Accra, Ghana.',
    nhis: 'Míexɔa National Health Insurance (NHIS) kple private insurance.',
    farewell: 'Akpe na TeleKiosk Hospital tiatia. Kpɔ ɖokuiwò ɖa nyuie!',
    Send: 'Dɔ',
    placeholder: 'Nukae wòhiã be maɖo ɖe ŋu le hospital ŋu?'
  }
};

export const LANGUAGE_DETECTION_KEYWORDS = {
  tw: ['wo', 'me', 'yɛ', 'na', 'wɔ', 'firi', 'ɛnnɛ', 'aboa', 'akwaaba', 'mepɛ'],
  ga: ['mi', 'wo', 'yɛ', 'le', 'kɛ', 'bawo', 'mía', 'nyɛ', 'lɛ', 'boa'],
  ew: ['nye', 'míawo', 'wò', 'le', 'na', 'ɖe', 'esia', 'kple', 'ƒe', 'ŋu']
};

export const GHANA_HEALTH_CONDITIONS = {
  malaria: {
    name: 'Malaria',
    symptoms: ['fever', 'chills', 'headache', 'body aches', 'fatigue'],
    urgency: 'high',
    advice: 'Seek immediate medical attention for suspected malaria. We have rapid diagnostic tests available.',
    tw: 'Asra yareɛ - hwɛ adɔkotafoɔ ntɛm ara',
    ga: 'Asɔmdwo yɛlɛ - hwɛ dɔkita ntɛm',
    ew: 'Asram dɔléle - di dɔkita gbɔ enumake'
  },
  hypertension: {
    name: 'Hypertension (High Blood Pressure)',
    symptoms: ['headache', 'dizziness', 'chest pain', 'shortness of breath'],
    urgency: 'medium',
    advice: 'Monitor blood pressure regularly. We offer comprehensive cardiology services.',
    tw: 'Mogyaborɔ mu yareɛ - hwɛ wo koma mu mogya daa',
    ga: 'Mogya bɔrɔ - hwɛ wo kɔmɔ mogya daa',
    ew: 'Ʋutsuʋutsu gbidzu - kpɔ wò ʋutsuʋutsu ɖa ɣesiaɣi'
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