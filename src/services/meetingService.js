/**
 * Meeting Service for Google Meet Integration
 * Handles Google Meet link generation and email notifications
 */

import { sendBookingConfirmationEmails } from './resendEmailService.js';

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

// Email service for sending meeting invites using Resend
const sendMeetingInvite = async (bookingData, meetingInfo) => {
  try {
    // Use Resend email service
    const emailResult = await sendBookingConfirmationEmails(bookingData, meetingInfo);
    
    return {
      success: emailResult.success,
      message: emailResult.message,
      results: emailResult.results,
      emailData: emailResult.emailData,
      error: emailResult.error
    };
    
  } catch (error) {
    console.error('Error sending meeting invite emails:', error);
    
    return {
      success: false,
      message: 'Failed to send meeting invite emails. Please try again or contact support.',
      error: error.message
    };
  }
};

// Note: Email templates moved to resendEmailService.js

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