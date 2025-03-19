"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

// Mendefinisikan tipe data untuk props
interface NewsDetailsProps {
  news: {
    title: string;
    thumbnail: string;
    content: string;
  } | null;
}

const NewsDetails = ({ params }: { params: { news_id: string } }) => {
  const [news, setNews] = useState<NewsDetailsProps['news'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsById = async (news_id: string) => {
      try {
        const res = await fetch(`/api/news/${news_id}`);
        if (res.ok) {
          const data = await res.json();
          setNews(data);
        } else {
          setError('News not found');
        }
      } catch (err) {
        setError('An error occurred while fetching news');
      } finally {
        setLoading(false);
      }
    };

    if (params.news_id) {
      fetchNewsById(params.news_id);
    }
  }, [params.news_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!news) {
    return <div>News not found</div>;
  }

  return (
    <div className="space-y-8 py-8 px-6">
      <h1 className="text-3xl font-bold text-center">{news.title}</h1>
      <Image
        src={news.thumbnail}
        alt={news.title}
        width={1920}
        height={1080}
        className="mx-auto max-w-[80vw] h-[500px] object-cover rounded-2xl"
      />
      <div className="max-w-[80vw] mx-auto">
        <p className="text-center">{news.content}</p>
      </div>
    </div>
  );
};

export default NewsDetails;
