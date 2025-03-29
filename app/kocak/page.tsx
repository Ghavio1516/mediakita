"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
});


export default function AdminPage() {
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // State for the form inputs
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    thumbnail: ''
  });

  // State for form validation errors
  const [errors, setErrors] = useState({
    title: '',
    content: '',
    thumbnail: ''
  });

  // State for managing the list of news and handling loading and errors
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);  // Store the ID of the news being edited

  // Fetch all news after submitting or deleting a news item
  const fetchNews = async () => {
    try {
      const response = await axios.get('/api/news');
      setNewsList(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
    }
  };

  // Fetch all news on page load
  useEffect(() => {
    fetchNews();
  }, []);

  const handleUnlock = () => {
    if (password === 'mediakita2025') {
      setIsLocked(false);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  if (isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Access</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <button
              onClick={handleUnlock}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
            >
              Unlock
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle input changes in the form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    setErrors({
      ...errors,
      [name]: ''
    });
  };

  // Handle rich text editor changes
  const handleContentChange = (content: string) => {
    setFormData({
      ...formData,
      content: content
    });
    // Clear content error
    setErrors({
      ...errors,
      content: ''
    });
  };

  // Validate form data
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      title: '',
      content: '',
      thumbnail: ''
    };

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
      isValid = false;
    }

    // Content validation
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
      isValid = false;
    } else if (formData.content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters long';
      isValid = false;
    }

    // Thumbnail validation
    if (!formData.thumbnail.trim()) {
      newErrors.thumbnail = 'Thumbnail URL is required';
      isValid = false;
    } else {
      try {
        new URL(formData.thumbnail);
      } catch (e) {
        newErrors.thumbnail = 'Please enter a valid URL';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission for adding or editing news
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (editing) {
      // Edit existing news
      try {
        await axios.put(`/api/news`, { ...formData, id: editing });
        setFormData({ title: '', content: '', thumbnail: '' });
        setEditing(null);
        fetchNews();
      } catch (error) {
        console.error('Error editing news:', error);
      }
    } else {
      // Add new news
      try {
        await axios.post('/api/news', formData);
        setFormData({ title: '', content: '', thumbnail: '' });
        fetchNews();
      } catch (error) {
        console.error('Error adding news:', error);
      }
    }
  };

  // Handle delete functionality
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this news?')) {
      try {
        await axios.delete('/api/news', { data: { id } });
        fetchNews();
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  };

  // Handle edit button click
  const handleEdit = (news: any) => {
    setEditing(news.id);
    setFormData({
      title: news.title,
      content: news.content,
      thumbnail: news.thumbnail
    });
    // Clear any existing errors
    setErrors({
      title: '',
      content: '',
      thumbnail: ''
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Panel - Manage News</h1>
      
      <div className="mb-8">
        <button 
          onClick={() => {
            setEditing(null);
            setFormData({ title: '', content: '', thumbnail: '' });
            setErrors({ title: '', content: '', thumbnail: '' });
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add News
        </button>
      </div>

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter news title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-500' : ''
            }`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <div className={`h-64 ${errors.content ? 'border border-red-500 rounded' : ''}`}>
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={handleContentChange}
              className="h-48"
            />
          </div>
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
          <input
            type="text"
            name="thumbnail"
            placeholder="Enter thumbnail URL"
            value={formData.thumbnail}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.thumbnail ? 'border-red-500' : ''
            }`}
          />
          {errors.thumbnail && <p className="text-red-500 text-sm mt-1">{errors.thumbnail}</p>}
        </div>
        <button 
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          {editing ? 'Update News' : 'Add News'}
        </button>
      </form>

      {/* News List */}
      <div>
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading news...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsList.map((news) => (
              <div key={news.id} className="bg-white rounded-lg shadow overflow-hidden">
                <img 
                  src={news.thumbnail} 
                  alt={news.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{news.title}</h2>
                  <div 
                    className="text-gray-600 mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: news.content }}
                  />
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(news)}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(news.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}