"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import MediaCarousel from "../components/MediaCarousel";

interface MediaItem {
  url: string;
  type: "image" | "video";
  thumbnail?: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  media_type: "image" | "video";
  media_url: string;
  thumbnail_url: string;
  media_list: MediaItem[];
  category: string;
  created_at: string;
}

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<PortfolioItem | null>(
    null
  );

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get("/api/portfolio");
      setItems(response.data);

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(response.data.map((item: PortfolioItem) => item.category))
      ).filter(Boolean) as string[];
      setCategories(uniqueCategories);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      setError("Failed to load portfolio items");
      setLoading(false);
    }
  };

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

  const getThumbnail = (item: PortfolioItem) => {
    if (item.media_type === "image") {
      return item.media_url;
    }

    const videoType = getVideoType(item.media_url);
    const videoId = getVideoId(item.media_url, videoType);

    if (videoType === "youtube" && videoId) {
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }

    return item.thumbnail_url || "/video-placeholder.jpg";
  };

  const renderMedia = (item: PortfolioItem) => {
    // If there are additional media items, show the first image
    if (Array.isArray(item.media_list) && item.media_list.length > 0) {
      const firstImage = item.media_list.find(
        (media) => media.type === "image"
      );
      if (firstImage) {
        return (
          <div
            className="w-full h-full relative group cursor-pointer"
            onClick={() => setSelectedMedia(item)}
          >
            <img
              src={firstImage.url}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {item.media_list.length > 1 && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-white text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                  <span className="text-sm">
                    View {item.media_list.length} media
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      }
    }

    // Fallback to main media
    const thumbnail = getThumbnail(item);
    const isVideo = item.media_type === "video";

    return (
      <div
        className="w-full h-full relative group cursor-pointer"
        onClick={() => setSelectedMedia(item)}
      >
        <img
          src={thumbnail}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        {isVideo && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>
    );
  };

  const renderMediaModal = (item: PortfolioItem) => {
    // Create combined media list with main media first
    const combinedMediaList: MediaItem[] = [
      {
        url: item.media_url,
        type: item.media_type,
        thumbnail: item.thumbnail_url,
      },
      ...(Array.isArray(item.media_list) ? item.media_list : []),
    ];

    return (
      <div className="space-y-4">
        <div className="relative aspect-video">
          <MediaCarousel
            mediaList={combinedMediaList}
            onClose={() => setSelectedMedia(null)}
          />
        </div>
      </div>
    );
  };

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          <span className="border-b-4 border-blue-500 pb-2">Portfolio</span>
        </h1>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === category
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative aspect-video">{renderMedia(item)}</div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
                {item.category && (
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full mb-2">
                    {item.category}
                  </span>
                )}
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No portfolio items found in this category.
            </p>
          </div>
        )}

        {/* Media Modal */}
        {selectedMedia && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">{selectedMedia.title}</h3>
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <div className="aspect-video">
                  {renderMediaModal(selectedMedia)}
                </div>
                <p className="mt-4 text-gray-600">
                  {selectedMedia.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
