import { useEffect } from 'react';

function MapModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div className="relative bg-white rounded-lg shadow-xl w-11/12 max-w-4xl h-5/6 max-h-[600px] mx-4">
        {/* Modal header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Hospital Location</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </button>
        </div>

        {/* Map container */}
        <div className="p-4 h-full">
          <div className="w-full h-full rounded-lg overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7940.858911547933!2d-0.16714722413947028!3d5.650843632686896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9ca15e56390f%3A0xe32353079eab7d22!2sGHANA%20METEOROLOGICAL%20AGENCY!5e0!3m2!1sen!2sgh!4v1753275247145!5m2!1sen!2sgh"
              className="w-full h-full rounded"
              style={{border: 0, minHeight: '400px'}}
              allowFullScreen=""
              loading="eager" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Hospital Location Map"
            >
              <p>Your browser does not support iframes. Please visit Google Maps directly.</p>
            </iframe>
          </div>
        </div>

        {/* Footer with additional info */}
        <div className="p-4 border-t bg-gray-50 rounded-b-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <p className="text-sm text-gray-600">
                <strong>Address:</strong> Ghana Meteorological Agency Area, Accra
              </p>
            </div>
            <a
              href="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7940.858911547933!2d-0.16714722413947028!3d5.650843632686896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9ca15e56390f%3A0xe32353079eab7d22!2sGHANA%20METEOROLOGICAL%20AGENCY!5e0!3m2!1sen!2sgh!4v1753275247145!5m2!1sen!2sgh"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapModal;