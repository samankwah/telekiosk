import React from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import InfoBar from "../components/sections/InfoBar";
import { ServiceDetailSkeleton } from "../components/ui/SkeletonLoader";
import { useLoading } from "../hooks/useLoading";
import { useLanguage } from "../contexts/LanguageContext";

function ServicesPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const isLoading = useLoading(1000); // Show skeleton for 1 second

  // Define available services with detailed information
  const servicesData = {
    cardiology: {
      name: t('cardiologyName'),
      icon: '❤️',
      description: t('cardiologyDescription'),
      extendedDescription: t('cardiologyExtendedDescription'),
      aim: t('cardiologyAim'),
      objectives: [
        'Offer one stop comprehensive care for patients with Atherosclerotic cardiovascular diseases such as acute coronary syndrome (heart attack)',
        'Improve quality of life of patients with symptomatic Brady arrhythmias such as complete heart block',
        'Prevent amputation and improve the quality of life of patients with peripheral artery diseases.'
      ],
      services: [
        'Coronary angiogram for evaluation of patients with chest pain.',
        'Per cutaneous coronary intervention (stenting) for patients with heart attack or significant obstructive coronary artery disease with chest pain.',
        'Pacemaker implantation for patients presenting with syncope or palpitation as a result of bradyarrhythmias such as complete heart block.',
        'Evaluation and stenting for patients with intermittent Claudication from peripheral artery diseases',
        'Device therapy for patients with congenital heart diseases',
        'Right heart catheterization'
      ],
      support: ['Cardiologist', 'Interventional cardiologist', 'Supportive Nursing care', 'ICU care', 'Radiology support'],
      supportDescription: 'We offer comprehensive evaluation of chest pain of cardiac origin with non-invasive cardiovascular assessments (exercise stress testing, pharmacological stress testing and cardiovascular imaging (cardiac CT for calcium scoring and many more)',
      outcome: t('cardiologyOutcome'),
      image: '🏥',
      imageDescription: t('cardiologyImageDescription')
    },
    neurology: {
      name: 'NEUROLOGY',
      icon: '🧠',
      description: 'Neurological disorders affect millions of people worldwide and include conditions affecting the brain, spinal cord, and nervous system. Our neurology department provides comprehensive care for patients with various neurological conditions.',
      extendedDescription: 'We focus on early detection, accurate diagnosis, and effective treatment of neurological disorders to improve patient outcomes and quality of life.',
      aim: 'Provide comprehensive neurological care and improve the quality of life for patients with neurological disorders.',
      objectives: [
        'Offer specialized care for patients with neurological conditions including stroke, epilepsy, and movement disorders',
        'Provide advanced diagnostic services including EEG, EMG, and neuroimaging',
        'Deliver personalized treatment plans for each patient\'s neurological needs'
      ],
      services: [
        'Stroke evaluation and treatment',
        'Epilepsy management and monitoring',
        'Movement disorder assessment',
        'Headache and migraine treatment',
        'Neuromuscular disorder evaluation',
        'Cognitive assessment and dementia care'
      ],
      support: ['Neurologist', 'Neurosurgeon', 'Specialized nursing staff', 'Rehabilitation therapists', 'Neuroimaging technicians'],
      supportDescription: 'Our multidisciplinary team provides comprehensive neurological care with advanced diagnostic tools and treatment options.',
      outcome: 'Improved neurological function and enhanced quality of life for patients with neurological conditions.',
      image: '🧠',
      imageDescription: 'Neurology Unit - Advanced neurological assessment center'
    },
    pediatrics: {
      name: 'PEDIATRICS',
      icon: '👶',
      description: 'Our pediatrics department is dedicated to providing comprehensive healthcare for infants, children, and adolescents. We focus on preventive care, early intervention, and specialized treatment for pediatric conditions.',
      extendedDescription: 'We understand that children have unique healthcare needs and provide a child-friendly environment with specialized pediatric care.',
      aim: 'Provide exceptional healthcare services for children from infancy through adolescence, ensuring healthy growth and development.',
      objectives: [
        'Deliver comprehensive preventive care including vaccinations and health screenings',
        'Provide specialized treatment for childhood illnesses and conditions',
        'Support healthy growth and development through adolescence',
        'Offer family-centered care and education'
      ],
      services: [
        'Well-child checkups and vaccinations',
        'Treatment of childhood illnesses',
        'Growth and development monitoring',
        'Pediatric emergency care',
        'Adolescent health services',
        'Nutritional counseling for children'
      ],
      support: ['Pediatricians', 'Pediatric nurses', 'Child life specialists', 'Nutritionists', 'Social workers'],
      supportDescription: 'Our pediatric team creates a comfortable, child-friendly environment while providing the highest quality medical care.',
      outcome: 'Healthy growth and development of children with optimal health outcomes.',
      image: '👶',
      imageDescription: 'Pediatric Ward - Child-friendly medical care environment'
    },
    dermatology: {
      name: 'DERMATOLOGY',
      icon: '✨',
      description: 'Our dermatology department provides comprehensive care for skin, hair, and nail conditions. We offer both medical and cosmetic dermatology services to help patients achieve healthy skin.',
      extendedDescription: 'From common skin conditions to complex dermatological disorders, our team provides expert diagnosis and treatment.',
      aim: 'Provide comprehensive dermatological care to promote healthy skin and treat various skin conditions.',
      objectives: [
        'Diagnose and treat various skin conditions and disorders',
        'Provide preventive skin care education and skin cancer screening',
        'Offer cosmetic dermatology services for skin enhancement',
        'Deliver specialized care for chronic skin conditions'
      ],
      services: [
        'Skin cancer screening and treatment',
        'Acne treatment and management',
        'Eczema and psoriasis care',
        'Cosmetic dermatology procedures',
        'Hair and nail disorder treatment',
        'Dermatological surgery'
      ],
      support: ['Dermatologists', 'Dermatology nurses', 'Aestheticians', 'Surgical technicians'],
      supportDescription: 'Our dermatology team uses advanced techniques and technologies to provide comprehensive skin care.',
      outcome: 'Improved skin health and enhanced patient confidence through effective dermatological care.',
      image: '✨',
      imageDescription: 'Dermatology Clinic - Modern skin care treatment facility'
    },
    orthopedics: {
      name: 'ORTHOPEDICS',
      icon: '🦴',
      description: 'Our orthopedic department specializes in the diagnosis, treatment, and rehabilitation of musculoskeletal conditions affecting bones, joints, ligaments, tendons, and muscles.',
      extendedDescription: 'We provide both surgical and non-surgical treatments to help patients regain mobility and function.',
      aim: 'Restore mobility and function for patients with musculoskeletal conditions through comprehensive orthopedic care.',
      objectives: [
        'Provide expert diagnosis and treatment of bone and joint conditions',
        'Offer both surgical and non-surgical treatment options',
        'Deliver comprehensive rehabilitation services',
        'Focus on injury prevention and sports medicine'
      ],
      services: [
        'Joint replacement surgery',
        'Fracture treatment and bone repair',
        'Sports injury management',
        'Arthroscopic procedures',
        'Spine surgery and treatment',
        'Physical therapy and rehabilitation'
      ],
      support: ['Orthopedic surgeons', 'Physical therapists', 'Occupational therapists', 'Sports medicine specialists'],
      supportDescription: 'Our orthopedic team provides comprehensive care from diagnosis through rehabilitation to restore optimal function.',
      outcome: 'Restored mobility, reduced pain, and improved quality of life for patients with musculoskeletal conditions.',
      image: '🦴',
      imageDescription: 'Orthopedic Surgery Suite - Advanced bone and joint treatment center'
    },
    emergency: {
      name: 'EMERGENCY MEDICINE',
      icon: '🚨',
      description: 'Our emergency department provides 24/7 comprehensive emergency medical care for patients with acute illnesses and injuries requiring immediate attention.',
      extendedDescription: 'We are equipped to handle all types of medical emergencies with rapid assessment, stabilization, and treatment.',
      aim: 'Provide immediate, high-quality emergency medical care to save lives and stabilize patients in critical conditions.',
      objectives: [
        'Deliver rapid assessment and treatment of emergency conditions',
        'Provide 24/7 availability for all medical emergencies',
        'Coordinate with other departments for specialized emergency care',
        'Offer trauma care and critical patient stabilization'
      ],
      services: [
        '24/7 emergency care',
        'Trauma and injury treatment',
        'Cardiac emergency management',
        'Stroke and neurological emergencies',
        'Pediatric emergency care',
        'Poison control and overdose treatment'
      ],
      support: ['Emergency physicians', 'Trauma surgeons', 'Emergency nurses', 'Paramedics', 'Radiology technicians'],
      supportDescription: 'Our emergency team is trained to handle all types of medical emergencies with rapid response and expert care.',
      outcome: 'Rapid stabilization and treatment of emergency conditions with optimal patient outcomes.',
      image: '🚨',
      imageDescription: 'Emergency Department - 24/7 critical care facility'
    },
    general: {
      name: 'GENERAL MEDICINE',
      icon: '🏥',
      description: 'Our general medicine department provides comprehensive primary healthcare services for adults, focusing on prevention, diagnosis, and treatment of common medical conditions.',
      extendedDescription: 'We serve as the first point of contact for patients seeking medical care and coordinate referrals to specialists when needed.',
      aim: 'Provide comprehensive primary healthcare services and coordinate overall patient care.',
      objectives: [
        'Deliver comprehensive primary healthcare services',
        'Provide preventive care and health screenings',
        'Manage chronic conditions and coordinate specialist care',
        'Offer health education and lifestyle counseling'
      ],
      services: [
        'Annual health checkups and screenings',
        'Chronic disease management',
        'Vaccination and immunization',
        'Minor procedure and wound care',
        'Health counseling and education',
        'Specialist referrals and coordination'
      ],
      support: ['General practitioners', 'Family medicine physicians', 'Nurse practitioners', 'Health educators'],
      supportDescription: 'Our general medicine team provides comprehensive primary care with focus on prevention and early intervention.',
      outcome: 'Improved overall health and well-being through comprehensive primary healthcare services.',
      image: '🏥',
      imageDescription: 'General Medicine Ward - Comprehensive primary healthcare facility'
    },
    surgery: {
      name: 'SURGERY',
      icon: '🔬',
      description: 'Our surgery department offers comprehensive surgical services with advanced techniques and state-of-the-art equipment to provide safe and effective surgical care.',
      extendedDescription: 'We specialize in various surgical procedures from routine operations to complex surgical interventions.',
      aim: 'Provide safe, effective surgical care using advanced techniques and technology.',
      objectives: [
        'Deliver comprehensive surgical services across multiple specialties',
        'Use minimally invasive techniques when appropriate',
        'Provide excellent pre-operative and post-operative care',
        'Maintain the highest standards of surgical safety'
      ],
      services: [
        'General surgery procedures',
        'Laparoscopic and minimally invasive surgery',
        'Emergency surgical interventions',
        'Day surgery and outpatient procedures',
        'Complex surgical procedures',
        'Post-operative care and monitoring'
      ],
      support: ['Surgeons', 'Anesthesiologists', 'Operating room nurses', 'Surgical technicians'],
      supportDescription: 'Our surgical team uses advanced techniques and equipment to provide safe and effective surgical care.',
      outcome: 'Successful surgical outcomes with minimal complications and rapid recovery.',
      image: '🔬',
      imageDescription: 'Operating Theater - Advanced surgical facility'
    }
  };

  // Get current service data (default to cardiology if no service specified)
  const currentService = servicesData[serviceId] || servicesData.cardiology;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Same as other pages */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Background Image - Medical Professional */}
        <div className="absolute right-0 top-0 w-1/2 h-full">
          <div className="w-full h-full bg-gradient-to-l from-slate-700 to-transparent">
            {/* Image placeholder */}
            <div className="w-full h-full flex items-center justify-center opacity-30">
              <div className="text-center text-white/60">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">👩‍⚕️🔬</span>
                </div>
                <p className="font-semibold text-lg">{t('medicalProfessional')}</p>
                <p className="text-sm">{t('medicalResearchCare')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
          <div className="max-w-xl">
            {/* Main Headline Text */}
            <h1 className="text-base font-normal mb-8 leading-relaxed">
              {t('qualityHealthcareDesc')}
            </h1>

            {/* Search Bar Placeholder */}
            <div className="mb-8">
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder={t('searchServices')}
                  className="w-full px-4 py-3 pr-12 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  readOnly
                  onFocus={(e) => e.target.blur()}
                />
                <button className="absolute right-0 top-0 h-full px-4 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 transition-colors" onClick={(e) => e.preventDefault()}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Action Buttons - Clean Design with Dividers */}
            <div className="flex divide-x divide-white/20">
              {/* Book Appointment Button */}
              <button
                onClick={() => navigate("/booking")}
                className="flex items-center justify-start py-6 px-6 pr-8 hover:bg-white/5 cursor-pointer transition-colors touch-manipulation group flex-1"
              >
                <div className="flex items-center space-x-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span className="text-white font-medium">
                    {t('bookAppointment')}
                  </span>
                </div>
              </button>

              {/* Referrals Button */}
              <button
                onClick={() => navigate("/referrals")}
                className="flex items-center justify-start py-6 px-8 hover:bg-white/5 cursor-pointer transition-colors touch-manipulation group flex-1"
              >
                <div className="flex items-center space-x-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                  <span className="text-white font-medium">{t('referrals')}</span>
                </div>
              </button>

              {/* Directions Button */}
              <button
                onClick={() =>
                  window.open(
                    "https://maps.google.com/?q=The+Bank+Hospital+Accra",
                    "_blank"
                  )
                }
                className="flex items-center justify-start py-6 px-8 pl-8 hover:bg-white/5 cursor-pointer transition-colors touch-manipulation group flex-1"
              >
                <div className="flex items-center space-x-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <span className="text-white font-medium">{t('directions')}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Exact Target Image Layout */}
      {isLoading ? (
        <ServiceDetailSkeleton />
      ) : (
        <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Hospital Image */}
            <div className="space-y-6">
              <div className="relative">
                <div className="bg-gray-100 h-80 rounded-lg overflow-hidden shadow-lg">
                  {/* Hospital corridor image */}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                    <div className="text-center text-gray-500">
                      <div className="w-20 h-20 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🏥</span>
                      </div>
                      <p className="font-semibold text-lg">{t('hospitalCorridor')}</p>
                      <p className="text-sm">{t('cleanModernFacility')}</p>
                    </div>
                  </div>

                  {/* Jordan Department Sign */}
                  <div className="absolute top-6 left-6">
                    <div className="bg-white bg-opacity-95 px-4 py-3 rounded-md shadow-lg border">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                        <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                          JORDAN
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 uppercase tracking-wider">
                        {t('department')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Service Content */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-8 tracking-wide flex items-center space-x-3">
                  <span>{currentService.icon}</span>
                  <span>{currentService.name}</span>
                </h1>
                <div className="space-y-4 text-gray-700 leading-relaxed text-base">
                  <p>{currentService.description}</p>
                  {currentService.extendedDescription && (
                    <p>{currentService.extendedDescription}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-orange-500 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-xl font-bold text-white">
                {t('yourHealthPriority')}
              </h2>
              <button
                onClick={() => navigate("/booking")}
                className="bg-gray-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors whitespace-nowrap"
              >
                {t('scheduleAppointment')}
              </button>
            </div>
          </div>
        </div>

        {/* Service Details Section - Dark Blue Background */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Side - Service Image */}
              <div>
                <div className="bg-white rounded-lg overflow-hidden shadow-xl border-4 border-white">
                  <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">{currentService.image}</span>
                      </div>
                      <p className="font-semibold text-lg">{currentService.name} Unit</p>
                      <p className="text-sm">
                        {currentService.imageDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Service Details */}
              <div className="space-y-8">
                {/* Aim Section */}
                <div>
                  <h3 className="text-2xl font-bold text-orange-400 mb-4">{t('aim')}</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {currentService.aim}
                  </p>
                </div>

                {/* Objective Section */}
                <div>
                  <h3 className="text-2xl font-bold text-orange-400 mb-4">
                    {t('objectives')}
                  </h3>
                  <div className="space-y-3">
                    {currentService.objectives.map((objective, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {objective}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Services Section */}
                <div>
                  <h3 className="text-2xl font-bold text-orange-400 mb-4">
                    {t('services')}
                  </h3>
                  <div className="space-y-3">
                    {currentService.services.map((service, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {service}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Support & Expected Outcome Section - White Background with Orange Borders */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left Side - Stethoscope Image with Orange Borders */}
              <div className="relative">
                {/* Thick Orange Vertical Line */}
                <div className="absolute left-0 top-0 w-2 h-full bg-orange-500 z-10"></div>

                <div className="bg-gradient-to-br from-blue-400 to-blue-600 relative">
                  <div className="h-96 flex items-center justify-center p-8">
                    <div className="text-center text-white">
                      <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">🩺</span>
                      </div>
                      <p className="font-semibold text-xl">
                        {t('professionalStethoscope')}
                      </p>
                      <p className="text-blue-100 mt-2">
                        {t('cardiacAssessmentTool')}
                      </p>
                    </div>
                  </div>

                  {/* Thick Orange Horizontal Line at Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-orange-500"></div>
                </div>
              </div>

              {/* Right Side - Available Support & Expected Outcome */}
              <div className="bg-white p-8 lg:p-12">
                {/* Available Support Section */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    {t('available')} <span className="text-blue-600">{t('support')}</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mb-6">
                    {currentService.support.map((supportItem, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-gray-800 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{supportItem}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {currentService.supportDescription}
                  </p>
                </div>

                {/* Expected Outcome Section */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {t('expected')} <span className="text-blue-600">{t('outcome')}</span>
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {currentService.outcome}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      <InfoBar />
      <Footer />
    </div>
  );
}

export default ServicesPage;
