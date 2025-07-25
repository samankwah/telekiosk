/**
 * Meeting Service for Google Meet Integration
 * Handles Google Meet link generation and email notifications
 */

import { EMAIL_CONFIG, loadEmailJS } from '../config/emailConfig.js';

// Generate a unique meeting ID for Google Meet
const generateMeetingId = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const randomChar = () => chars[Math.floor(Math.random() * chars.length)];
  
  // Format: xxx-xxxx-xxx (Google Meet format)
  return `${randomChar()}${randomChar()}${randomChar()}-${randomChar()}${randomChar()}${randomChar()}${randomChar()}-${randomChar()}${randomChar()}${randomChar()}`;
};

// Create Google Meet link
const createGoogleMeetLink = (meetingData) => {
  // Use the specific Google Meet link provided
  const meetingLink = 'https://meet.google.com/xpp-iwbn-vrw?authuser=0';
  const meetingId = 'xpp-iwbn-vrw';
  
  return {
    meetingId,
    meetingLink,
    joinUrl: meetingLink,
    // Calendar event URL for adding to Google Calendar
    calendarUrl: createGoogleCalendarUrl(meetingData, meetingLink)
  };
};

// Create Google Calendar add event URL
const createGoogleCalendarUrl = (meetingData, meetingLink) => {
  const { date, time, patientName, doctorName, specialty } = meetingData;
  
  // Parse date and time
  const meetingDate = new Date(`${date}T${convertTo24Hour(time)}`);
  const endDate = new Date(meetingDate.getTime() + 30 * 60000); // 30 minutes later
  
  // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
  const startTime = meetingDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const endTime = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  const eventDetails = {
    action: 'TEMPLATE',
    text: `Video Consultation - ${specialty}`,
    dates: `${startTime}/${endTime}`,
    details: `Video consultation with ${doctorName}\\n\\nPatient: ${patientName}\\nSpecialty: ${specialty}\\n\\nJoin Meeting: ${meetingLink}\\n\\nPlease join the meeting 5 minutes before the scheduled time.`,
    location: meetingLink,
    ctz: 'Africa/Accra' // Ghana timezone
  };
  
  const params = new URLSearchParams(eventDetails);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

// Convert 12-hour time to 24-hour format
const convertTo24Hour = (time12h) => {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  
  if (hours === '12') {
    hours = '00';
  }
  
  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
};

// Email service for sending meeting invites
const sendMeetingInvite = async (bookingData, meetingInfo) => {
  // Hospital admin email
  const hospitalAdminEmail = 'albertnartey824@gmail.com';
  
  // Send to both patient and hospital admin
  const patientEmailData = {
    to: bookingData.patientEmail,
    subject: `Video Consultation Confirmed - ${bookingData.patientName}`,
    html: generateEmailTemplate(bookingData, meetingInfo)
  };
  
  const adminEmailData = {
    to: hospitalAdminEmail,
    subject: `New Appointment Booked - ${bookingData.patientName}`,
    html: generateAdminEmailTemplate(bookingData, meetingInfo)
  };
  
  try {
    let patientResult, adminResult;
    
    switch (EMAIL_CONFIG.method) {
      case 'emailjs':
        await loadEmailJS();
        // Send to patient
        patientResult = await sendWithEmailJS(patientEmailData, meetingInfo);
        // Send to admin
        adminResult = await sendWithEmailJS(adminEmailData, meetingInfo);
        break;
        
      case 'api':
        // Send to patient
        patientResult = await sendWithAPI(patientEmailData);
        // Send to admin
        adminResult = await sendWithAPI(adminEmailData);
        break;
        
      case 'mailto':
      default:
        const patientFallback = createMailtoFallback(patientEmailData);
        const adminFallback = createMailtoFallback(adminEmailData);
        return {
          success: true,
          message: 'Email clients opened. Please send the emails manually.',
          fallbackData: { patient: patientFallback, admin: adminFallback },
          emailData: { patient: patientEmailData, admin: adminEmailData }
        };
    }
    
    // Check if both emails were sent successfully
    const bothSuccess = patientResult.success && adminResult.success;
    
    return {
      success: bothSuccess,
      message: bothSuccess 
        ? 'Meeting invites sent successfully to both patient and hospital admin!'
        : 'Some emails may have failed. Please check the details.',
      patientEmail: patientResult,
      adminEmail: adminResult,
      emailData: { patient: patientEmailData, admin: adminEmailData }
    };
    
  } catch (error) {
    console.error('Error sending emails:', error);
    
    // Fallback: Try mailto links as last resort
    const patientFallback = createMailtoFallback(patientEmailData);
    const adminFallback = createMailtoFallback(adminEmailData);
    
    return {
      success: false,
      message: 'Email service unavailable. Mailto links have been opened for manual sending.',
      error: error.message,
      fallbackData: { patient: patientFallback, admin: adminFallback },
      emailData: { patient: patientEmailData, admin: adminEmailData }
    };
  }
};

// EmailJS integration (frontend email service)
const sendWithEmailJS = async (emailData, meetingInfo) => {
  try {
    const templateParams = {
      to_email: emailData.to,
      to_name: emailData.to.split('@')[0],
      subject: emailData.subject,
      message_html: emailData.html,
      meeting_link: meetingInfo.meetingLink,
      meeting_id: meetingInfo.meetingId,
      calendar_link: meetingInfo.calendarUrl
    };
    
    const result = await window.emailjs.send(
      EMAIL_CONFIG.emailjs.serviceId,
      EMAIL_CONFIG.emailjs.templateId,
      templateParams,
      EMAIL_CONFIG.emailjs.publicKey
    );
    
    return {
      success: true,
      message: 'Meeting invite sent successfully via EmailJS!',
      emailData,
      emailJSResponse: result
    };
    
  } catch (error) {
    console.error('EmailJS error:', error);
    throw error;
  }
};

// Backend API integration
const sendWithAPI = async (emailData) => {
  try {
    const response = await fetch(EMAIL_CONFIG.api.endpoint, {
      method: 'POST',
      headers: EMAIL_CONFIG.api.headers,
      body: JSON.stringify(emailData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return {
      success: result.success || true,
      message: result.message || 'Meeting invite sent successfully!',
      emailData
    };
    
  } catch (error) {
    console.error('API email error:', error);
    throw error;
  }
};

// Fallback mailto link
const createMailtoFallback = (emailData) => {
  const mailtoLink = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(
    'Please find your video consultation details in the attached HTML content.'
  )}`;
  
  // Open mailto link
  if (typeof window !== 'undefined') {
    window.open(mailtoLink, '_blank');
  }
  
  return {
    mailtoLink,
    instruction: 'Click the mailto link to send the email manually'
  };
};

// Generate professional email template
const generateEmailTemplate = (bookingData, meetingInfo) => {
  const { patientName, date, time, symptoms } = bookingData;
  const { meetingLink, calendarUrl } = meetingInfo;
  
  // Get doctor info
  const doctorInfo = getDoctorInfo(bookingData.doctor);
  const specialtyInfo = getSpecialtyInfo(bookingData.specialty);
  
  // Format date nicely
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .meeting-card { background: white; padding: 25px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #667eea; }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 10px 5px; }
        .info-row { margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .label { font-weight: 600; color: #555; display: inline-block; width: 120px; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #777; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Your Video Consultation is Confirmed!</h1>
          <p>TeleKiosk Hospital - Online Medical Consultation</p>
        </div>
        
        <div class="content">
          <h2>Hello ${patientName}! 👋</h2>
          <p>Great news! Your video consultation has been successfully scheduled. Here are your appointment details:</p>
          
          <div class="meeting-card">
            <h3>📅 Appointment Details</h3>
            <div class="info-row">
              <span class="label">Doctor:</span> ${doctorInfo.name}
            </div>
            <div class="info-row">
              <span class="label">Specialty:</span> ${specialtyInfo.icon} ${specialtyInfo.name}
            </div>
            <div class="info-row">
              <span class="label">Date:</span> ${formattedDate}
            </div>
            <div class="info-row">
              <span class="label">Time:</span> ${time} (GMT)
            </div>
            ${symptoms ? `<div class="info-row"><span class="label">Symptoms:</span> ${symptoms}</div>` : ''}
          </div>
          
          <div class="meeting-card">
            <h3>🎥 Join Your Video Meeting</h3>
            <p><strong>Meeting Link:</strong> <a href="${meetingLink}" style="color: #667eea;">${meetingLink}</a></p>
            <p><strong>Meeting ID:</strong> ${meetingInfo.meetingId}</p>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="${meetingLink}" class="button">🎥 Join Meeting</a>
              <a href="${calendarUrl}" class="button">📅 Add to Calendar</a>
            </div>
          </div>
          
          <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4>📋 Important Notes:</h4>
            <ul>
              <li>Please join the meeting <strong>5 minutes early</strong></li>
              <li>Ensure you have a stable internet connection</li>
              <li>Test your camera and microphone beforehand</li>
              <li>Find a quiet, well-lit space for the consultation</li>
              <li>Have any relevant medical documents ready</li>
            </ul>
          </div>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #bfdbfe;">
            <h4>🆘 Need Help?</h4>
            <p>If you need to reschedule or have any questions:</p>
            <p>📞 Call: +233-599 211 311<br>
            📧 Email: info@telekiosk.com<br>
            🌐 Visit: www.telekiosk.com</p>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing TeleKiosk Hospital!</p>
          <p><small>This is an automated message. Please do not reply to this email.</small></p>
          <p><small>© 2025 TeleKiosk Hospital. All rights reserved.</small></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate admin notification email template
const generateAdminEmailTemplate = (bookingData, meetingInfo) => {
  const { patientName, patientEmail, patientPhone, date, time, symptoms } = bookingData;
  const { meetingLink } = meetingInfo;
  
  // Get doctor info
  const doctorInfo = getDoctorInfo(bookingData.doctor);
  const specialtyInfo = getSpecialtyInfo(bookingData.specialty);
  
  // Format date nicely
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .appointment-card { background: white; padding: 25px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #dc2626; }
        .patient-card { background: #fef2f2; padding: 20px; border-radius: 8px; margin: 15px 0; border: 1px solid #fecaca; }
        .info-row { margin: 8px 0; padding: 6px 0; }
        .label { font-weight: 600; color: #555; display: inline-block; width: 120px; }
        .value { color: #333; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #777; border-top: 1px solid #eee; }
        .alert { background: #fef3cd; border: 1px solid #faebcd; color: #856404; padding: 15px; border-radius: 8px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏥 New Appointment Notification</h1>
          <p>TeleKiosk Hospital - Admin Dashboard</p>
        </div>
        
        <div class="content">
          <div class="alert">
            <strong>📋 Admin Alert:</strong> A new video consultation has been booked. Please review the details below.
          </div>
          
          <div class="appointment-card">
            <h3>📅 Appointment Details</h3>
            <div class="info-row">
              <span class="label">Doctor:</span>
              <span class="value">${doctorInfo.name}</span>
            </div>
            <div class="info-row">
              <span class="label">Specialty:</span>
              <span class="value">${specialtyInfo.icon} ${specialtyInfo.name}</span>
            </div>
            <div class="info-row">
              <span class="label">Date:</span>
              <span class="value">${formattedDate}</span>
            </div>
            <div class="info-row">
              <span class="label">Time:</span>
              <span class="value">${time} (GMT)</span>
            </div>
            <div class="info-row">
              <span class="label">Meeting Link:</span>
              <span class="value"><a href="${meetingLink}" style="color: #dc2626;">${meetingLink}</a></span>
            </div>
          </div>
          
          <div class="patient-card">
            <h3>👤 Patient Information</h3>
            <div class="info-row">
              <span class="label">Name:</span>
              <span class="value">${patientName}</span>
            </div>
            <div class="info-row">
              <span class="label">Email:</span>
              <span class="value"><a href="mailto:${patientEmail}" style="color: #dc2626;">${patientEmail}</a></span>
            </div>
            ${patientPhone ? `<div class="info-row"><span class="label">Phone:</span><span class="value">${patientPhone}</span></div>` : ''}
            ${symptoms ? `<div class="info-row"><span class="label">Symptoms:</span><span class="value">${symptoms}</span></div>` : ''}
          </div>
          
          <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #b3e5fc;">
            <h4>📋 Action Required:</h4>
            <ul>
              <li>Confirm doctor availability for the scheduled time</li>
              <li>Prepare any necessary medical records</li>
              <li>Ensure technical setup is ready</li>
              <li>Contact patient if any changes are needed</li>
            </ul>
          </div>
          
          <div style="background: #f3e5f5; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e1bee7;">
            <h4>📞 Hospital Contact Information:</h4>
            <p>📞 Main: +233-302 739 373<br>
            🚨 Emergency: +233-599 211 311<br>
            📧 Email: info@telekiosk.com<br>
            🌐 Website: www.telekiosk.com</p>
          </div>
        </div>
        
        <div class="footer">
          <p>TeleKiosk Hospital - Admin Notification System</p>
          <p><small>Booking confirmed at ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Accra' })} (Ghana Time)</small></p>
          <p><small>© 2025 TeleKiosk Hospital. All rights reserved.</small></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Helper function to get doctor info
const getDoctorInfo = (doctorId) => {
  const doctors = {
    1: { name: 'Dr. Sarah Johnson', specialty: 'cardiology' },
    2: { name: 'Dr. Michael Chen', specialty: 'neurology' },
    3: { name: 'Dr. Emily Brown', specialty: 'pediatrics' },
    4: { name: 'Dr. James Wilson', specialty: 'dermatology' },
    5: { name: 'Dr. Lisa Davis', specialty: 'orthopedics' }
  };
  return doctors[doctorId] || { name: 'Dr. Unknown', specialty: 'general' };
};

// Helper function to get specialty info
const getSpecialtyInfo = (specialtyId) => {
  const specialties = {
    'cardiology': { name: 'Cardiology', icon: '❤️' },
    'neurology': { name: 'Neurology', icon: '🧠' },
    'pediatrics': { name: 'Pediatrics', icon: '👶' },
    'dermatology': { name: 'Dermatology', icon: '✨' },
    'orthopedics': { name: 'Orthopedics', icon: '🦴' },
    'emergency': { name: 'Emergency', icon: '🚨' }
  };
  return specialties[specialtyId] || { name: 'General Medicine', icon: '🏥' };
};

// Main booking confirmation function
export const confirmBooking = async (bookingData) => {
  try {
    // Generate meeting info
    const meetingInfo = createGoogleMeetLink({
      date: bookingData.date,
      time: bookingData.time,
      patientName: bookingData.patientName,
      doctorName: getDoctorInfo(bookingData.doctor).name,
      specialty: getSpecialtyInfo(bookingData.specialty).name
    });
    
    // Send email invite
    const emailResult = await sendMeetingInvite(bookingData, meetingInfo);
    
    return {
      success: emailResult.success,
      message: emailResult.message,
      meetingInfo,
      bookingData,
      error: emailResult.error
    };
    
  } catch (error) {
    console.error('Booking confirmation error:', error);
    return {
      success: false,
      message: 'An error occurred while confirming your booking. Please try again.',
      error: error.message
    };
  }
};

// Export individual functions for testing
export {
  generateMeetingId,
  createGoogleMeetLink,
  sendMeetingInvite,
  createGoogleCalendarUrl
};