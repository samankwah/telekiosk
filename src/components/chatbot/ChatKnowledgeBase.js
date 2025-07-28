import { HOSPITAL_INFO, SERVICES } from '../../constants/hospitalData';

export const INTENTS = {
  GREETING: 'greeting',
  BOOKING: 'booking',
  SERVICES: 'services',
  HOSPITAL_INFO: 'hospital_info',
  DIRECTIONS: 'directions',
  HOURS: 'hours',
  EMERGENCY: 'emergency',
  DOCTORS: 'doctors',
  FACILITIES: 'facilities',
  GOODBYE: 'goodbye',
  HELP: 'help',
  UNKNOWN: 'unknown'
};

export const INTENT_PATTERNS = {
  [INTENTS.GREETING]: [
    /\b(hello|hi|hey|good morning|good afternoon|good evening)\b/i,
    /\b(start|begin)\b/i
  ],
  [INTENTS.BOOKING]: [
    /\b(book|schedule|appointment|consultation|reserve)\b/i,
    /\b(see a doctor|meet with|visit)\b/i,
    /\b(book appointment|make appointment)\b/i
  ],
  [INTENTS.SERVICES]: [
    /\b(services|what do you offer|treatments|medical services)\b/i,
    /\b(cardiology|neurology|orthopedics|pediatrics|emergency)\b/i,
    /\b(what services|available services)\b/i
  ],
  [INTENTS.HOSPITAL_INFO]: [
    /\b(hospital|about|information|contact|phone|email|address)\b/i,
    /\b(where are you|location|find you)\b/i,
    /\b(contact information|hospital details)\b/i
  ],
  [INTENTS.DIRECTIONS]: [
    /\b(directions|how to get|where|map|navigate|location)\b/i,
    /\b(find you|reach you|get there)\b/i
  ],
  [INTENTS.HOURS]: [
    /\b(hours|opening hours|visiting hours|when open|schedule)\b/i,
    /\b(what time|open hours|business hours)\b/i
  ],
  [INTENTS.EMERGENCY]: [
    /\b(emergency|urgent|critical|ambulance|911)\b/i,
    /\b(immediate help|emergency number)\b/i
  ],
  [INTENTS.DOCTORS]: [
    /\b(doctors|physician|specialist|staff|medical team)\b/i,
    /\b(who are the doctors|meet the doctors)\b/i
  ],
  [INTENTS.FACILITIES]: [
    /\b(facilities|equipment|rooms|wards|departments)\b/i,
    /\b(what facilities|hospital facilities)\b/i
  ],
  [INTENTS.GOODBYE]: [
    /\b(bye|goodbye|see you|thank you|thanks|done|finished)\b/i,
    /\b(that's all|no more questions)\b/i
  ],
  [INTENTS.HELP]: [
    /\b(help|assist|support|guide|how)\b/i,
    /\b(what can you do|how can you help)\b/i
  ]
};

export const RESPONSES = {
  [INTENTS.GREETING]: [
    "Hello! Welcome to TeleKiosk Hospital. I'm your virtual assistant. How can I help you today?",
    "Hi there! I'm here to help you with hospital information, booking appointments, or answering any questions about our services.",
    "Good day! Welcome to TeleKiosk Hospital. I can help you book appointments, get information about our services, or answer any questions you have."
  ],
  [INTENTS.BOOKING]: [
    "I'd be happy to help you book an appointment! Let me guide you through the process. What type of service do you need?",
    "Great! I can help you schedule an appointment. Which specialty or service are you interested in?",
    "Perfect! Let's get you booked. Could you tell me what type of consultation you need?"
  ],
  [INTENTS.SERVICES]: [
    `We offer comprehensive medical services including: ${SERVICES.map(s => s.title).join(', ')}. Which service would you like to know more about?`,
    "Our hospital provides a wide range of medical services. We specialize in Cardiology, Neurology, Orthopedics, Pediatrics, General Medicine, and Emergency Care. What specific service interests you?",
    "TeleKiosk Hospital offers excellent healthcare services across multiple specialties. Would you like detailed information about any particular service?"
  ],
  [INTENTS.HOSPITAL_INFO]: [
    `${HOSPITAL_INFO.name} is located at ${HOSPITAL_INFO.address}. You can reach us at ${HOSPITAL_INFO.phone} or email us at ${HOSPITAL_INFO.email}. For emergencies, call ${HOSPITAL_INFO.emergency}.`,
    `Here's our contact information: Address: ${HOSPITAL_INFO.address}, Phone: ${HOSPITAL_INFO.phone}, Email: ${HOSPITAL_INFO.email}, Emergency: ${HOSPITAL_INFO.emergency}`,
    `We're ${HOSPITAL_INFO.name}, located in ${HOSPITAL_INFO.address}. Feel free to contact us anytime!`
  ],
  [INTENTS.DIRECTIONS]: [
    `We're located at ${HOSPITAL_INFO.address}. You can easily find us in the Cantonments area of Accra. Would you like me to help you with specific directions?`,
    "Our hospital is conveniently located in Cantonments, Accra. We're easily accessible by both public and private transport.",
    "You can find us at Block F6, Shippi Road, Cantonments, Accra. We're well-known in the area and easy to locate."
  ],
  [INTENTS.HOURS]: [
    "Our hospital operates 24/7 for emergency services. Regular consultation hours are Monday to Friday: 8:00 AM - 6:00 PM, Weekends: 9:00 AM - 4:00 PM. Visiting hours are 10:00 AM - 7:00 PM daily.",
    "We're here for you around the clock! Emergency services are available 24/7. For regular appointments, we're open weekdays 8 AM to 6 PM, and weekends 9 AM to 4 PM.",
    "Our doors are always open for emergencies. Regular services run Monday-Friday 8:00 AM - 6:00 PM, weekends 9:00 AM - 4:00 PM."
  ],
  [INTENTS.EMERGENCY]: [
    `For immediate medical emergencies, please call our emergency line: ${HOSPITAL_INFO.emergency}. Our emergency department is open 24/7 and fully equipped to handle critical situations.`,
    `Emergency services are available 24/7. Call ${HOSPITAL_INFO.emergency} immediately for urgent medical situations. Our emergency team is always ready to help.`,
    "This is an emergency line for critical situations. Please call our emergency number immediately or visit our emergency department."
  ],
  [INTENTS.DOCTORS]: [
    "We have a team of experienced and qualified doctors across all specialties. You can view our complete medical team and their profiles on our doctors page. Would you like information about a specific specialty?",
    "Our medical team consists of expert physicians and specialists dedicated to providing excellent healthcare. Each doctor is highly qualified in their field.",
    "TeleKiosk Hospital is proud to have skilled doctors and specialists. You can meet our team and learn about their expertise on our website."
  ],
  [INTENTS.FACILITIES]: [
    "Our hospital is equipped with modern medical facilities including advanced diagnostic equipment, comfortable patient rooms, specialized treatment areas, and emergency care units. We ensure the highest standards of medical care.",
    "We maintain state-of-the-art medical facilities with the latest technology to provide comprehensive healthcare services. Our infrastructure supports all medical specialties.",
    "TeleKiosk Hospital features modern medical equipment, comfortable patient areas, and specialized departments designed for optimal patient care and treatment."
  ],
  [INTENTS.GOODBYE]: [
    "Thank you for choosing TeleKiosk Hospital! If you need any further assistance, I'm here to help. Have a great day and stay healthy!",
    "It was my pleasure helping you today. Feel free to reach out anytime you need assistance with our hospital services. Take care!",
    "Thank you for visiting TeleKiosk Hospital virtually! I'm always here when you need help. Wishing you good health!"
  ],
  [INTENTS.HELP]: [
    "I can help you with: booking appointments, getting hospital information, learning about our services, finding directions, checking visiting hours, and answering general questions. What would you like to know?",
    "I'm here to assist you with various hospital-related queries. I can help with appointments, services information, contact details, and more. How can I help you today?",
    "You can ask me about our services, book appointments, get directions, check hours, learn about our doctors, or get general hospital information. What interests you?"
  ],
  [INTENTS.UNKNOWN]: [
    "I'm sorry, I didn't quite understand that. Could you please rephrase your question? I can help with appointments, hospital information, services, and more.",
    "I'm not sure I understood your request. I can assist with booking appointments, getting hospital information, or answering questions about our services. How can I help?",
    "Could you please clarify what you're looking for? I'm here to help with hospital services, appointments, information, and general questions."
  ]
};

export const QUICK_ACTIONS = [
  { text: "Book Appointment", intent: INTENTS.BOOKING, icon: "📅" },
  { text: "Our Services", intent: INTENTS.SERVICES, icon: "🏥" },
  { text: "Hospital Info", intent: INTENTS.HOSPITAL_INFO, icon: "ℹ️" },
  { text: "Directions", intent: INTENTS.DIRECTIONS, icon: "🗺️" },
  { text: "Emergency", intent: INTENTS.EMERGENCY, icon: "🚨" },
  { text: "Our Doctors", intent: INTENTS.DOCTORS, icon: "👨‍⚕️" }
];

export const BOOKING_FLOW_STEPS = {
  SERVICE_SELECTION: 'service_selection',
  DATE_SELECTION: 'date_selection',
  TIME_SELECTION: 'time_selection',
  PATIENT_INFO: 'patient_info',
  CONFIRMATION: 'confirmation'
};

export const AVAILABLE_TIMES = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"
];