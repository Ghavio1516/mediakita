"use client";
import Link from 'next/link';
import { useEffect, useState } from "react";
import Carousel from "../components/Carousel";

export default function HomePage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('/api/news');
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Carousel />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Latest News</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <Link href={`/news/details/${item.id}`} key={item.id} className="transform hover:scale-105 transition duration-300">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
                <div className="relative h-48">
                  <img 
                    className="w-full h-full object-cover" 
                    src={item.thumbnail} 
                    alt={item.title}
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 min-h-[4rem]">
                    {item.title}
                  </h2>
                  <div className="flex items-center text-gray-600 mt-auto">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
