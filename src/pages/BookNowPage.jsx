import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { confirmBooking } from '../services/meetingService';

function BookNowPage() {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [bookingData, setBookingData] = useState({
    specialty: '',
    doctor: '',
    date: '',
    time: '',
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    symptoms: ''
  });

  // Pre-populate booking data if coming from BookingPage
  useEffect(() => {
    if (location.state) {
      const { selectedDoctorId, selectedCategory } = location.state;
      if (selectedCategory && selectedDoctorId) {
        // Map category names to specialty IDs
        const categoryToSpecialtyMap = {
          'CLINIC - CARDIOLOGIST': 'cardiology',
          'CLINIC - PEDIATRICIAN': 'pediatrics', 
          'CLINIC - DERMATOLOGIST': 'dermatology',
          'CLINIC - NEUROLOGIST': 'neurology',
          'CLINIC - ORTHOPEDIC': 'orthopedics',
          'EMERGENCY - GENERAL': 'emergency'
        };
        
        const specialtyId = categoryToSpecialtyMap[selectedCategory];
        if (specialtyId) {
          setBookingData(prev => ({
            ...prev,
            specialty: specialtyId,
            doctor: selectedDoctorId
          }));
        }
      }
    }
  }, [location.state]);

  const specialties = [
    { id: 'cardiology', name: 'Cardiology', icon: '❤️', color: 'from-red-400 to-pink-500' },
    { id: 'neurology', name: 'Neurology', icon: '🧠', color: 'from-purple-400 to-indigo-500' },
    { id: 'pediatrics', name: 'Pediatrics', icon: '👶', color: 'from-blue-400 to-cyan-500' },
    { id: 'dermatology', name: 'Dermatology', icon: '✨', color: 'from-yellow-400 to-orange-500' },
    { id: 'orthopedics', name: 'Orthopedics', icon: '🦴', color: 'from-green-400 to-teal-500' },
    { id: 'emergency', name: 'Emergency', icon: '🚨', color: 'from-red-500 to-red-600' }
  ];

  const doctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'cardiology', rating: 4.9, experience: '15+ years', avatar: '👩‍⚕️' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'neurology', rating: 4.8, experience: '12+ years', avatar: '👨‍⚕️' },
    { id: 3, name: 'Dr. Emily Brown', specialty: 'pediatrics', rating: 4.9, experience: '10+ years', avatar: '👩‍⚕️' },
    { id: 4, name: 'Dr. James Wilson', specialty: 'dermatology', rating: 4.7, experience: '8+ years', avatar: '👨‍⚕️' },
    { id: 5, name: 'Dr. Lisa Davis', specialty: 'orthopedics', rating: 4.8, experience: '14+ years', avatar: '👩‍⚕️' }
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM'
  ];

  // Generate next 14 days for booking
  const generateDates = () => {
    const dates = [];
    for (let i = 1; i <= 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' })
      });
    }
    return dates;
  };

  const availableDates = generateDates();
  const filteredDoctors = bookingData.specialty ? 
    doctors.filter(doctor => doctor.specialty === bookingData.specialty) : 
    doctors;

  const updateBookingData = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleBooking = async () => {
    setIsBooking(true);
    
    try {
      // Call the booking confirmation service
      const result = await confirmBooking(bookingData);
      
      setBookingResult(result);
      
      if (result.success) {
        // Move to success state
        setCurrentStep(5);
      } else {
        // Show detailed error message
        const errorMessage = result.message || 'Booking failed. Please try again.';
        alert(`❌ Booking Failed: ${errorMessage}`);
        
        // If it's a server connection error, provide helpful guidance
        if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Server error')) {
          alert('🔧 Server Connection Issue: The email server appears to be unavailable. Please try again in a moment or contact hospital support.');
        }
      }
      
    } catch (error) {
      console.error('Booking error:', error);
      
      let userFriendlyMessage = 'An unexpected error occurred. Please try again.';
      
      // Handle specific error types
      if (error.message.includes('Failed to fetch')) {
        userFriendlyMessage = 'Unable to connect to booking system. Please check your internet connection and try again.';
      } else if (error.message.includes('500')) {
        userFriendlyMessage = 'Server error occurred. Please try again or contact support.';
      } else if (error.message.includes('timeout')) {
        userFriendlyMessage = 'Request timed out. Please try again.';
      }
      
      alert(`❌ ${userFriendlyMessage}`);
      
      setBookingResult({
        success: false,
        message: userFriendlyMessage,
        error: error.message
      });
    } finally {
      setIsBooking(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
              step <= currentStep
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {step}
          </div>
          {step < 5 && (
            <div
              className={`w-12 h-1 mx-2 rounded transition-all duration-300 ${
                step < currentStep ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderSpecialtyStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {t('chooseSpecialty')}
        </h2>
        <p className="text-gray-600">{t('selectSpecialtyDesc')}</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {specialties.map((specialty) => (
          <button
            key={specialty.id}
            onClick={() => {
              updateBookingData('specialty', specialty.id);
              updateBookingData('doctor', ''); // Reset doctor selection
            }}
            className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
              bookingData.specialty === specialty.id
                ? 'border-blue-500 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
            }`}
          >
            <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${specialty.color} flex items-center justify-center text-2xl`}>
              {specialty.icon}
            </div>
            <h3 className="font-semibold text-gray-800">{t(specialty.id)}</h3>
          </button>
        ))}
      </div>

      {bookingData.specialty && (
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">{t('availableDoctors')}</h3>
          <div className="grid gap-4">
            {filteredDoctors.map((doctor) => (
              <button
                key={doctor.id}
                onClick={() => updateBookingData('doctor', doctor.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center space-x-4 ${
                  bookingData.doctor === doctor.id
                    ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="text-4xl">{doctor.avatar}</div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-gray-800">{doctor.name}</h4>
                  <p className="text-sm text-gray-600">{doctor.experience} • ⭐ {doctor.rating}</p>
                </div>
                <div className="text-blue-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderDateTimeStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          {t('pickTime')}
        </h2>
        <p className="text-gray-600">{t('chooseDateTimeDesc')}</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('availableDates')}</h3>
          <div className="grid grid-cols-7 gap-2">
            {availableDates.map((dateObj) => (
              <button
                key={dateObj.date}
                onClick={() => updateBookingData('date', dateObj.date)}
                className={`p-3 rounded-xl text-center transition-all duration-300 ${
                  bookingData.date === dateObj.date
                    ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                <div className="text-xs text-gray-500">{dateObj.day}</div>
                <div className="font-semibold">{dateObj.dayNum}</div>
                <div className="text-xs">{dateObj.month}</div>
              </button>
            ))}
          </div>
        </div>

        {bookingData.date && (
          <div className="animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('availableTimeSlots')}</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => updateBookingData('time', time)}
                  className={`p-3 rounded-lg font-medium transition-all duration-300 ${
                    bookingData.time === time
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-purple-300 hover:shadow-md hover:scale-105'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderPatientInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          {t('tellUsAboutYou')}
        </h2>
        <p className="text-gray-600">{t('basicInfoDesc')}</p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('fullNameLabel')}</label>
          <input
            type="text"
            value={bookingData.patientName}
            onChange={(e) => updateBookingData('patientName', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            placeholder={t('enterFullName')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('emailAddressLabel')}</label>
          <input
            type="email"
            value={bookingData.patientEmail}
            onChange={(e) => updateBookingData('patientEmail', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            placeholder={t('enterEmail')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('phoneNumberLabel')}</label>
          <input
            type="tel"
            value={bookingData.patientPhone}
            onChange={(e) => updateBookingData('patientPhone', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            placeholder={t('enterPhone')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('symptomsLabel')}</label>
          <textarea
            value={bookingData.symptoms}
            onChange={(e) => updateBookingData('symptoms', e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            placeholder={t('describeSymptomsPlaceholder')}
          />
        </div>
      </div>
    </div>
  );

  const renderConfirmationStep = () => {
    const selectedDoctor = doctors.find(d => d.id === bookingData.doctor);
    const selectedSpecialty = specialties.find(s => s.id === bookingData.specialty);
    const selectedDateObj = availableDates.find(d => d.date === bookingData.date);

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
            {t('almostThere')}
          </h2>
          <p className="text-gray-600">{t('reviewBookingDesc')}</p>
        </div>

        <div className="max-w-lg mx-auto bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('bookingSummary')}</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t('specialty')}</span>
              <div className="flex items-center space-x-2">
                <span>{selectedSpecialty?.icon}</span>
                <span className="font-medium">{t(selectedSpecialty?.id)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t('doctor')}</span>
              <span className="font-medium">{selectedDoctor?.name}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t('date')}</span>
              <span className="font-medium">
                {selectedDateObj?.day}, {selectedDateObj?.month} {selectedDateObj?.dayNum}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t('time')}</span>
              <span className="font-medium">{bookingData.time}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t('patient')}</span>
              <span className="font-medium">{bookingData.patientName}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t('contact')}</span>
              <span className="font-medium">{bookingData.patientEmail}</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
            <div className="flex items-center space-x-2 text-green-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">{t('videoConsultationLinkInfo')}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSuccessStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        {bookingResult?.success ? (
          <>
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-green-600 mb-2">{t('bookingConfirmed')}</h2>
            <p className="text-gray-600">{t('consultationScheduled')}</p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-red-600 mb-2">{t('bookingFailed')}</h2>
            <p className="text-gray-600">{bookingResult?.message}</p>
          </>
        )}
      </div>

      {bookingResult?.success && (
        <div className="max-w-lg mx-auto">
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {bookingResult.results?.patient?.simulation ? 
                '✅ Booking Confirmed (Demo Mode)' : 
                bookingResult.emailStatus?.patientEmailSent ? 
                  t('meetingInviteSent') : 
                  '📱 Meeting Ready - Join Below!'}
            </h3>
            
            {bookingResult.results?.patient?.simulation && (
              <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>📧 Demo Mode:</strong> Email notifications are simulated. In production, confirmation emails would be sent to both patient and hospital admin.
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              {/* Email Status */}
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  bookingResult.emailStatus?.patientEmailSent 
                    ? 'bg-green-100' 
                    : 'bg-yellow-100'
                }`}>
                  <svg className={`w-4 h-4 ${
                    bookingResult.emailStatus?.patientEmailSent 
                      ? 'text-green-600' 
                      : 'text-yellow-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {bookingResult.emailStatus?.patientEmailSent ? 'Email sent to:' : 'Email delivery issue:'}
                  </p>
                  <p className="text-gray-600">{bookingData.patientEmail}</p>
                  {!bookingResult.emailStatus?.patientEmailSent && (
                    <p className="text-yellow-600 text-xs">Use the meeting link below to join your consultation</p>
                  )}
                </div>
              </div>

              {bookingResult.meetingInfo && (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{t('googleMeetLink')}</p>
                      <p className="text-sm text-gray-600">Meeting ID: {bookingResult.meetingInfo.meetingId}</p>
                    </div>
                  </div>
                  
                  {/* Prominent Join Meeting Button */}
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                    <a 
                      href={bookingResult.meetingInfo.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                    >
                      🎥 Join Video Consultation Now
                    </a>
                    <p className="text-white text-xs text-center mt-2 opacity-90">
                      Click here to join your video meeting with the doctor
                    </p>
                  </div>
                  
                  {/* Calendar Button */}
                  {bookingResult.meetingInfo.calendarUrl && (
                    <div className="mt-2">
                      <a 
                        href={bookingResult.meetingInfo.calendarUrl}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full text-center bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        📅 Add to Calendar
                      </a>
                    </div>
                  )}
                  
                  {/* Alternative Contact Method */}
                  {!bookingResult.emailStatus?.patientEmailSent ? (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800 font-medium mb-2">⚠️ Email delivery failed - Get your meeting link:</p>
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <a 
                            href={`https://wa.me/233599211311?text=Hi! I just booked a video consultation. My name is ${bookingData.patientName}. My email is ${bookingData.patientEmail}. Please send me the meeting link: ${bookingResult.meetingInfo.meetingLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-green-600 text-white text-center py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-xs"
                          >
                            📱 Get via WhatsApp
                          </a>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`Meeting Link: ${bookingResult.meetingInfo.meetingLink}\nMeeting ID: ${bookingResult.meetingInfo.meetingId}`);
                              alert('Meeting details copied to clipboard!');
                            }}
                            className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-xs"
                          >
                            📋 Copy Details
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            const subject = encodeURIComponent('TeleKiosk Meeting Link');
                            const body = encodeURIComponent(`Hi,\n\nHere are your TeleKiosk video consultation details:\n\nMeeting Link: ${bookingResult.meetingInfo.meetingLink}\nMeeting ID: ${bookingResult.meetingInfo.meetingId}\n\nBest regards,\nTeleKiosk Team`);
                            window.open(`mailto:${bookingData.patientEmail}?subject=${subject}&body=${body}`);
                          }}
                          className="w-full bg-gray-600 text-white text-center py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors text-xs"
                        >
                          📧 Send to Email (Manual)
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800 font-medium mb-2">✅ Email sent! Also available via:</p>
                      <div className="flex space-x-2">
                        <a 
                          href={`https://wa.me/233599211311?text=Hi! I just booked a video consultation. My name is ${bookingData.patientName}. Can you please send me the meeting link: ${bookingResult.meetingInfo.meetingLink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-green-600 text-white text-center py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-xs"
                        >
                          📱 WhatsApp Backup
                        </a>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(bookingResult.meetingInfo.meetingLink);
                            alert('Meeting link copied to clipboard!');
                          }}
                          className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-xs"
                        >
                          📋 Copy Link
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Important Notice */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
              <div className="flex items-start space-x-2 text-blue-700">
                <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-sm">Important:</p>
                  <ul className="text-xs space-y-1 mt-1">
                    <li>• Your meeting link is available above - no email required!</li>
                    <li>• Save this page or bookmark the meeting link</li>
                    <li>• Join the meeting 5 minutes before your appointment</li>
                    <li>• Test your camera and microphone beforehand</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
              <div className="flex items-start space-x-2 text-green-700">
                <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium">{t('important')}</p>
                  <ul className="text-sm mt-1 space-y-1">
                    <li>• {t('checkEmailDetails')}</li>
                    <li>• {t('joinMeetingEarly')}</li>
                    <li>• {t('addAppointmentCalendar')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/booking')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              {t('bookAnotherAppointment')}
            </button>
          </div>
        </div>
      )}

      {!bookingResult?.success && (
        <div className="text-center">
          <button
            onClick={() => setCurrentStep(4)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 mr-4"
          >
            {t('tryAgain')}
          </button>
          <button
            onClick={() => navigate('/booking')}
            className="bg-gray-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300"
          >
            {t('backToDoctors')}
          </button>
        </div>
      )}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1: return renderSpecialtyStep();
      case 2: return renderDateTimeStep();
      case 3: return renderPatientInfoStep();
      case 4: return renderConfirmationStep();
      case 5: return renderSuccessStep();
      default: return renderSpecialtyStep();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return bookingData.specialty && bookingData.doctor;
      case 2: return bookingData.date && bookingData.time;
      case 3: return bookingData.patientName && bookingData.patientEmail && bookingData.patientPhone;
      case 4: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{t('hospitalName')}</h1>
                <p className="text-sm text-gray-600">{t('onlineVideoConsultation')}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/booking')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>{t('back')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {renderStepIndicator()}
        
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {renderStep()}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>{t('previous')}</span>
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  canProceed()
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>{t('continue')}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleBooking}
                disabled={isBooking}
                className={`px-8 py-3 font-semibold rounded-xl transition-all duration-300 flex items-center space-x-2 ${
                  isBooking
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-teal-600 text-white hover:shadow-lg hover:scale-105'
                }`}
              >
                {isBooking ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{t('confirming')}</span>
                  </>
                ) : (
                  <>
                    <span>{t('confirmBooking')}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Floating Elements for Extra Vibes */}
      <div className="fixed top-20 left-10 w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="fixed bottom-20 right-10 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full opacity-20 animate-bounce"></div>
      <div className="fixed top-1/2 right-20 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 animate-ping"></div>
    </div>
  );
}

export default BookNowPage;