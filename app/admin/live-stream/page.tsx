"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

interface LiveStream {
  id: string;
  youtube_url: string;
  title: string;
  is_active: boolean;
  created_at: string;
}

export default function LiveStreamAdminPage() {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [newStream, setNewStream] = useState({
    youtube_url: '',
    title: ''
  });

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    try {
      const response = await axios.get('/api/live-stream');
      setStreams([response.data].filter(stream => stream.id));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching streams:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/live-stream', newStream);
      setNewStream({ youtube_url: '', title: '' });
      fetchStreams();
    } catch (error) {
      console.error('Error creating stream:', error);
      alert('Error creating stream. Please check the URL and try again.');
    }
  };

  const toggleStreamStatus = async (id: string, newStatus: boolean) => {
    try {
      await axios.put('/api/live-stream', { id, is_active: newStatus });
      fetchStreams();
    } catch (error) {
      console.error('Error updating stream:', error);
      alert('Error updating stream status.');
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
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Manage Live Stream</h1>

        {/* Add New Stream Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Stream</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                YouTube URL
              </label>
              <input
                type="url"
                value={newStream.youtube_url}
                onChange={(e) => setNewStream({ ...newStream, youtube_url: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newStream.title}
                onChange={(e) => setNewStream({ ...newStream, title: e.target.value })}
                placeholder="Stream Title"
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Stream
            </button>
          </form>
        </div>

        {/* Current Streams */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Current Streams</h2>
          <div className="space-y-6">
            {streams.map((stream) => (
              <div key={stream.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">{stream.title}</h3>
                    <p className="text-sm text-gray-500">{stream.youtube_url}</p>
                  </div>
                  <button
                    onClick={() => toggleStreamStatus(stream.id, !stream.is_active)}
                    className={`px-4 py-2 rounded ${
                      stream.is_active
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {stream.is_active ? 'Stop Stream' : 'Start Stream'}
                  </button>
                </div>
                {stream.youtube_url && (
                  <div className="aspect-video">
                    <iframe
                      src={getEmbedUrl(stream.youtube_url)}
                      className="w-full h-full rounded"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            ))}
            {streams.length === 0 && (
              <p className="text-gray-500 text-center">No streams available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 