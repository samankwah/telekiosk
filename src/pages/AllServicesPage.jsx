import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import InfoBar from "../components/sections/InfoBar";
import { useLanguage } from "../contexts/LanguageContext";

function AllServicesPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Define all service categories and their services
  const serviceCategories = {
    specialists: {
      title: "SPECIALISTS SERVICES",
      services: [
        { name: "Pediatrics", link: "/services/pediatrics" },
        { name: "Obstetrics & Gynecology", link: "/services/gynecology" },
        { name: "Ophthalmology", link: "/services/ophthalmology" },
        { name: "Orthopedic", link: "/services/orthopedics" },
        { name: "Nephrology (including Dialysis Service)", link: "/services/nephrology" },
        { name: "Neurology (Stroke and Post-stroke Management)", link: "/services/neurology" },
        { name: "Dental", link: "/services/dental" },
        { name: "Ear, Nose and Throat (ENT)", link: "/services/ent" },
        { name: "Family Physician", link: "/services/family" },
        { name: "General /Vascular Surgery Clinic", link: "/services/surgery" },
        { name: "Plastic Surgery clinic", link: "/services/plastic-surgery" },
        { name: "Paediatric Surgery clinic", link: "/services/pediatric-surgery" },
        { name: "Clinical Psychology", link: "/services/psychology" },
        { name: "Urology", link: "/services/urology" },
        { name: "Physician Specialist", link: "/services/physician" },
        { name: "Gastroenterology", link: "/services/gastroenterology" },
        { name: "Endocrinology/Diabetology", link: "/services/endocrinology" },
        { name: "Anesthetic", link: "/services/anesthetic" },
        { name: "Dermatology (Skin Disease)", link: "/services/dermatology" },
        { name: "Infectiology (Infectious Disease)", link: "/services/infectiology" },
        { name: "Psychiatry", link: "/services/psychiatry" },
        { name: "Hematology", link: "/services/hematology" },
        { name: "Pulmonology", link: "/services/pulmonology" }
      ]
    },
    cardiology: {
      title: "CARDIOLOGY SERVICES",
      services: [
        { name: "Consultation", link: "/services/cardiology" },
        { name: "Stress ECG", link: "/services/cardiology" },
        { name: "Holter ECG", link: "/services/cardiology" },
        { name: "Ambulatory BP Monitoring", link: "/services/cardiology" },
        { name: "Echocardiograms", link: "/services/cardiology" },
        { name: "Cardiovascular Risk Assessment", link: "/services/cardiology" }
      ]
    },
    outpatient: {
      title: "OUTPATIENT SERVICES",
      services: [
        { name: "General Practitioners' Consultations", link: "/services/general" }
      ]
    },
    catheterization: {
      title: "CATHETERIZATION LABORATORY",
      services: [
        { name: "Coronary Angiogram", link: "/services/cardiology" },
        { name: "Percutaneous Coronary Intervention (PCI) FOR HEART ATTACK", link: "/services/cardiology" },
        { name: "Pacemaker Insertion", link: "/services/cardiology" },
        { name: "Cerebral Angiogram", link: "/services/neurology" },
        { name: "Severe Peripheral Artery disease", link: "/services/cardiology" }
      ]
    },
    alliedHealth: {
      title: "ALLIED HEALTH SERVICES",
      services: [
        { name: "Allied Health Services", link: "/services/allied-health" },
        { name: "Physiotherapy Services", link: "/services/physiotherapy" },
        { name: "Dietician", link: "/services/nutrition" },
        { name: "Audiology", link: "/services/audiology" },
        { name: "Speech Therapy", link: "/services/speech-therapy" }
      ]
    },
    theatre: {
      title: "THEATRE",
      services: [
        { name: "General Surgery", link: "/services/surgery" },
        { name: "Neurosurgery", link: "/services/neurosurgery" },
        { name: "Paediatric Surgery", link: "/services/pediatric-surgery" },
        { name: "Plastic Surgery", link: "/services/plastic-surgery" },
        { name: "Vascular Surgery", link: "/services/vascular-surgery" },
        { name: "Obstetrics and gynae including laparoscopic gynae procedures.", link: "/services/gynecology" },
        { name: "Ophthalmic surgery", link: "/services/ophthalmology" },
        { name: "Orthopedic surgery", link: "/services/orthopedics" },
        { name: "ENT surgery", link: "/services/ent" }
      ]
    },
    radiology: {
      title: "RADIOLOGY SERVICES",
      services: [
        { name: "Chest X-ray", link: "/services/radiology" },
        { name: "Dental X-ray", link: "/services/radiology" },
        { name: "Ultrasound", link: "/services/radiology" },
        { name: "CT-Scan", link: "/services/radiology" },
        { name: "MRI", link: "/services/radiology" },
        { name: "Mammogram", link: "/services/radiology" },
        { name: "Interventional radiology", link: "/services/radiology" }
      ]
    },
    laboratory: {
      title: "LABORATORY SERVICES",
      services: [
        { name: "Chemical Pathology", link: "/services/laboratory" },
        { name: "Hematology", link: "/services/laboratory" },
        { name: "Immunology", link: "/services/laboratory" },
        { name: "Microbiology", link: "/services/laboratory" }
      ]
    },
    gastroscopy: {
      title: "GASTROSCOPY PROCEDURES",
      services: [
        { name: "Endoscopy", link: "/services/gastroenterology" },
        { name: "Colonoscopy", link: "/services/gastroenterology" },
        { name: "Polypectomy", link: "/services/gastroenterology" },
        { name: "Emergency Services", link: "/services/emergency" }
      ]
    },
    inpatient: {
      title: "INPATIENT SERVICES",
      services: [
        { name: "Medical Ward", link: "/services/inpatient" },
        { name: "Surgical Ward", link: "/services/inpatient" },
        { name: "Paediatric ward", link: "/services/inpatient" },
        { name: "Intensive Care Unit", link: "/services/inpatient" },
        { name: "Neonatal Intensive Care unit", link: "/services/inpatient" },
        { name: "VIP Ward", link: "/services/inpatient" }
      ]
    }
  };

  const handleServiceClick = (link) => {
    navigate(link);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Standard Pattern */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Background Image - Medical Professional */}
        <div className="absolute right-0 top-0 w-1/2 h-full">
          <div className="w-full h-full bg-gradient-to-l from-slate-700 to-transparent">
            <div className="w-full h-full flex items-center justify-center opacity-30">
              <div className="text-center text-white/60">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🏥</span>
                </div>
                <p className="font-semibold text-lg">Medical Services</p>
                <p className="text-sm">Comprehensive healthcare directory</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
          <div className="max-w-xl">
            <h1 className="text-base font-normal mb-8 leading-relaxed">
              {t("servicesSubtitle")}
            </h1>

            {/* Search Bar */}
            <div className="relative mb-8">
              <input
                type="text"
                placeholder={t("findDoctor")}
                className="w-full px-4 py-3 pr-12 text-gray-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="absolute right-0 top-0 h-full px-4 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex divide-x divide-white/20">
              <button
                onClick={() => navigate("/booking")}
                className="flex items-center justify-start py-6 px-6 pr-8 hover:bg-white/5 cursor-pointer transition-colors touch-manipulation group flex-1"
              >
                <div className="flex items-center space-x-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span className="text-white font-medium">{t("bookAppointment")}</span>
                </div>
              </button>

              <button
                onClick={() => navigate("/referrals")}
                className="flex items-center justify-start py-6 px-8 hover:bg-white/5 cursor-pointer transition-colors touch-manipulation group flex-1"
              >
                <div className="flex items-center space-x-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                  <span className="text-white font-medium">{t("referrals")}</span>
                </div>
              </button>

              <button
                onClick={() => window.open("https://maps.google.com/?q=The+Bank+Hospital+Accra", "_blank")}
                className="flex items-center justify-start py-6 px-8 pl-8 hover:bg-white/5 cursor-pointer transition-colors touch-manipulation group flex-1"
              >
                <div className="flex items-center space-x-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <span className="text-white font-medium">{t("directions")}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Header */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-orange-400 font-semibold text-sm mb-2 uppercase tracking-wide">
            {t("healthServices").toUpperCase()}
          </p>
          <h1 className="text-lg text-gray-800 font-normal">
            {t("servicesSubtitle")}
          </h1>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Row 1: Short cards first */}
            {/* Outpatient Services - SMALL (1 service) */}
            <div className="bg-white border border-gray-300 rounded p-4 h-fit">
              <h3 className="text-base font-bold text-gray-800 mb-4 text-left">
                {serviceCategories.outpatient.title}
              </h3>
              <div className="space-y-0">
                {serviceCategories.outpatient.services.map((service, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-2 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => handleServiceClick(service.link)}
                  >
                    <div className="w-4 h-4 border border-gray-400 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm text-left">
                      {service.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Laboratory Services - SMALL (4 services) */}
            <div className="bg-white border border-gray-300 rounded p-4 h-fit">
              <h3 className="text-base font-bold text-gray-800 mb-4 text-left">
                {serviceCategories.laboratory.title}
              </h3>
              <div className="space-y-0">
                {serviceCategories.laboratory.services.map((service, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-2 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => handleServiceClick(service.link)}
                  >
                    <div className="w-4 h-4 border border-gray-400 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm text-left">
                      {service.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gastroscopy Procedures - SMALL (4 services) */}
            <div className="bg-white border border-gray-300 rounded p-4 h-fit">
              <h3 className="text-base font-bold text-gray-800 mb-4 text-left">
                {serviceCategories.gastroscopy.title}
              </h3>
              <div className="space-y-0">
                {serviceCategories.gastroscopy.services.map((service, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-2 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => handleServiceClick(service.link)}
                  >
                    <div className="w-4 h-4 border border-gray-400 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm text-left">
                      {service.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2: Medium cards */}
            {/* Catheterization Laboratory - MEDIUM (5 services) */}
            <div className="bg-white border border-gray-300 rounded p-4 h-fit">
              <h3 className="text-base font-bold text-gray-800 mb-4 text-left">
                {serviceCategories.catheterization.title}
              </h3>
              <div className="space-y-0">
                {serviceCategories.catheterization.services.map((service, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-2 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => handleServiceClick(service.link)}
                  >
                    <div className="w-4 h-4 border border-gray-400 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm text-left">
                      {service.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Allied Health Services - MEDIUM (5 services) */}
            <div className="bg-white border border-gray-300 rounded p-4 h-fit">
              <h3 className="text-base font-bold text-gray-800 mb-4 text-left">
                {serviceCategories.alliedHealth.title}
              </h3>
              <div className="space-y-0">
                {serviceCategories.alliedHealth.services.map((service, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-2 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => handleServiceClick(service.link)}
                  >
                    <div className="w-4 h-4 border border-gray-400 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm text-left">
                      {service.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cardiology Services - MEDIUM (6 services) */}
            <div className="bg-white border border-gray-300 rounded p-4 h-fit">
              <h3 className="text-base font-bold text-gray-800 mb-4 text-left">
                {serviceCategories.cardiology.title}
              </h3>
              <div className="space-y-0">
                {serviceCategories.cardiology.services.map((service, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-2 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => handleServiceClick(service.link)}
                  >
                    <div className="w-4 h-4 border border-gray-400 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm text-left">
                      {service.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 3: Medium cards continued */}
            {/* Radiology Services - MEDIUM (7 services) */}
            <div className="bg-white border border-gray-300 rounded p-4 h-fit">
              <h3 className="text-base font-bold text-gray-800 mb-4 text-left">
                {serviceCategories.radiology.title}
              </h3>
              <div className="space-y-0">
                {serviceCategories.radiology.services.map((service, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-2 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => handleServiceClick(service.link)}
                  >
                    <div className="w-4 h-4 border border-gray-400 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm text-left">
                      {service.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inpatient Services - MEDIUM (6 services) */}
            <div className="bg-white border border-gray-300 rounded p-4 h-fit">
              <h3 className="text-base font-bold text-gray-800 mb-4 text-left">
                {serviceCategories.inpatient.title}
              </h3>
              <div className="space-y-0">
                {serviceCategories.inpatient.services.map((service, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-2 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => handleServiceClick(service.link)}
                  >
                    <div className="w-4 h-4 border border-gray-400 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm text-left">
                      {service.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Theatre - LARGE (9 services) - moved to bottom */}
            <div className="bg-white border border-gray-300 rounded p-4 h-fit">
              <h3 className="text-base font-bold text-gray-800 mb-4 text-left">
                {serviceCategories.theatre.title}
              </h3>
              <div className="space-y-0">
                {serviceCategories.theatre.services.map((service, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-2 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => handleServiceClick(service.link)}
                  >
                    <div className="w-4 h-4 border border-gray-400 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm text-left">
                      {service.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 4: Largest card at the bottom */}
            {/* Specialists Services - LARGE (23 services) - moved to bottom */}
            <div className="bg-white border border-gray-300 rounded p-4 h-fit">
              <h3 className="text-base font-bold text-gray-800 mb-4 text-left">
                {serviceCategories.specialists.title}
              </h3>
              <div className="space-y-0">
                {serviceCategories.specialists.services.map((service, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-2 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => handleServiceClick(service.link)}
                  >
                    <div className="w-4 h-4 border border-gray-400 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm text-left">
                      {service.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <InfoBar />
      <Footer />
    </div>
  );
}

export default AllServicesPage;