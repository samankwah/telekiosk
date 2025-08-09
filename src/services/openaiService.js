// OpenAI Service for TeleKiosk Healthcare AI Assistant
import OpenAI from 'openai';
import { analyticsService } from './analyticsService.js';
import { sendBookingConfirmationEmails } from './resendEmailService.js';
import { HEALTHCARE_SYSTEM_PROMPT, APPOINTMENT_SERVICES } from '../components/chatbot/HealthcarePrompts.js';

// Check for environment variables
const getEnvVar = (key, defaultValue = '') => {
  // Try both VITE_ prefixed and non-prefixed versions
  let value = '';
  
  if (typeof window !== 'undefined') {
    // Client-side - use import.meta.env
    value = import.meta.env[key] || import.meta.env[key.replace('VITE_', '')] || defaultValue;
  } else {
    // Server-side - use process.env, try both prefixed and non-prefixed
    value = process.env[key] || process.env[key.replace('VITE_', '')] || defaultValue;
  }
  
  return value;
};

// Initialize OpenAI client (lazily)
let openai = null;

const getOpenAIClient = () => {
  if (!openai) {
    const apiKey = getEnvVar('VITE_OPENAI_API_KEY');
    // console.log('🗝️ Initializing OpenAI client with key:', apiKey ? `${apiKey.slice(0, 7)}...${apiKey.slice(-4)}` : 'NOT FOUND');
    
    openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Only for development - use server-side in production
    });
  }
  return openai;
};

// Configuration
const CONFIG = {
  model: getEnvVar('VITE_AI_MODEL', 'gpt-4o'),
  maxTokens: parseInt(getEnvVar('VITE_AI_MAX_TOKENS', '2000')),
  temperature: parseFloat(getEnvVar('VITE_AI_TEMPERATURE', '0.3')),
  healthcareMode: getEnvVar('VITE_HEALTHCARE_MODE') === 'true'
};

/**
 * Generate chat completion with healthcare-specific handling
 */
export const generateChatCompletion = async (messages, options = {}) => {
  const startTime = Date.now();
  
  try {
    // Ensure system prompt is included
    const messagesWithSystem = [
      { role: 'system', content: HEALTHCARE_SYSTEM_PROMPT },
      ...messages.filter(msg => msg.role !== 'system')
    ];

    // Build OpenAI API parameters (only valid parameters)
    const openaiParams = {
      model: CONFIG.model,
      messages: messagesWithSystem,
      temperature: CONFIG.temperature,
      max_tokens: CONFIG.maxTokens,
      stream: options.stream || false
    };

    // Add functions if enabled
    if (options.allowFunctions) {
      openaiParams.functions = getAvailableFunctions();
      openaiParams.function_call = 'auto';
    }

    const response = await getOpenAIClient().chat.completions.create(openaiParams);

    const responseTime = Date.now() - startTime;
    
    // Track successful API usage
    analyticsService.trackAIModelUsage(CONFIG.model, {
      requestType: 'text',
      responseTime,
      tokenUsage: response.usage?.total_tokens || 0,
      success: true
    });

    // Handle function calls
    if (response.choices[0]?.message?.function_call) {
      return await handleFunctionCall(response.choices[0].message);
    }

    return {
      success: true,
      message: response.choices[0]?.message?.content || 'No response generated',
      usage: response.usage,
      responseTime
    };

  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    console.error('OpenAI API Error:', error);
    
    // Track API error
    analyticsService.trackAIModelUsage(CONFIG.model, {
      requestType: 'text',
      responseTime,
      success: false,
      error: error.message
    });

    return {
      success: false,
      error: getErrorMessage(error),
      responseTime
    };
  }
};

/**
 * Generate streaming chat completion
 */
