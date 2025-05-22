"use client";

import { useState, useEffect } from "react";

interface MediaItem {
  url: string;
  type: "image" | "video";
  thumbnail?: string;
}

interface MediaCarouselProps {
  mediaList: MediaItem[];
  onClose: () => void;
}

export default function MediaCarousel({
  mediaList,
  onClose,
}: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const getVideoType = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return "youtube";
    } else if (url.includes("tiktok.com")) {
      return "tiktok";
    }
    return "regular";
  };

  const getVideoId = (url: string, type: string) => {
    if (type === "youtube") {
      const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? match[2] : null;
    } else if (type === "tiktok") {
      return url.split("/").pop()?.split("?")[0] || null;
    }
    return null;
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === mediaList.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? mediaList.length - 1 : prevIndex - 1
    );
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mediaList.length]);

  if (!mediaList || mediaList.length === 0) return null;

  const currentMedia = mediaList[currentIndex];
  const videoType = getVideoType(currentMedia.url);
  const videoId = getVideoId(currentMedia.url, videoType);

  return (
    <div className="relative w-full h-full bg-black">
      {/* Media display */}
      <div className="relative w-full h-full flex items-center justify-center">
        {currentMedia.type === "image" ? (
          <img
            src={currentMedia.url}
            alt={`Media ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              console.error("Error loading image:", currentMedia.url);
              e.currentTarget.src = "/placeholder-image.jpg";
            }}
          />
        ) : videoType === "youtube" && videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : videoType === "tiktok" && videoId ? (
          <iframe
            src={`https://www.tiktok.com/embed/v2/${videoId}`}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <video
            src={currentMedia.url}
            poster={currentMedia.thumbnail}
            controls
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              console.error("Error loading video:", currentMedia.url);
            }}
          />
        )}
      </div>

      {/* Navigation buttons */}
      {mediaList.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Thumbnails */}
      {mediaList.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {mediaList.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}

      {/* Media counter */}
      {mediaList.length > 1 && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          {currentIndex + 1} / {mediaList.length}
        </div>
      )}
    </div>
  );
}
