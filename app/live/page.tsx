"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

interface LiveStream {
  id: string;
  youtube_url: string;
  title: string;
  is_active: boolean;
}

export default function LivePage() {
  const [stream, setStream] = useState<LiveStream | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStream();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchStream, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStream = async () => {
    try {
      const response = await axios.get('/api/live-stream');
      if (response.data && response.data.is_active) {
        setStream(response.data);
      } else {
        setStream(null);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stream:', error);
      setLoading(false);
    }
  };

  const getEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      let videoId = '';
      
      if (urlObj.hostname.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v') || '';
      } else if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.substring(1);
      }
      
      return `https://www.youtube.com/embed/${videoId}`;
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!stream || !stream.youtube_url) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">No Live Stream Available</h1>
            <p className="text-gray-600">
              There is currently no active live stream. Please check back later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          <span className="border-b-4 border-blue-500 pb-2">Live Stream</span>
        </h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="aspect-video">
            <iframe
              src={getEmbedUrl(stream.youtube_url)}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{stream.title}</h2>
              <span className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full animate-pulse">
                LIVE NOW
              </span>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-600">
                Welcome to our live stream!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 