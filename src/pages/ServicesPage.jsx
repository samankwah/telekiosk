import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useLanguage } from "../contexts/LanguageContext";

function ServicesPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

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
                <p className="font-semibold text-lg">Medical Professional</p>
                <p className="text-sm">Medical research and care</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
          <div className="max-w-xl">
            {/* Main Headline Text */}
            <h1 className="text-base font-normal mb-8 leading-relaxed">
              The Bank Hospital provides quality healthcare driven by a strong,
              customer-centric focus.
            </h1>

            {/* Search Bar */}
            <div className="flex mb-8">
              <input
                type="text"
                placeholder="Find a Doctor"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 text-gray-900 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-r-md font-semibold transition-colors">
                🔍
              </button>
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
                    Book Appointment
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
                  <span className="text-white font-medium">Referrals</span>
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
                  <span className="text-white font-medium">Directions</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Exact Target Image Layout */}
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
                      <p className="font-semibold text-lg">Hospital Corridor</p>
                      <p className="text-sm">Clean, modern medical facility</p>
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
                        Department
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Cardiology Content */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-8 tracking-wide">
                  CARDIOLOGY
                </h1>
                <div className="space-y-4 text-gray-700 leading-relaxed text-base">
                  <p>
                    Cardiovascular diseases are the leading cause of death
                    globally, taking an estimated 17.9 million lives each year.
                    9 of of the world's death from cardiovascular diseases occur
                    in low- and middle-income countries of which Ghana is
                    inclusive. People in low-middle income countries often do
                    not have the benefit of integrated primary health care
                    programmes for early detection and treatment of people with
                    cardiovascular disease risk factors.
                  </p>
                  <p>
                    As a result, people in these countries die early from
                    cardiovascular diseases often in their most productive
                    years.
                  </p>
                </div>
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
              YOUR HEALTH IS OUR TOP PRIORITY. CLICK HERE TO
            </h2>
            <button 
              onClick={() => navigate('/booking')}
              className="bg-gray-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors whitespace-nowrap"
            >
              Schedule an Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Cardiology Details Section - Dark Blue Background */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left Side - CT Scanner Image */}
            <div>
              <div className="bg-white rounded-lg overflow-hidden shadow-xl border-4 border-white">
                <div className="h-80 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🏥</span>
                    </div>
                    <p className="font-semibold text-lg">CT Scanner Room</p>
                    <p className="text-sm">Advanced cardiac imaging equipment</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Cardiology Details */}
            <div className="space-y-8">
              
              {/* Aim Section */}
              <div>
                <h3 className="text-2xl font-bold text-orange-400 mb-4">Aim</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  Improve cardiovascular care and save lives of Ghanaians with Atherosclerotic cardiovascular diseases 
                  such as coronary artery disease.
                </p>
              </div>

              {/* Objective Section */}
              <div>
                <h3 className="text-2xl font-bold text-orange-400 mb-4">Objective</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Offer one stop comprehensive care for patients with Atherosclerotic cardiovascular diseases such 
                      as acute coronary syndrome (heart attack)
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Improve quality of life of patients with symptomatic Brady arrhythmias such as complete heart 
                      block
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Prevent amputation and improve the quality of life of patients with peripheral artery diseases.
                    </p>
                  </div>
                </div>
              </div>

              {/* Services Section */}
              <div>
                <h3 className="text-2xl font-bold text-orange-400 mb-4">Services</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Coronary angiogram for evaluation of patients with chest pain.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Per cutaneous coronary intervention (stenting) for patients with heart attack or significant 
                      obstructive coronary artery disease with chest pain.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Pacemaker implantation for patients presenting with syncope or palpitation as a result of 
                      bradyarrhythmias such as complete heart block.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Evaluation and stenting for patients with intermittent Claudication from peripheral artery diseases
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Device therapy for patients with congenital heart diseases
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Right heart catheterization
                    </p>
                  </div>
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
                    <p className="font-semibold text-xl">Professional Stethoscope</p>
                    <p className="text-blue-100 mt-2">Cardiac assessment tool</p>
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
                  AVAILABLE <span className="text-blue-600">SUPPORT</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-800 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">Cardiologist</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-800 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">Interventional cardiologist</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-800 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">Supportive Nursing care</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-800 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">ICU care</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-800 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">Radiology support</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">
                  We offer comprehensive evaluation of chest pain of cardiac origin with non-invasive 
                  cardiovascular assessments (exercise stress testing, pharmacological stress testing and 
                  cardiovascular imaging (cardiac CT for calcium scoring and many more)
                </p>
              </div>

              {/* Expected Outcome Section */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  EXPECTED <span className="text-blue-600">OUTCOME</span>
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Save and improve the lives of patients with cardiovascular diseases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ServicesPage;
