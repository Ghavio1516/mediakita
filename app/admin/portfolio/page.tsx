"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { nanoid } from "nanoid";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  media_type: "image" | "video";
  media_url: string;
  thumbnail_url: string;
  category: string;
  created_at: string;
}

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    media_type: "image" as "image" | "video",
    media_url: "",
    thumbnail_url: "",
    category: "",
  });

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get("/api/portfolio");
      setItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      setError("Failed to load portfolio items");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(`/api/portfolio/${editingItem.id}`, formData);
      } else {
        await axios.post("/api/portfolio", formData);
      }
      setFormData({
        title: "",
        description: "",
        media_type: "image",
        media_url: "",
        thumbnail_url: "",
        category: "",
      });
      setEditingItem(null);
      fetchPortfolio();
    } catch (error) {
      console.error("Error saving portfolio item:", error);
      setError("Failed to save portfolio item");
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      media_type: item.media_type,
      media_url: item.media_url,
      thumbnail_url: item.thumbnail_url || "",
      category: item.category || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await axios.delete(`/api/portfolio/${id}`);
      fetchPortfolio();
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
      setError("Failed to delete portfolio item");
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

  const renderMediaPreview = (item: PortfolioItem) => {
    if (item.media_type === "image") {
      return (
        <img
          src={item.media_url}
          alt={item.title}
          className="w-16 h-16 object-cover rounded"
        />
      );
    }

    const videoType = getVideoType(item.media_url);
    const videoId = getVideoId(item.media_url, videoType);

    if (videoType === "youtube" && videoId) {
      return (
        <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
          <img
            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
            alt={item.title}
            className="w-full h-full object-cover rounded"
          />
        </div>
      );
    } else if (videoType === "tiktok" && videoId) {
      return (
        <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-400"
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
      );
    }

    return (
      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-gray-400"
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
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          <span className="border-b-4 border-blue-500 pb-2">
            Manage Portfolio
          </span>
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Add/Edit Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingItem ? "Edit Portfolio Item" : "Add New Portfolio Item"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Media Type
              </label>
              <select
                value={formData.media_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    media_type: e.target.value as "image" | "video",
                  })
                }
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Media URL
              </label>
              <input
                type="url"
                value={formData.media_url}
                onChange={(e) =>
                  setFormData({ ...formData, media_url: e.target.value })
                }
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder={
                  formData.media_type === "video"
                    ? "https://www.youtube.com/watch?v=... or https://www.tiktok.com/@username/video/..."
                    : "https://example.com/image.jpg"
                }
              />
              {formData.media_type === "video" && (
                <p className="mt-1 text-sm text-gray-500">
                  Paste YouTube or TikTok video URL
                </p>
              )}
            </div>

            {formData.media_type === "video" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.thumbnail_url}
                  onChange={(e) =>
                    setFormData({ ...formData, thumbnail_url: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-4">
              {editingItem && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setFormData({
                      title: "",
                      description: "",
                      media_type: "image",
                      media_url: "",
                      thumbnail_url: "",
                      category: "",
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {editingItem ? "Update" : "Add"} Item
              </button>
            </div>
          </form>
        </div>

        {/* Portfolio Items List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preview
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderMediaPreview(item)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.media_type === "video"
                          ? getVideoType(item.media_url)
                          : item.media_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {item.category || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
