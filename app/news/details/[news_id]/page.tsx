// page.tsx or newsDetails.tsx

import { useEffect, useState } from "react";

export default function HomePage() {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('/api/news');  // Mengambil data dari API route
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    }
    fetchNews();
  }, []);

  return (
    <div className="grid">
      {news.map((item, index) => (
        <div className="grid-item space-y-2" key={index}>
          <img className="flex items-center justify-center w-full" src={item.thumbnail} alt={item.title} />
          <h2>{item.title}</h2>
          <p>{new Date(item.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}
