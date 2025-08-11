import React from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

function AboutUsPageTest() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">About Us Page</h1>
        <p className="text-center text-lg mb-8">This is a test version of the About Us page.</p>
        
        <div className="text-center">
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default AboutUsPageTest;