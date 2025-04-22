"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { nanoid } from "nanoid";

interface Comment {
  id: string;
  news_id: string;
  user_name: string;
  comment: string;
  created_at: string;
}

interface NewsCommentsProps {
  newsId: string;
}

export default function NewsComments({ newsId }: NewsCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load saved username from localStorage
  useEffect(() => {
    const savedUserName = localStorage.getItem("newsCommentUserName");
    if (savedUserName) {
      setUserName(savedUserName);
    }
  }, []);

  // Fetch comments
  useEffect(() => {
    fetchComments();
  }, [newsId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/news/${newsId}/comments`);
      setComments(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments");
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userName.trim()) return;

    try {
      // Save username to localStorage
      localStorage.setItem("newsCommentUserName", userName.trim());

      const comment = {
        id: `comment_${nanoid()}`,
        user_name: userName.trim(),
        comment: newComment.trim(),
      };

      await axios.post(`/api/news/${newsId}/comments`, comment);
      setNewComment("");
      fetchComments(); // Refresh comments
      setError(null);
    } catch (error) {
      console.error("Error posting comment:", error);
      setError("Failed to post comment");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className="animate-pulse">Loading comments...</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Komentar</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmitComment} className="mb-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Nama Anda"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Tulis komentar Anda..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Kirim Komentar
        </button>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500">Belum ada komentar</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-blue-600">
                  {comment.user_name}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(comment.created_at)}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">
                {comment.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
