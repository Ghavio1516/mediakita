// app/admin/page.tsx
"use client";
import { useState } from 'react';
import axios from 'axios';

export default function AdminPage() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    thumbnail: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/news', formData);
      setFormData({ title: '', content: '', thumbnail: '' });
    } catch (error) {
      console.error('Error adding news:', error);
    }
  };

  return (
    <div>
      <h1>Admin Panel - Manage News</h1>
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
        <button type="submit">Add News</button>
      </form>
    </div>
  );
}
