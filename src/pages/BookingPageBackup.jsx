import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

function BookingPage() {
  const [selectedCategory, setSelectedCategory] = useState(
    "CLINIC - CARDIOLOGIST"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const { t, changeLanguage, languages, getCurrentLanguage } = useLanguage();

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
    "CLINIC - CARDIOLOGIST",
    "CLINIC - PEDIATRICIAN",
    "CLINIC - DERMATOLOGIST",
    "CLINIC - NEUROLOGIST",
    "CLINIC - ORTHOPEDIC",
    "EMERGENCY - GENERAL",
  ];

  const filteredDoctors = doctors
    .filter((doctor) => doctor.category === selectedCategory)
    .filter((doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-96 bg-gray-50 p-4 h-full flex flex-col overflow-hidden">
        {/* Hospital Logo and Title */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-bold text-2xl">T</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {t("hospitalName")}
              </h1>
            </div>
          </div>

          {/* Language Selector */}
          <div className="mb-4">
            <select
              value={getCurrentLanguage()?.code || "en"}
              onChange={(e) => changeLanguage(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-2 text-sm text-center mb-4">
          <div className="font-semibold text-gray-800 text-xs">
            {t("emergency")} | 📞 {t("emergencyPhone")}
          </div>
          <div className="flex items-center justify-center text-blue-600 text-xs">
            <span className="mr-1">🌐</span>
            <span>www.telekiosk.com</span>
          </div>
          <div className="flex items-center justify-center text-blue-600 text-xs">
            <span className="mr-1">📧</span>
            <span>{t("email")}</span>
          </div>
        </div>

        {/* Quote */}
        <div className="text-center mb-4">
          <div className="text-xs text-blue-600 italic">"{t("heroTitle")}"</div>
        </div>

        {/* Map Section - Google Maps iframe */}
        <div className="flex-1 min-h-0">
          <div className="h-full min-h-96 relative bg-white rounded border shadow-sm">
            {/* Google Maps iframe */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7940.858911547933!2d-0.16714722413947028!3d5.650843632686896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9ca15e56390f%3A0xe32353079eab7d22!2sGHANA%20METEOROLOGICAL%20AGENCY!5e0!3m2!1sen!2sgh!4v1753275247145!5m2!1sen!2sgh"
              className="w-full h-full rounded"
              style={{border: 0, minHeight: '300px'}}
              allowFullScreen=""
              loading="eager" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Hospital Location Map"
            >
              <p>Your browser does not support iframes. Please visit Google Maps directly.</p>
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
      <div className="flex-1 bg-white p-4 h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-lg font-medium mb-2 text-gray-700">
              {t("bookAppointment")}:
            </h2>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white min-w-64 text-sm appearance-none"
              >
                <option value="CLINIC - CARDIOLOGIST">
                  👤 CLINIC - CARDIOLOGIST
                </option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
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

          <div className="text-right">
            <h3 className="text-lg font-medium mb-2 text-gray-700">
              {t("ourDoctors")}:
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 {t('findDoctor')}..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-64 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-3 gap-3 flex-1 content-start overflow-hidden">
          {filteredDoctors.slice(0, 6).map((doctor) => (
            <div key={doctor.id} className="relative h-44">
              {/* Doctor Avatar - Separate box centered on the left */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
                <div className="bg-white rounded-lg shadow-md p-3 border border-gray-200">
                  <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Main Card */}
              <div className="bg-white rounded-lg shadow-md p-2 pl-20 ml-5 h-full border border-gray-200 hover:shadow-lg transition-shadow">
                {/* Doctor Info */}
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-xs mb-1 leading-tight truncate">
                      {doctor.name}
                    </h3>
                    <p className="text-xs text-blue-600 mb-2 font-medium truncate">
                      {doctor.specialty}
                    </p>

                    <div className="space-y-1 text-xs text-gray-600 mb-2">
                      <div className="flex items-center text-xs">
                        <span className="font-medium text-gray-700">
                          {doctor.startDate}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-1 ${
                              doctor.status === "Available"
                                ? "bg-green-500"
                                : doctor.status === "Busy"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                            }`}
                          ></div>
                          <span
                            className={`font-medium text-xs ${
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
                        <span className="text-orange-500 text-xs">
                          ⭐ {doctor.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Book Button */}
                  <div className="flex justify-end">
                    <button className="bg-gray-800 text-white py-1 px-2 rounded text-xs font-medium hover:bg-gray-900 transition-colors">
                      <span>{t("bookNow")}</span>
                    </button>
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
