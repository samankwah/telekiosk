import { confirmBooking } from './meetingService.js';

// Mock doctors data (this should ideally come from a centralized location)
const DOCTORS = [
  {
    id: 1,
    name: "DR. LAMBERT TETTEH APPIAH",
    specialty: "Cardiologist",
    category: "CLINIC - CARDIOLOGIST",
    availability: "Mon - Fri",
    status: "Available"
  },
  {
    id: 2,
    name: "PROF. NICHOLAS OSSEI-GERNING",
    specialty: "Senior Cardiologist", 
    category: "CLINIC - CARDIOLOGIST",
    availability: "Tue - Sat",
    status: "Available"
  },
  {
    id: 3,
    name: "DR. SETH YAO NANI",
    specialty: "Pediatrician",
    category: "CLINIC - PEDIATRICIAN", 
    availability: "Mon - Wed",
    status: "Available"
  },
  {
    id: 4,
    name: "DR. MOHAMED SHBAYEK",
    specialty: "Dermatologist",
    category: "CLINIC - DERMATOLOGIST",
    availability: "Wed - Fri", 
    status: "Busy"
  },
  {
    id: 5,
    name: "DR. SARAH JOHNSON",
    specialty: "Neurologist",
    category: "CLINIC - NEUROLOGIST",
    availability: "Mon - Fri",
    status: "Available"
  },
  {
    id: 6,
    name: "DR. MICHAEL CHEN",
    specialty: "Orthopedic Surgeon",
    category: "CLINIC - ORTHOPEDIST", 
    availability: "Tue - Thu",
    status: "Available"
  }
];

// Service to specialty mapping
const SERVICE_SPECIALTY_MAP = {
  'cardiology': ['Cardiologist', 'Senior Cardiologist'],
  'neurology': ['Neurologist'],
  'orthopedics': ['Orthopedic Surgeon', 'Orthopedist'],
  'pediatrics': ['Pediatrician'],
  'general': ['General Medicine', 'Family Medicine'],
  'emergency': ['Emergency Medicine'],
  'dermatology': ['Dermatologist']
};

class ChatbotAPI {
  constructor() {
    this.bookingInProgress = new Map();
  }

  // Get available doctors for a service
  getDoctorsByService(serviceId) {
    const specialties = SERVICE_SPECIALTY_MAP[serviceId] || [];
    return DOCTORS.filter(doctor => 
      specialties.some(specialty => 
        doctor.specialty.toLowerCase().includes(specialty.toLowerCase())
      ) && doctor.status === 'Available'
    );
  }

  // Get all available doctors
  getAllDoctors() {
    return DOCTORS.filter(doctor => doctor.status === 'Available');
  }

  // Get doctor by ID
  getDoctorById(doctorId) {
    return DOCTORS.find(doctor => doctor.id === parseInt(doctorId));
  }

  // Check availability for a specific date and time
  async checkAvailability(doctorId, date, time) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const doctor = this.getDoctorById(doctorId);
    if (!doctor) return false;

    // Simple availability check (in a real app, this would check against a database)
    const dayOfWeek = new Date(date).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Most doctors are available weekdays
    if (isWeekend && !doctor.availability.includes('Sat') && !doctor.availability.includes('Sun')) {
      return false;
    }

    return true;
  }

  // Create booking through existing system
  async createBooking(bookingData) {
    try {
      // Validate booking data
      const requiredFields = ['patientName', 'email', 'phone', 'date', 'time', 'doctor', 'specialty'];
      for (const field of requiredFields) {
        if (!bookingData[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Get doctor information
      const doctor = this.getDoctorById(bookingData.doctor);
      if (!doctor) {
        throw new Error('Doctor not found');
      }

      // Check availability
      const isAvailable = await this.checkAvailability(bookingData.doctor, bookingData.date, bookingData.time);
      if (!isAvailable) {
        throw new Error('Selected time slot is not available');
      }

      // Prepare booking data for the existing system
      const meetingBookingData = {
        patientName: bookingData.patientName,
        email: bookingData.email,
        phone: bookingData.phone,
        date: bookingData.date,
        time: bookingData.time,
        doctor: bookingData.doctor,
        specialty: bookingData.specialty,
        reason: bookingData.reason || 'General consultation',
        doctorName: doctor.name,
        specialtyName: doctor.specialty
      };

      // Use existing meeting service
      const result = await confirmBooking(meetingBookingData);
      
      if (result.success) {
        return {
          success: true,
          bookingId: `CB${Date.now()}`, // Chatbot booking ID
          meetingInfo: result.meetingInfo,
          message: 'Your appointment has been successfully booked! You will receive a confirmation email shortly.',
          data: {
            ...meetingBookingData,
            doctorName: doctor.name,
            meetingLink: result.meetingInfo?.meetingLink
          }
        };
      } else {
        throw new Error(result.message || 'Booking failed');
      }

    } catch (error) {
      console.error('Chatbot booking error:', error);
      return {
        success: false,
        message: error.message || 'Failed to create booking. Please try again.',
        error: error.message
      };
    }
  }

  // Get available time slots for a date
  getAvailableTimeSlots(date, doctorId = null) {
    // Default available times
    const baseSlots = [
      "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
      "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"
    ];

    // In a real app, this would check against existing bookings
    // For now, randomly remove some slots to simulate real availability
    const availableSlots = baseSlots.filter(() => Math.random() > 0.3);
    
    return availableSlots.length > 0 ? availableSlots : ["10:00 AM", "2:00 PM", "4:00 PM"];
  }

  // Get next available appointment
  getNextAvailableAppointment(serviceId = null) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const doctors = serviceId ? this.getDoctorsByService(serviceId) : this.getAllDoctors();
    const availableTimes = this.getAvailableTimeSlots(tomorrow.toISOString().split('T')[0]);
    
    if (doctors.length > 0 && availableTimes.length > 0) {
      return {
        doctor: doctors[0],
        date: tomorrow.toISOString().split('T')[0],
        time: availableTimes[0]
      };
    }
    
    return null;
  }

  // Get booking summary
  getBookingSummary(bookingData) {
    const doctor = this.getDoctorById(bookingData.doctor);
    return {
      patientName: bookingData.patientName,
      doctorName: doctor?.name || 'Unknown Doctor',
      specialty: doctor?.specialty || bookingData.specialty,
      date: new Date(bookingData.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      }),
      time: bookingData.time,
      reason: bookingData.reason || 'General consultation'
    };
  }

  // Cancel booking (for future implementation)
  async cancelBooking(bookingId) {
    // This would integrate with the existing system's cancellation logic
    return {
      success: true,
      message: 'Booking cancelled successfully'
    };
  }
}

// Create singleton instance
export const chatbotAPI = new ChatbotAPI();
export default chatbotAPI;