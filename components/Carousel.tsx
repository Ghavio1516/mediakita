'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Banner {
  id: string;
  image_url: string;
  title: string;
  description: string;
}

const Carousel = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get('/api/banners');
      setBanners(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setLoading(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + banners.length) % banners.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentImageIndex(index);
  };

  useEffect(() => {
    if (banners.length > 0 && !isHovered) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % banners.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [banners.length, isHovered]);

  if (loading) {
    return (
      <div className="w-full aspect-[1748/1240] max-h-[500px] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="w-full mx-auto">
      <div
        className="relative aspect-[1748/1240] max-h-[500px] overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="absolute w-full h-full flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="w-full h-full flex-shrink-0 relative">
              <img
                src={banner.image_url}
                alt={banner.title || 'Banner'}
                className="w-full h-full object-contain"
                style={{ aspectRatio: '1748/1240' }}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 flex items-center justify-center backdrop-blur-md opacity-100 z-10"
              aria-label="Previous slide"
            >
              <FiChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 flex items-center justify-center backdrop-blur-md opacity-100 z-10"
              aria-label="Next slide"
            >
              <FiChevronRight className="w-5 h-5 text-white" />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'w-6 bg-white' 
                    : 'w-3 bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Carousel;