export const generateStreamingCompletion = async (messages, onChunk, options = {}) => {
  const startTime = Date.now();
  
  try {
    const messagesWithSystem = [
      { role: 'system', content: HEALTHCARE_SYSTEM_PROMPT },
      ...messages.filter(msg => msg.role !== 'system')
    ];

    const stream = await getOpenAIClient().chat.completions.create({
      model: CONFIG.model,
      messages: messagesWithSystem,
      temperature: CONFIG.temperature,
      max_tokens: CONFIG.maxTokens,
      stream: true,
      ...options
    });

    let fullContent = '';
    let tokenCount = 0;

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullContent += content;
        tokenCount++;
        onChunk(content);
      }
    }

    const responseTime = Date.now() - startTime;
    
    // Track streaming completion
    analyticsService.trackAIModelUsage(CONFIG.model, {
      requestType: 'streaming',
      responseTime,
      tokenUsage: tokenCount,
      success: true
    });

    return {
      success: true,
      content: fullContent,
      responseTime
    };

  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    console.error('Streaming Error:', error);
    
    analyticsService.trackAIModelUsage(CONFIG.model, {
      requestType: 'streaming',
      responseTime,
      success: false,
      error: error.message
    });

    throw error;
  }
};

/**
 * Available functions for the AI assistant
 */
const getAvailableFunctions = () => [
  {
    name: 'book_appointment',
    description: 'Book a medical appointment for a patient',
    parameters: {
      type: 'object',
      properties: {
        patientName: {
          type: 'string',
          description: 'Full name of the patient'
        },
        patientEmail: {
          type: 'string',
          description: 'Email address of the patient'
        },
        patientPhone: {
          type: 'string',
          description: 'Phone number of the patient'
        },
        service: {
          type: 'string',
          enum: Object.keys(APPOINTMENT_SERVICES),
          description: 'Type of medical service requested'
        },
        preferredDate: {
          type: 'string',
          description: 'Preferred appointment date (YYYY-MM-DD format)'
        },
        preferredTime: {
          type: 'string',
          description: 'Preferred appointment time (HH:MM format)'
        },
        symptoms: {
          type: 'string',
          description: 'Brief description of symptoms or reason for visit'
        }
      },
      required: ['patientName', 'patientEmail', 'service']
    }
  },
  {
    name: 'get_hospital_info',
    description: 'Get information about hospital services, doctors, or contact details',
    parameters: {
      type: 'object',
      properties: {
        infoType: {
          type: 'string',
          enum: ['services', 'doctors', 'contact', 'visiting_hours', 'location'],
          description: 'Type of information requested'
        },
        service: {
          type: 'string',
          description: 'Specific service to get information about (optional)'
        }
      },
      required: ['infoType']
    }
  },
  {
    name: 'emergency_response',
    description: 'Handle emergency situations and provide immediate guidance',
    parameters: {
      type: 'object',
      properties: {
        emergencyType: {
          type: 'string',
          description: 'Type of emergency detected'
        },
        severity: {
          type: 'string',
          enum: ['high', 'medium', 'low'],
          description: 'Severity level of the emergency'
        },
        symptoms: {
          type: 'string',
          description: 'Symptoms or situation described'
        }
      },
      required: ['emergencyType', 'severity']
    }
  }
];

/**
 * Handle function calls from the AI
 */
const handleFunctionCall = async (message) => {
  const { function_call } = message;
  const functionName = function_call.name;
  const functionArgs = JSON.parse(function_call.arguments);

  console.log(`Executing function: ${functionName}`, functionArgs);

  try {
    let result;

    switch (functionName) {
      case 'book_appointment':
        result = await handleAppointmentBooking(functionArgs);
        break;
      
      case 'get_hospital_info':
        result = handleHospitalInfo(functionArgs);
        break;
      
      case 'emergency_response':
        result = handleEmergencyResponse(functionArgs);
        break;
      
      default:
        result = { error: `Unknown function: ${functionName}` };
    }

    return {
      success: true,
      message: result.message || 'Function executed successfully',
      functionResult: result
    };

  } catch (error) {
    console.error(`Function ${functionName} error:`, error);
    return {
      success: false,
      error: `Failed to execute ${functionName}: ${error.message}`
    };
  }
};

/**
 * Handle appointment booking
 */
