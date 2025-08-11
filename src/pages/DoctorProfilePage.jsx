import React from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import InfoBar from "../components/sections/InfoBar";
import { useLanguage } from "../contexts/LanguageContext";

function DoctorProfilePage() {
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const { t } = useLanguage();

  const doctorsData = {
    1: {
      name: "Dr Charlotte Osafo",
      qualifications: "MBBS, MD",
      specialty: "Nephrologist",
      specialtyDetail: "Kidney and Urinary System",
      status: "Full time",
      designation: "Senior Consultant",
      clinicDays: "Monday to Friday",
      image: "/src/assets/images/doctor1.jpg",
      areasOfInterest:
        "My main interest is to see a patient-centred healthcare system that meets patient expectations and provides good experiences for them. I enjoy doing research in clinical settings to support evidence-based practice in our local context. I also like teaching and mentoring.",
    },
    2: {
      name: "Dr. Gloria Akosua Ansa",
      qualifications: "MBChB, MBA, PhD",
      specialty: "Public Health, Health Services Management",
      specialtyDetail: "Public Health, Health Services Management",
      status: "Full time",
      designation: "Deputy Medical Director",
      clinicDays: "Monday to Friday",
      image: "/src/assets/images/doctor2.jpg",
      areasOfInterest:
        "My main interest is to see a patient-centred healthcare system that meets patient expectations and provides good experiences for them. I enjoy doing research in clinical settings to support evidence-based practice in our local context. I also like teaching and mentoring.",
    },
    3: {
      name: "Dr Saeed Jibreal",
      qualifications: "MBBS, MRCGP",
      specialty: "Family Physician",
      specialtyDetail: "General Practice and Family Medicine",
      status: "Full time",
      designation: "Senior Family Physician",
      clinicDays: "Monday to Friday",
      image: "/src/assets/images/doctor3.jpg",
      areasOfInterest:
        "My main interest is to see a patient-centred healthcare system that meets patient expectations and provides good experiences for them. I enjoy doing research in clinical settings to support evidence-based practice in our local context. I also like teaching and mentoring.",
    },
    4: {
      name: "Dr. Emmanuel Asanso-Mensah",
      qualifications: "MBChB, MPH",
      specialty: "EMR - Public Health",
      specialtyDetail: "Public Health and Preventive Medicine",
      status: "Full time",
      designation: "Public Health Specialist",
      clinicDays: "Monday to Friday",
      image: "/src/assets/images/doctor4.jpg",
      areasOfInterest:
        "My main interest is to see a patient-centred healthcare system that meets patient expectations and provides good experiences for them. I enjoy doing research in clinical settings to support evidence-based practice in our local context. I also like teaching and mentoring.",
    },
    5: {
      name: "Dr. Mohamed Hafez Sbbawek",
      qualifications: "MBBS, MD",
      specialty: "Internal Medicine",
      specialtyDetail: "Internal Medicine",
      status: "Full time",
      designation: "Consultant Physician",
      clinicDays: "Monday to Friday",
      image: "/src/assets/images/doctor5.jpg",
      areasOfInterest:
        "My main interest is to see a patient-centred healthcare system that meets patient expectations and provides good experiences for them. I enjoy doing research in clinical settings to support evidence-based practice in our local context. I also like teaching and mentoring.",
    },
    6: {
      name: "Dr. Vincent Acorlor",
      qualifications: "MBBS, FRCS",
      specialty: "General Surgery",
      specialtyDetail: "General Surgery",
      status: "Full time",
      designation: "Senior Surgeon",
      clinicDays: "Monday to Friday",
      image: "/src/assets/images/doctor6.jpg",
      areasOfInterest:
        "My main interest is to see a patient-centred healthcare system that meets patient expectations and provides good experiences for them. I enjoy doing research in clinical settings to support evidence-based practice in our local context. I also like teaching and mentoring.",
    },
    7: {
      name: "Dr Solomon Brookman",
      qualifications: "MBBS, MD",
      specialty: "Cardiology",
      specialtyDetail: "Heart and Cardiovascular Medicine",
      status: "Full time",
      designation: "Consultant Cardiologist",
      clinicDays: "Monday to Friday",
      image: "/src/assets/images/doctor7.jpg",
      areasOfInterest:
        "My main interest is to see a patient-centred healthcare system that meets patient expectations and provides good experiences for them. I enjoy doing research in clinical settings to support evidence-based practice in our local context. I also like teaching and mentoring.",
    },
    8: {
      name: "Dr. Kofo Adesu-Kubi",
      qualifications: "MBBS, FRCOG",
      specialty: "Obstetrics and Gynecology",
      specialtyDetail: "Women's Health and Reproductive Medicine",
      status: "Full time",
      designation: "Senior Consultant",
      clinicDays: "Monday to Friday",
      image: "/src/assets/images/doctor8.jpg",
      areasOfInterest:
        "My main interest is to see a patient-centred healthcare system that meets patient expectations and provides good experiences for them. I enjoy doing research in clinical settings to support evidence-based practice in our local context. I also like teaching and mentoring.",
    },
  };

  const doctor = doctorsData[doctorId];

  if (!doctor) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Doctor not found</h1>
          <button
            onClick={() => navigate("/doctors")}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Back to Doctors
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 py-16">
        <div className="container mx-auto px-4">
          <div className="text-left text-white max-w-2xl">
            <h1 className="text-xl md:text-2xl lg:text-base font-bold mb-4 leading-tight">
              Our team of first-class medical professionals focuses on
              individual care and quality treatment of all.
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Go Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/doctors")}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Go Back
          </button>
        </div>

        {/* Doctor Profile Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-full">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Doctor Image */}
            <div className="lg:w-1/3">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-96 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = "/src/assets/images/doctor-placeholder.jpg";
                }}
              />
            </div>

            {/* Doctor Details */}
            <div className="lg:w-2/3">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {doctor.name}
              </h1>

              <div className="space-y-4 mb-6">
                <div>
                  <span className="font-semibold text-blue-600">
                    Qualifications:{" "}
                  </span>
                  <span className="text-gray-800">{doctor.qualifications}</span>
                </div>

                <div>
                  <span className="font-semibold text-blue-600">
                    Specialty:{" "}
                  </span>
                  <span className="text-gray-800">
                    {doctor.specialtyDetail}
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-blue-600">
                    Status (Fulltime/sessional):{" "}
                  </span>
                  <span className="text-gray-800">{doctor.status}</span>
                </div>

                <div>
                  <span className="font-semibold text-blue-600">
                    Designation/Additional Roles:{" "}
                  </span>
                  <span className="text-gray-800">{doctor.designation}</span>
                </div>

                <div>
                  <span className="font-semibold text-blue-600">
                    Clinic Days/Working Hours:{" "}
                  </span>
                  <span className="text-gray-800">{doctor.clinicDays}</span>
                </div>
              </div>

              {/* Book Appointment Button */}
              <button
                onClick={() => navigate("/book-now")}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-6"
              >
                Book Appointment
              </button>
            </div>
          </div>

          {/* Separator Line */}
          <div className="border-t border-gray-300 my-8"></div>

          {/* Areas of Interest */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">
              Areas of interest:{" "}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {doctor.areasOfInterest}
            </p>
          </div>
        </div>
      </div>

      <InfoBar />
      <Footer />
    </div>
  );
}

export default DoctorProfilePage;
