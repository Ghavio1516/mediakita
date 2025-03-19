"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminPage() {
  // State for the form inputs
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    thumbnail: ''
  });

  // State for managing the list of news and handling loading and errors
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);  // Store the ID of the news being edited

  // Fetch all news on page load
  useEffect(() => {
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
    fetchNews();
  }, []);

  // Handle input changes in the form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission for adding or editing news
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    try {
      await axios.delete('/api/news', { data: { id } });
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
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
  };

  // Fetch all news after submitting or deleting a news item
  const fetchNews = async () => {
    try {
      const response = await axios.get('/api/news');
      setNewsList(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  return (
    <div>
      <h1>Admin Panel - Manage News</h1>
      <button onClick={() => setEditing(null)}>Add News</button>

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
        />
        <textarea
          name="content"
          placeholder="Content"
          value={formData.content}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="thumbnail"
          placeholder="Thumbnail URL"
          value={formData.thumbnail}
          onChange={handleInputChange}
        />
        <button type="submit">{editing ? 'Update News' : 'Add News'}</button>
      </form>

      {/* News List */}
      <div>
        {loading ? (
          <p>Loading news...</p>
        ) : (
          <ul>
            {newsList.map((news) => (
              <li key={news.id}>
                <h2>{news.title}</h2>
                <img src={news.thumbnail} alt={news.title} width={100} height={100} />
                <p>{news.content}</p>
                <button onClick={() => handleEdit(news)}>Edit</button>
                <button onClick={() => handleDelete(news.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