const handleAppointmentBooking = async (args) => {
  try {
    // Validate required fields
    if (!args.patientName || !args.patientEmail || !args.service) {
      throw new Error('Missing required booking information');
    }

    // Generate meeting details (simplified for demo)
    const meetingInfo = {
      meetingId: `TK-${Date.now()}`,
      meetingLink: `https://meet.telekiosk.com/appointment/${Date.now()}`,
      calendarUrl: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=TeleKiosk+Appointment&dates=${args.preferredDate}T${args.preferredTime}00/${args.preferredDate}T${args.preferredTime}00`
    };

    // Send booking confirmation emails
    const emailResult = await sendBookingConfirmationEmails(
      {
        patientName: args.patientName,
        patientEmail: args.patientEmail,
        patientPhone: args.patientPhone,
        date: args.preferredDate,
        time: args.preferredTime,
        symptoms: args.symptoms,
        doctor: args.service, // Simplified mapping
        specialty: args.service
      },
      meetingInfo
    );

    // Track booking attempt
    analyticsService.trackBookingAttempt({
      stage: 'completed',
      serviceType: args.service,
      success: emailResult.success,
      method: 'ai_assistant'
    });

    if (emailResult.success) {
      return {
        message: `✅ Appointment booked successfully! 

**Appointment Details:**
- **Service:** ${APPOINTMENT_SERVICES[args.service]?.name || args.service}
- **Date:** ${args.preferredDate}
- **Time:** ${args.preferredTime}
- **Patient:** ${args.patientName}

📧 Confirmation emails have been sent to ${args.patientEmail} and our medical team.
📞 If you need to make changes, call us at +233-599-211-311.

Thank you for choosing TeleKiosk Hospital! 🏥`,
        bookingConfirmed: true,
        meetingInfo
      };
    } else {
      return {
        message: `⚠️ Appointment request received but there was an issue sending confirmation emails. 

**Your booking details:**
- **Service:** ${APPOINTMENT_SERVICES[args.service]?.name || args.service}
- **Date:** ${args.preferredDate}
- **Time:** ${args.preferredTime}

Please call us at +233-599-211-311 to confirm your appointment. Our team will contact you shortly.`,
        bookingPending: true
      };
    }

  } catch (error) {
    analyticsService.trackBookingAttempt({
      stage: 'failed',
      serviceType: args.service,
      success: false,
      error: error.message
    });

    return {
      message: `❌ Unable to complete your appointment booking at this time. 

Please call us directly at +233-599-211-311 or visit our website at www.telekiosk.com to book your appointment.

Our team is available to assist you personally. We apologize for any inconvenience.`,
      error: error.message
    };
  }
};

/**
 * Handle hospital information requests
 */
const handleHospitalInfo = (args) => {
  const { infoType, service } = args;

  switch (infoType) {
    case 'services':
      if (service && APPOINTMENT_SERVICES[service]) {
        const serviceInfo = APPOINTMENT_SERVICES[service];
        return {
          message: `**${serviceInfo.name} ${serviceInfo.icon}**

${serviceInfo.description}

**Available Doctors:**
${serviceInfo.doctors.map(doctor => `• ${doctor}`).join('\n')}

Would you like to book an appointment with one of our ${serviceInfo.name} specialists?`
        };
      } else {
        const servicesList = Object.entries(APPOINTMENT_SERVICES)
          .map(([key, service]) => `• **${service.name}** ${service.icon} - ${service.description}`)
          .join('\n');
        
        return {
          message: `**Our Medical Services:**

${servicesList}

📞 For more information, call +233-599-211-311
🌐 Visit www.telekiosk.com

Which service would you like to know more about?`
        };
      }

    case 'contact':
      return {
        message: `**TeleKiosk Hospital Contact Information**

🏥 **TeleKiosk Hospital**
📍 Liberation Road, Airport Residential Area, Accra, Ghana

📞 **Phone Numbers:**
• Main Line: +233-302 739 373
• Direct Line: +233-599 211 311
• Emergency: 999 or 193

📧 **Email:** info@telekiosk.com
🌐 **Website:** www.telekiosk.com

🕒 **Operating Hours:**
• General Services: Monday - Sunday, 8:00 AM - 8:00 PM
• Emergency Services: 24/7 Available`
        };

    case 'visiting_hours':
      return {
        message: `**Visiting Hours - TeleKiosk Hospital**

🏥 **General Wards:**
Monday - Sunday: 8:00 AM - 8:00 PM

🚨 **ICU/Critical Care:**
Limited visiting hours - Please contact reception
Call +233-599-211-311 for ICU visiting arrangements

⚕️ **Emergency Department:**
24/7 Open for emergencies

📋 **Visiting Guidelines:**
• Maximum 2 visitors per patient at a time
• Children under 12 require adult supervision
• Please follow health and safety protocols
• Bring valid ID for visitor registration

For special visiting arrangements, please contact our reception.`
        };

    case 'location':
      return {
        message: `**TeleKiosk Hospital Location**

🏥 **TeleKiosk Hospital**
📍 Liberation Road, Airport Residential Area
Accra, Ghana

🚗 **Getting Here:**
• Located in Airport Residential Area
• Near Kotoka International Airport
• Accessible by tro-tro, taxi, or private vehicle

🅿️ **Parking:** Available on-site

🗺️ **Need Directions?**
[Get directions on Google Maps](https://maps.google.com/?q=TeleKiosk+Hospital+Accra+Ghana)

📞 **Call for assistance:** +233-599-211-311`
        };

    default:
      return {
        message: "I can provide information about our services, doctors, contact details, visiting hours, or location. What would you like to know?"
      };
  }
};

/**
 * Handle emergency responses
 */
const handleEmergencyResponse = (args) => {
  const { emergencyType, severity, symptoms } = args;

  // Track emergency detection
  analyticsService.trackEmergencyDetection({
    emergencyType,
    severity,
    symptoms: symptoms || 'Not specified',
    detectionMethod: 'ai_assistant'
  });

  if (severity === 'high') {
    return {
      message: `🚨 **MEDICAL EMERGENCY DETECTED**

This appears to be a serious medical emergency requiring immediate attention.

**IMMEDIATE ACTIONS:**
1. **Call emergency services NOW: 999 or 193**
2. **Or call our hospital directly: +233-599-211-311**
3. **Visit our Emergency Department immediately**

**TeleKiosk Hospital Emergency Department:**
📍 Liberation Road, Airport Residential Area, Accra
🚨 24/7 Emergency Services Available
📞 Emergency Hotline: 999 or 193

**DO NOT DELAY** - Seek immediate medical attention.

If this is life-threatening, call 999 immediately.`,
      isEmergency: true,
      severity: 'high'
    };
  } else if (severity === 'medium') {
    return {
      message: `⚠️ **URGENT MEDICAL SITUATION**

Your symptoms suggest you need prompt medical attention.

**RECOMMENDED ACTIONS:**
1. **Call our hospital for immediate guidance: +233-599-211-311**
2. **Consider visiting our Emergency Department**
3. **Monitor your symptoms closely**

**If symptoms worsen, call 999 immediately.**

**TeleKiosk Hospital:**
📞 +233-599-211-311
📍 Liberation Road, Airport Residential Area, Accra
🚨 24/7 Emergency Services Available

Would you like me to help you book an urgent appointment?`,
      isEmergency: true,
      severity: 'medium'
    };
  } else {
    return {
      message: `⚠️ **MEDICAL CONCERN NOTED**

While not an immediate emergency, it's advisable to seek medical consultation.

**RECOMMENDED ACTIONS:**
1. **Book an appointment with our doctors**
2. **Monitor your symptoms**
3. **Contact us if symptoms worsen**

**TeleKiosk Hospital:**
📞 +233-599-211-311
📧 info@telekiosk.com

Would you like me to help you book an appointment with one of our specialists?`,
      isEmergency: false,
      severity: 'low'
    };
  }
};

/**
 * Get user-friendly error message
 */
const getErrorMessage = (error) => {
  if (error.code === 'rate_limit_exceeded') {
    return 'I\'m receiving too many requests right now. Please try again in a few moments.';
  } else if (error.code === 'invalid_api_key') {
    return 'There\'s an issue with my configuration. Please contact hospital IT support.';
  } else if (error.code === 'insufficient_quota') {
    return 'My AI services are temporarily unavailable. Please speak with a hospital staff member.';
  } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
    return 'I\'m having trouble connecting to my AI services. Please check your internet connection and try again.';
  } else {
    return 'I\'m experiencing technical difficulties. Please try again or speak with a hospital staff member for assistance.';
  }
};

/**
 * Get service status
 */
export const getServiceStatus = () => {
  return {
    initialized: !!openai,
    model: CONFIG.model,
    healthcareMode: CONFIG.healthcareMode,
    maxTokens: CONFIG.maxTokens,
    temperature: CONFIG.temperature,
    capabilities: {
      textGeneration: true,
      functionCalling: true,
      streaming: true,
      emergencyDetection: true,
      appointmentBooking: true
    }
  };
};

export default {
  generateChatCompletion,
  generateStreamingCompletion,
  getServiceStatus
};