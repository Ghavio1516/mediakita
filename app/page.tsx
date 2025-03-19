import Link from 'next/link'; // Impor Link dari next/link
import { useEffect, useState } from "react";
import Carousel from "../components/Carousel";

export default function HomePage() {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    // Mengambil data berita dari API route
    async function fetchNews() {
      try {
        const response = await fetch('/api/news');  // Panggil API route
        const data = await response.json();
        setNews(data);  // Menyimpan hasil query berita di state
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    }

    fetchNews(); // Panggil fungsi fetchNews saat komponen dimuat
  }, []); // Hanya sekali saat komponen dimuat

  return (
    <>
      {/* Carousel */}
      <Carousel />

      <div className="grid">
        {news.map((item, index) => (
          <div className="grid-item space-y-2" key={index}>
            {/* Gunakan Link untuk navigasi internal */}
            <Link href={`/news/details/${item.id}`}>
              {/* Hapus <a> di dalam Link */}
              <img className="flex items-center justify-center w-full" src={item.thumbnail} alt={item.title} />
            </Link>
            <h2>{item.title}</h2>
            <p>{new Date(item.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </>
  );
}
