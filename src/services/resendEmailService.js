/**
 * Resend Email Service for TeleKiosk
 * Handles booking confirmation emails using Resend API
 */

// Resend configuration
const RESEND_CONFIG = {
  apiKey: 're_SesZDBJ9_7f3RPpVE1JyfNXBZJUTfHkEW', // Your Resend API key
  apiUrl: 'https://api.resend.com/emails',
  fromEmail: 'TeleKiosk Hospital <onboarding@resend.dev>', // Using Resend's default domain for now
  hospitalAdminEmail: 'albertnartey824@gmail.com'
};

/**
 * Send email using Resend API
 * @param {Object} emailData - Email data object
 * @returns {Promise} - Promise resolving to email result
 */
const sendEmailWithResend = async (emailData) => {
  try {
    const response = await fetch(RESEND_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_CONFIG.fromEmail,
        to: Array.isArray(emailData.to) ? emailData.to : [emailData.to],
        subject: emailData.subject,
        html: emailData.html,
        tags: [
          { name: 'category', value: 'booking-confirmation' },
          { name: 'system', value: 'telekiosk' }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Resend API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const result = await response.json();
    return {
      success: true,
      message: 'Email sent successfully via Resend!',
      data: result,
      emailId: result.id
    };

  } catch (error) {
    console.error('Resend email error:', error);
    return {
      success: false,
      message: 'Failed to send email via Resend',
      error: error.message
    };
  }
};

/**
 * Send booking confirmation emails to both patient and admin
 * @param {Object} bookingData - Booking information
 * @param {Object} meetingInfo - Meeting details
 * @returns {Promise} - Promise resolving to email results
 */
export const sendBookingConfirmationEmails = async (bookingData, meetingInfo) => {
  try {
    // Debug log
    console.log('🔧 Attempting to send emails via port 3002...');
    
    // Call our backend server to send emails
    const response = await fetch('http://localhost:3002/api/send-booking-emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingData,
        meetingInfo
      })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    return {
      success: result.success,
      message: result.message,
      results: result.results,
      emailData: result.emailData || null
    };

  } catch (error) {
    console.error('Email service error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Check if it's a connection error
    const isConnectionError = error.message.includes('Failed to fetch') || 
                             error.message.includes('ECONNREFUSED') ||
                             error.message.includes('fetch');
    
    // Return a more user-friendly error message
    return {
      success: false,
      message: isConnectionError 
        ? 'UPDATED: Email server connection failed. Trying port 3002 - please try again in a moment.'
        : `UPDATED: Email sending failed: ${error.message}`,
      error: error.message,
      serverPort: '3002',
      instructions: isConnectionError 
        ? 'The email server should be running on port 3002. Please check if it\'s started.'
        : 'Please check the email service configuration.'
    };
  }
};

/**
 * Generate patient email template
 */
const generatePatientEmailTemplate = (bookingData, meetingInfo) => {
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
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Video Consultation Confirmed</title>
      <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0 0 10px 0; font-size: 28px; font-weight: 700; }
        .header p { margin: 0; font-size: 16px; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 20px; font-weight: 600; color: #333; margin-bottom: 20px; }
        .intro { font-size: 16px; color: #666; margin-bottom: 30px; }
        .meeting-card { background: #f8f9fa; border: 1px solid #e9ecef; border-left: 4px solid #667eea; border-radius: 8px; padding: 25px; margin: 25px 0; }
        .meeting-card h3 { margin: 0 0 20px 0; font-size: 18px; color: #333; }
        .info-row { display: flex; margin-bottom: 12px; align-items: center; }
        .info-label { font-weight: 600; color: #555; min-width: 120px; font-size: 14px; }
        .info-value { color: #333; font-size: 14px; }
        .meeting-link { background: #e8f4fd; border: 1px solid #b3d9f2; border-radius: 8px; padding: 20px; margin: 25px 0; }
        .meeting-link h3 { margin: 0 0 15px 0; font-size: 18px; color: #0066cc; }
        .meeting-link a { color: #0066cc; text-decoration: none; font-weight: 500; }
        .button-container { text-align: center; margin: 30px 0; }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 8px; font-size: 14px; }
        .button:hover { opacity: 0.9; }
        .important-notes { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 25px 0; }
        .important-notes h4 { margin: 0 0 15px 0; color: #856404; font-size: 16px; }
        .important-notes ul { margin: 0; padding-left: 20px; }
        .important-notes li { color: #856404; margin-bottom: 8px; font-size: 14px; }
        .help-section { background: #e8f5e8; border: 1px solid #c3e6c3; border-radius: 8px; padding: 20px; margin: 25px 0; }
        .help-section h4 { margin: 0 0 15px 0; color: #155724; font-size: 16px; }
        .help-section p { color: #155724; margin: 5px 0; font-size: 14px; }
        .footer { background: #f8f9fa; border-top: 1px solid #e9ecef; padding: 30px; text-align: center; color: #666; }
        .footer p { margin: 5px 0; font-size: 14px; }
        .footer small { font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Your Video Consultation is Confirmed!</h1>
          <p>TeleKiosk Hospital - Online Medical Consultation</p>
        </div>
        
        <div class="content">
          <div class="greeting">Hello ${patientName}! 👋</div>
          <div class="intro">Great news! Your video consultation has been successfully scheduled. Here are your appointment details:</div>
          
          <div class="meeting-card">
            <h3>📅 Appointment Details</h3>
            <div class="info-row">
              <div class="info-label">Doctor:</div>
              <div class="info-value">${doctorInfo.name}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Specialty:</div>
              <div class="info-value">${specialtyInfo.icon} ${specialtyInfo.name}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Date:</div>
              <div class="info-value">${formattedDate}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Time:</div>
              <div class="info-value">${time} (GMT)</div>
            </div>
            ${symptoms ? `<div class="info-row"><div class="info-label">Symptoms:</div><div class="info-value">${symptoms}</div></div>` : ''}
          </div>
          
          <div class="meeting-link">
            <h3>🎥 Join Your Video Meeting</h3>
            <div class="info-row">
              <div class="info-label">Meeting Link:</div>
              <div class="info-value"><a href="${meetingLink}">${meetingLink}</a></div>
            </div>
            <div class="info-row">
              <div class="info-label">Meeting ID:</div>
              <div class="info-value">${meetingInfo.meetingId}</div>
            </div>
            
            <div class="button-container">
              <a href="${meetingLink}" class="button">🎥 Join Meeting</a>
              <a href="${calendarUrl}" class="button">📅 Add to Calendar</a>
            </div>
          </div>
          
          <div class="important-notes">
            <h4>📋 Important Notes:</h4>
            <ul>
              <li>Please join the meeting <strong>5 minutes early</strong></li>
              <li>Ensure you have a stable internet connection</li>
              <li>Test your camera and microphone beforehand</li>
              <li>Find a quiet, well-lit space for the consultation</li>
              <li>Have any relevant medical documents ready</li>
            </ul>
          </div>
          
          <div class="help-section">
            <h4>🆘 Need Help?</h4>
            <p>If you need to reschedule or have any questions:</p>
            <p>📞 Call: +233-599 211 311</p>
            <p>📧 Email: info@telekiosk.com</p>
            <p>🌐 Visit: www.telekiosk.com</p>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Thank you for choosing TeleKiosk Hospital!</strong></p>
          <p><small>This is an automated message. Please do not reply to this email.</small></p>
          <p><small>© 2025 TeleKiosk Hospital. All rights reserved.</small></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate admin notification email template
 */
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
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Appointment Notification</title>
      <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0 0 10px 0; font-size: 28px; font-weight: 700; }
        .header p { margin: 0; font-size: 16px; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .alert { background: #fef3cd; border: 1px solid #faebcd; color: #856404; padding: 20px; border-radius: 8px; margin-bottom: 25px; }
        .alert strong { font-weight: 700; }
        .appointment-card { background: #f8f9fa; border: 1px solid #e9ecef; border-left: 4px solid #dc2626; border-radius: 8px; padding: 25px; margin: 25px 0; }
        .appointment-card h3 { margin: 0 0 20px 0; font-size: 18px; color: #333; }
        .patient-card { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 25px 0; }
        .patient-card h3 { margin: 0 0 20px 0; font-size: 18px; color: #333; }
        .info-row { display: flex; margin-bottom: 12px; align-items: flex-start; }
        .info-label { font-weight: 600; color: #555; min-width: 120px; font-size: 14px; }
        .info-value { color: #333; font-size: 14px; flex: 1; }
        .info-value a { color: #dc2626; text-decoration: none; }
        .info-value a:hover { text-decoration: underline; }
        .action-section { background: #e0f2fe; border: 1px solid #b3e5fc; border-radius: 8px; padding: 20px; margin: 25px 0; }
        .action-section h4 { margin: 0 0 15px 0; color: #0277bd; font-size: 16px; }
        .action-section ul { margin: 0; padding-left: 20px; }
        .action-section li { color: #0277bd; margin-bottom: 8px; font-size: 14px; }
        .contact-section { background: #f3e5f5; border: 1px solid #e1bee7; border-radius: 8px; padding: 20px; margin: 25px 0; }
        .contact-section h4 { margin: 0 0 15px 0; color: #7b1fa2; font-size: 16px; }
        .contact-section p { color: #7b1fa2; margin: 5px 0; font-size: 14px; }
        .footer { background: #f8f9fa; border-top: 1px solid #e9ecef; padding: 30px; text-align: center; color: #666; }
        .footer p { margin: 5px 0; font-size: 14px; }
        .footer small { font-size: 12px; }
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
            <strong>📋 Admin Alert:</strong> A new video consultation has been booked. Please review the details below and take necessary actions.
          </div>
          
          <div class="appointment-card">
            <h3>📅 Appointment Details</h3>
            <div class="info-row">
              <div class="info-label">Doctor:</div>
              <div class="info-value">${doctorInfo.name}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Specialty:</div>
              <div class="info-value">${specialtyInfo.icon} ${specialtyInfo.name}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Date:</div>
              <div class="info-value">${formattedDate}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Time:</div>
              <div class="info-value">${time} (GMT)</div>
            </div>
            <div class="info-row">
              <div class="info-label">Meeting Link:</div>
              <div class="info-value"><a href="${meetingLink}">${meetingLink}</a></div>
            </div>
          </div>
          
          <div class="patient-card">
            <h3>👤 Patient Information</h3>
            <div class="info-row">
              <div class="info-label">Name:</div>
              <div class="info-value">${patientName}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Email:</div>
              <div class="info-value"><a href="mailto:${patientEmail}">${patientEmail}</a></div>
            </div>
            ${patientPhone ? `<div class="info-row"><div class="info-label">Phone:</div><div class="info-value">${patientPhone}</div></div>` : ''}
            ${symptoms ? `<div class="info-row"><div class="info-label">Symptoms:</div><div class="info-value">${symptoms}</div></div>` : ''}
            <div class="info-row">
              <div class="info-label">Booking Time:</div>
              <div class="info-value">${new Date().toLocaleString('en-US', { timeZone: 'Africa/Accra' })} (Ghana Time)</div>
            </div>
          </div>
          
          <div class="action-section">
            <h4>📋 Action Required:</h4>
            <ul>
              <li>Confirm doctor availability for the scheduled time</li>
              <li>Prepare any necessary medical records</li>
              <li>Ensure technical setup is ready for video consultation</li>
              <li>Contact patient if any changes or clarifications are needed</li>
              <li>Add appointment to hospital management system</li>
            </ul>
          </div>
          
          <div class="contact-section">
            <h4>📞 Hospital Contact Information:</h4>
            <p>📞 Main Line: +233-302 739 373</p>
            <p>🚨 Emergency: +233-599 211 311</p>
            <p>📧 Email: info@telekiosk.com</p>
            <p>🌐 Website: www.telekiosk.com</p>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>TeleKiosk Hospital - Admin Notification System</strong></p>
          <p><small>This notification was generated automatically by the TeleKiosk booking system.</small></p>
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
    1: { name: 'Dr. Lambert Tetteh Appiah', specialty: 'cardiology' },
    2: { name: 'Prof. Nicholas Ossei-Gerning', specialty: 'cardiology' },
    3: { name: 'Dr. Seth Yao Nani', specialty: 'pediatrics' },
    4: { name: 'Dr. Mohamed Shbayek', specialty: 'dermatology' },
    5: { name: 'Dr. Lily Wu', specialty: 'neurology' },
    6: { name: 'Dr. Michael Amponsah', specialty: 'orthopedics' },
    7: { name: 'Dr. Christiana Odum', specialty: 'emergency' },
    8: { name: 'Dr. Kwame Asante', specialty: 'pediatrics' },
    9: { name: 'Dr. Sarah Johnson', specialty: 'dermatology' }
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
    'emergency': { name: 'Emergency Medicine', icon: '🚨' },
    'general': { name: 'General Medicine', icon: '🏥' }
  };
  return specialties[specialtyId] || { name: 'General Medicine', icon: '🏥' };
};