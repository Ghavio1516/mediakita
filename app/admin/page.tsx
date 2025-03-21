"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminPage() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    thumbnail: ''
  });

  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      try {
        await axios.put(`/api/news`, { ...formData, id: editing });
        setFormData({ title: '', content: '', thumbnail: '' });
        setEditing(null);
        fetchNews();
      } catch (error) {
        console.error('Error editing news:', error);
      }
    } else {
      try {
        await axios.post('/api/news', formData);
        setFormData({ title: '', content: '', thumbnail: '' });
        fetchNews();
      } catch (error) {
        console.error('Error adding news:', error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete('/api/news', { data: { id } });
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  const handleEdit = (news: any) => {
    setEditing(news.id);
    setFormData({
      title: news.title,
      content: news.content,
      thumbnail: news.thumbnail
    });
  };

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
          rows={25}  // Adjust rows for more space
          cols={400}  // Adjust width for more space
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
