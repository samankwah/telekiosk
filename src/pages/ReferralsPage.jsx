import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import InfoBar from "../components/sections/InfoBar";
import { useLanguage } from "../contexts/LanguageContext";

function ReferralsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    // Doctor Referral Form
    referralFor: "",
    email: "",
    clinicNumber: "",
    address: "",

    // Referring Doctor Information
    doctorName: "",
    doctorEmail: "",
    phoneNumber: "",
    doctorAddress: "",

    // Patient Contact Information
    fullName: "",
    dateOfBirth: "",
    contactNumber: "",
    gender: "male",
    patientAddress: "",
    referringComments: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Referral form submitted:", formData);
    alert(t('referralSubmittedSuccess'));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
          {/* Navigation breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <button 
              onClick={() => navigate('/')}
              className="hover:text-blue-600 transition-colors"
            >
              {t('home')}
            </button>
            <span>›</span>
            <span className="text-gray-900 font-medium">{t('referrals')}</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('referrals')}</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Doctor Referral Form Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {t('doctorReferralForm')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    name="referralFor"
                    value={formData.referralFor}
                    onChange={handleInputChange}
                    placeholder={t('referralForPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t('emailPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="clinicNumber"
                    value={formData.clinicNumber}
                    onChange={handleInputChange}
                    placeholder={t('clinicNumberPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder={t('addressPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Referring Doctor Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {t('referringDoctorInfo')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    name="doctorName"
                    value={formData.doctorName}
                    onChange={handleInputChange}
                    placeholder={t('namePlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="doctorEmail"
                    value={formData.doctorEmail}
                    onChange={handleInputChange}
                    placeholder={t('emailPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder={t('phoneNumberPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <input
                  type="text"
                  name="doctorAddress"
                  value={formData.doctorAddress}
                  onChange={handleInputChange}
                  placeholder={t('addressPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Patient Contact Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {t('patientContactInfo')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder={t('fullNamePlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    placeholder={t('dateOfBirthPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    placeholder={t('contactNumberPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Gender Selection */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  {t('genderLabel')}
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={handleInputChange}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{t('male')}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={handleInputChange}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{t('female')}</span>
                  </label>
                </div>
              </div>

              {/* Patient Address */}
              <div className="mb-4">
                <input
                  type="text"
                  name="patientAddress"
                  value={formData.patientAddress}
                  onChange={handleInputChange}
                  placeholder={t('addressPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Referring Doctor's Comments */}
              <div>
                <textarea
                  name="referringComments"
                  value={formData.referringComments}
                  onChange={handleInputChange}
                  placeholder={t('referringDoctorCommentsPlaceholder')}
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                className="bg-blue-900 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {t('submitRequest')}
              </button>
            </div>
          </form>
        </div>
      </div>

      <InfoBar />
      <Footer />
    </div>
  );
}

export default ReferralsPage;
