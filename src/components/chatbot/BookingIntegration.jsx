import React, { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { APPOINTMENT_SERVICES } from './HealthcarePrompts';

/**
 * BookingIntegration Component
 * Phase 1 requirement: Appointment booking flow component
 * Provides UI for appointment booking and integrates with chat functionality
 */
export const BookingIntegration = ({ onBookingRequest, isLoading }) => {
  const [bookingData, setBookingData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    service: '',
    preferredDate: '',
    preferredTime: '',
    symptoms: ''
  });

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!bookingData.patientName || !bookingData.patientEmail || !bookingData.service) {
      alert('Please fill in all required fields: Name, Email, and Service');
      return;
    }

    // Format booking request for AI assistant
    const bookingMessage = `I would like to book an appointment:
- Patient Name: ${bookingData.patientName}
- Email: ${bookingData.patientEmail}
- Phone: ${bookingData.patientPhone}
- Service: ${bookingData.service}
- Preferred Date: ${bookingData.preferredDate}
- Preferred Time: ${bookingData.preferredTime}
- Symptoms/Reason: ${bookingData.symptoms}

Please confirm this appointment booking.`;

    onBookingRequest?.(bookingMessage, bookingData);
  };

  const clearForm = () => {
    setBookingData({
      patientName: '',
      patientEmail: '',
      patientPhone: '',
      service: '',
      preferredDate: '',
      preferredTime: '',
      symptoms: ''
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="text-blue-600" size={24} />
        <h3 className="text-lg font-semibold text-gray-800">Book Appointment</h3>
      </div>

      <form onSubmit={handleBookingSubmit} className="space-y-4">
        {/* Patient Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <User size={16} />
            Patient Name *
          </label>
          <input
            type="text"
            value={bookingData.patientName}
            onChange={(e) => handleInputChange('patientName', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter patient's full name"
            required
            disabled={isLoading}
          />
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <Mail size={16} />
            Email Address *
          </label>
          <input
            type="email"
            value={bookingData.patientEmail}
            onChange={(e) => handleInputChange('patientEmail', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter email address"
            required
            disabled={isLoading}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <Phone size={16} />
            Phone Number
          </label>
          <input
            type="tel"
            value={bookingData.patientPhone}
            onChange={(e) => handleInputChange('patientPhone', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter phone number"
            disabled={isLoading}
          />
        </div>

        {/* Service Selection */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <MessageSquare size={16} />
            Medical Service *
          </label>
          <select
            value={bookingData.service}
            onChange={(e) => handleInputChange('service', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isLoading}
          >
            <option value="">Select a service</option>
            {Object.entries(APPOINTMENT_SERVICES).map(([key, service]) => (
              <option key={key} value={key}>
                {service.icon} {service.name} - {service.description}
              </option>
            ))}
          </select>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Calendar size={16} />
              Date
            </label>
            <input
              type="date"
              value={bookingData.preferredDate}
              onChange={(e) => handleInputChange('preferredDate', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={new Date().toISOString().split('T')[0]}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Clock size={16} />
              Time
            </label>
            <input
              type="time"
              value={bookingData.preferredTime}
              onChange={(e) => handleInputChange('preferredTime', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Symptoms/Reason */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Symptoms or Reason for Visit
          </label>
          <textarea
            value={bookingData.symptoms}
            onChange={(e) => handleInputChange('symptoms', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="3"
            placeholder="Briefly describe your symptoms or reason for visit..."
            disabled={isLoading}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading || !bookingData.patientName || !bookingData.patientEmail || !bookingData.service}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? 'Booking...' : 'Book Appointment'}
          </button>
          <button
            type="button"
            onClick={clearForm}
            disabled={isLoading}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
          >
            Clear
          </button>
        </div>
      </form>

      {/* Helper Text */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> This booking will be processed through our AI assistant. 
          You'll receive email confirmation once approved.
        </p>
      </div>
    </div>
  );
};

export default BookingIntegration;