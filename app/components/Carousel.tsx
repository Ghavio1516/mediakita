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
      <div className="w-full aspect-[1748/620] bg-gray-100 animate-pulse flex items-center justify-center rounded-2xl overflow-hidden">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-[1748px] mx-auto px-4 my-6">
      <div
        className="relative aspect-[1748/620] overflow-hidden rounded-2xl shadow-2xl group bg-gray-900"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/10 z-20">
          <div
            className="h-full bg-white/50 backdrop-blur-sm transition-all duration-500 ease-out"
            style={{ width: `${((currentImageIndex + 1) / banners.length) * 100}%` }}
          />
        </div>

        <div
          className="absolute w-full h-full flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="w-full h-full flex-shrink-0 relative">
              <img
                src={banner.image_url}
                alt={banner.title || 'Banner'}
                className="w-full h-full object-cover object-center transform transition-transform duration-500 scale-105 group-hover:scale-100"
                style={{ 
                  imageRendering: 'crisp-edges',
                  aspectRatio: '1748/620'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-4 group-hover:translate-x-0 z-10 border border-white/10"
              aria-label="Previous slide"
            >
              <FiChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 z-10 border border-white/10"
              aria-label="Next slide"
            >
              <FiChevronRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === currentImageIndex 
                    ? 'w-8 bg-white' 
                    : 'w-4 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Current Slide Number */}
        <div className="absolute top-6 right-6 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full z-10 text-white/90 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {currentImageIndex + 1} / {banners.length}
        </div>
      </div>
    </div>
  );
};

export default Carousel;