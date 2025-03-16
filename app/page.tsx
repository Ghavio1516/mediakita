import Link from 'next/link'; // Impor Link dari next/link
import { useEffect, useState } from "react";
import { getAllNews } from "../action/news";
import Carousel from "../components/Carousel";

export default async function HomePage() {
  const news = await getAllNews();

  return (
    <>
      {/* Carousel */}
      <Carousel />

      <div className="grid">
        {news.map((item, index) => (
          <div className="grid-item space-y-2" key={index}>
            {/* Gunakan Link untuk navigasi internal */}
            <Link href={`/news/details/${item.id}`}>
              <a className="flex items-center justify-center w-full">
                <img src={item.thumbnail} alt={item.title} />
              </a>
            </Link>
            <h2>{item.title}</h2>
            <p>{new Date(item.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </>
  );
}
