import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useTitleContext } from "../contexts/TitleContext";
import { BOOKING_DOCTOR_IMAGES } from "../constants/carouselImages";

function BookingPage() {
  const [selectedCategory, setSelectedCategory] = useState("ALL_CATEGORIES");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { setPageInfo } = useTitleContext();

  // Helper function to get doctor image based on category
  const getDoctorImage = (category) => {
    const categoryMap = {
      "CLINIC - CARDIOLOGIST": "cardiologist",
      "CLINIC - PEDIATRICIAN": "pediatrician",
      "CLINIC - DERMATOLOGIST": "dermatologist",
      "CLINIC - NEUROLOGIST": "neurologist",
      "CLINIC - ORTHOPEDIC": "orthopedic",
      "EMERGENCY - GENERAL": "emergency"
    };

    const specialtyKey = categoryMap[category] || "general";
    return BOOKING_DOCTOR_IMAGES[specialtyKey];
  };

  useEffect(() => {
    setPageInfo({
      title: 'Book Appointment',
      description: 'Schedule your medical appointment with our expert doctors. Browse available specialists and book your preferred time slot.',
      breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Book Appointment' }]
    });
  }, [setPageInfo]);

  const doctors = [
    {
      id: 1,
      name: "DR. LAMBERT TETTEH APPIAH",
      startDate: "Mon - Fri",
      status: "Available",
      rating: "4.8",
      image: null,
      category: "CLINIC - CARDIOLOGIST",
      specialty: "Cardiologist",
    },
    {
      id: 2,
      name: "PROF. NICHOLAS OSSEI-GERNING",
      startDate: "Tue - Sat",
      status: "Available",
      rating: "4.9",
      image: null,
      category: "CLINIC - CARDIOLOGIST",
      specialty: "Senior Cardiologist",
    },
    {
      id: 3,
      name: "DR. SETH YAO NANI",
      startDate: "Mon - Wed",
      status: "Available",
      rating: "4.7",
      image: null,
      category: "CLINIC - PEDIATRICIAN",
      specialty: "Pediatrician",
    },
    {
      id: 4,
      name: "DR. MOHAMED SHBAYEK",
      startDate: "Wed - Fri",
      status: "Busy",
      rating: "4.6",
      image: null,
      category: "CLINIC - DERMATOLOGIST",
      specialty: "Dermatologist",
    },
    {
      id: 5,
      name: "DR. LILY WU",
      startDate: "Thu - Sat",
      status: "Available",
      rating: "4.8",
      image: null,
      category: "CLINIC - NEUROLOGIST",
      specialty: "Neurologist",
    },
    {
      id: 6,
      name: "DR. MICHAEL AMPONSAH",
      startDate: "Mon - Fri",
      status: "Available",
      rating: "4.9",
      image: null,
      category: "CLINIC - ORTHOPEDIC",
      specialty: "Orthopedic Surgeon",
    },
    {
      id: 7,
      name: "DR. CHRISTIANA ODUM",
      startDate: "24/7",
      status: "On Call",
      rating: "4.7",
      image: null,
      category: "EMERGENCY - GENERAL",
      specialty: "Emergency Medicine",
    },
    {
      id: 8,
      name: "DR. KWAME ASANTE",
      startDate: "Mon - Wed",
      status: "Available",
      rating: "4.5",
      image: null,
      category: "CLINIC - PEDIATRICIAN",
      specialty: "Pediatric Specialist",
    },
    {
      id: 9,
      name: "DR. SARAH JOHNSON",
      startDate: "Tue - Thu",
      status: "Available",
      rating: "4.8",
      image: null,
      category: "CLINIC - DERMATOLOGIST",
      specialty: "Skin Specialist",
    },
    {
      id: 10,
      name: "DR. JAMES MORRISON",
      startDate: "24/7",
      status: "Available",
      rating: "4.6",
      image: null,
      category: "EMERGENCY - GENERAL",
      specialty: "Emergency Physician",
    },
  ];

  const categories = [
    { value: "ALL_CATEGORIES", label: "👥 ALL CATEGORIES" },
    { value: "CLINIC - CARDIOLOGIST", label: "❤️ CLINIC - CARDIOLOGIST" },
    { value: "CLINIC - PEDIATRICIAN", label: "👶 CLINIC - PEDIATRICIAN" },
    { value: "CLINIC - DERMATOLOGIST", label: "🧴 CLINIC - DERMATOLOGIST" },
    { value: "CLINIC - NEUROLOGIST", label: "🧠 CLINIC - NEUROLOGIST" },
    { value: "CLINIC - ORTHOPEDIC", label: "🦴 CLINIC - ORTHOPEDIC" },
    { value: "EMERGENCY - GENERAL", label: "🚨 EMERGENCY - GENERAL" },
  ];

  const filteredDoctors = doctors
    .filter(
      (doctor) =>
        selectedCategory === "ALL_CATEGORIES" ||
        doctor.category === selectedCategory
    )
    .filter((doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleBookNow = (doctorId) => {
    // Navigate to BookNowPage with doctor pre-selected
    navigate("/book-now", {
      state: {
        selectedDoctorId: doctorId,
        selectedCategory:
          selectedCategory !== "ALL_CATEGORIES"
            ? selectedCategory
            : doctors.find((d) => d.id === doctorId)?.category,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row lg:overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-full lg:w-96 bg-gray-50 p-4 lg:h-screen flex flex-col overflow-hidden">
        {/* Hospital Logo and Title */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div
              className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mr-4 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate("/")}
            >
              <span className="text-white font-bold text-2xl">T</span>
            </div>
            <div>
              <h1
                className="text-lg sm:text-xl font-bold text-gray-900 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate("/")}
              >
                {t("hospitalName")}
              </h1>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-center mb-4 sm:mb-6">
          <div className="font-semibold text-gray-800">
            {t("emergency")} | 📞 {t("emergencyPhone")}
          </div>
          <div className="flex items-center justify-center text-blue-600">
            <span className="mr-1">🌐</span>
            <span className="break-all">www.telekiosk.com</span>
          </div>
          <div className="flex items-center justify-center text-blue-600">
            <span className="mr-1">📧</span>
            <span className="break-all">{t("email")}</span>
          </div>
        </div>

        {/* Quote */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="text-xs sm:text-sm text-blue-600 italic px-2">
            "{t("heroTitle")}"
          </div>
        </div>

        {/* Map Section - Google Maps iframe */}
        <div className="flex-1 min-h-0 lg:min-h-64">
          <div className="h-48 sm:h-64 lg:h-full lg:min-h-64 relative bg-white rounded border shadow-sm">
            {/* Google Maps iframe */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7940.858911547933!2d-0.16714722413947028!3d5.650843632686896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9ca15e56390f%3A0xe32353079eab7d22!2sGHANA%20METEOROLOGICAL%20AGENCY!5e0!3m2!1sen!2sgh!4v1753275247145!5m2!1sen!2sgh"
              className="w-full h-full rounded"
              style={{ border: 0, minHeight: "200px" }}
              allowFullScreen=""
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
              title="Hospital Location Map"
            >
              <p>
                Your browser does not support iframes. Please visit Google Maps
                directly.
              </p>
            </iframe>

            {/* Map attribution at bottom */}
            <div className="absolute bottom-2 left-2 text-xs text-gray-600 bg-white bg-opacity-90 px-2 py-1 rounded shadow-sm z-10">
              <div className="text-blue-600 underline cursor-pointer hover:text-blue-800">
                Develop by Technofy™
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Content - Doctor Booking */}
      <div className="flex-1 bg-white p-4 sm:p-6 lg:h-screen overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 sm:mb-6 space-y-4 lg:space-y-0">
          <div className="w-full lg:w-auto">
            {/* <h2 className="text-base sm:text-lg font-medium mb-2 text-gray-700">
              {t("bookAppointment")}:
            </h2> */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white w-full lg:min-w-64 text-sm appearance-none"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-auto lg:text-right">
            {/* <h3 className="text-base sm:text-lg font-medium mb-2 text-gray-700">
              {t("ourDoctors")}:
              <span className="text-blue-600 font-semibold">
                ({filteredDoctors.length} doctors)
              </span>
            </h3> */}
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 findDoctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full lg:w-64 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 flex-1 content-start">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="relative min-h-56">
              {/* Mobile Layout - Avatar on top */}
              <div className="sm:hidden">
                <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow">
                  {/* Doctor Avatar */}
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                      <img
                        src={getDoctorImage(doctor.category)}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                      {doctor.name}
                    </h3>
                    <p className="text-xs text-blue-600 font-medium">
                      {doctor.specialty}
                    </p>

                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center justify-center">
                        <span className="font-medium text-gray-700 mr-1">
                          Schedule:
                        </span>
                        <span>{doctor.startDate}</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            doctor.status === "Available"
                              ? "bg-green-500"
                              : doctor.status === "Busy"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        ></div>
                        <span
                          className={`font-medium ${
                            doctor.status === "Available"
                              ? "text-green-600"
                              : doctor.status === "Busy"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {doctor.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-center">
                        <span className="text-orange-500 text-sm">
                          ⭐ {doctor.rating}
                        </span>
                      </div>
                    </div>

                    {/* Book Button */}
                    <div className="pt-3">
                      <button
                        onClick={() => handleBookNow(doctor.id)}
                        className="w-full bg-gray-800 text-white py-2 px-4 rounded text-sm font-medium hover:bg-gray-900 transition-colors flex items-center justify-center min-h-10 touch-manipulation"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V7H5V5H19M5,19V9H19V19H5M17,12H15V17H17V12M13,12H11V17H13V12M9,12H7V17H9V12Z" />
                        </svg>
                        <span>{t("bookNow")}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Layout - Avatar on left */}
              <div className="hidden sm:block">
                {/* Doctor Avatar - Separate box centered on the left */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="bg-white rounded-lg shadow-md p-3 lg:p-4 border border-gray-200">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden border-2 border-gray-200">
                      <img
                        src={getDoctorImage(doctor.category)}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-lg shadow-md p-3 lg:p-4 pl-20 lg:pl-24 ml-4 lg:ml-5 h-full min-h-56 border border-gray-200 hover:shadow-lg transition-shadow">
                  {/* Doctor Info */}
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-xs lg:text-sm mb-1 leading-tight">
                        {doctor.name}
                      </h3>
                      <p className="text-xs text-blue-600 mb-2 lg:mb-3 font-medium">
                        {doctor.specialty}
                      </p>

                      <div className="space-y-1 text-xs text-gray-600 mb-3 lg:mb-4">
                        <div className="flex items-center">
                          <svg
                            className="w-3 h-3 mr-2 text-gray-500 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V7H5V5H19M5,19V9H19V19H5M17,12H15V17H17V12M13,12H11V17H13V12M9,12H7V17H9V12Z" />
                          </svg>
                          <span className="font-medium text-gray-700 flex-shrink-0">
                            Schedule:
                          </span>
                          <span className="ml-1 text-gray-600 truncate">
                            {doctor.startDate}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 flex-shrink-0 ${
                              doctor.status === "Available"
                                ? "bg-green-500"
                                : doctor.status === "Busy"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                            }`}
                          ></div>
                          <span className="font-medium text-gray-700 flex-shrink-0">
                            Status:
                          </span>
                          <span
                            className={`ml-1 font-medium ${
                              doctor.status === "Available"
                                ? "text-green-600"
                                : doctor.status === "Busy"
                                ? "text-red-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {doctor.status}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-orange-500 text-sm">
                            ⭐ {doctor.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Book Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleBookNow(doctor.id)}
                        className="bg-gray-800 text-white py-2 px-3 lg:px-4 rounded text-xs font-medium hover:bg-gray-900 transition-colors flex items-center hover:scale-105 transform min-h-8 touch-manipulation"
                      >
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V7H5V5H19M5,19V9H19V19H5M17,12H15V17H17V12M13,12H11V17H13V12M9,12H7V17H9V12Z" />
                        </svg>
                        <span>{t("bookNow")}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
