import React, { useState, useEffect } from 'react';

function ImageCarousel({ images, interval = 5000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      {/* Images */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {image.src ? (
              <img
                src={image.src}
                alt={image.alt || `Hospital image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500 text-lg">{image.placeholder}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Soft Edge Fade Effect - Vignette Style */}
      {/* Top edge fade */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white via-white/50 to-transparent pointer-events-none"></div>

      {/* Bottom edge fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/50 to-transparent pointer-events-none"></div>

      {/* Left edge fade */}
      <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-white via-white/50 to-transparent pointer-events-none"></div>

      {/* Right edge fade */}
      <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-white via-white/50 to-transparent pointer-events-none"></div>

      {/* Gradient Overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/20 pointer-events-none"></div>
    </div>
  );
}

export default ImageCarousel;