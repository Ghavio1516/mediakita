"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

interface LiveStream {
  id: string;
  youtube_url: string;
  title: string;
  is_active: boolean;
}

export default function LiveStream() {
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
    return null;
  }

  if (!stream || !stream.youtube_url) {
    return null;
  }

  return (
    <div className="w-full bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="aspect-video">
            <iframe
              src={getEmbedUrl(stream.youtube_url)}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-4">
            <h2 className="text-xl font-bold text-white">{stream.title}</h2>
            <p className="text-green-500 text-sm">LIVE NOW</p>
          </div>
        </div>
      </div>
    </div>
  );
} 