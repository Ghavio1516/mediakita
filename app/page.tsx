// "use client";

import { useEffect, useState } from "react";
import { getAllNews } from "../action/news";
import Carousel from "../components/Carousel";

export default async function HomePage() {
  
  const news = await getAllNews();

  return (
    <>
      {/* Carousel */}
      <Carousel />

      {/* <marquee
        className="py-3"
        direction="left"
        onMouseOver={(e) => e.target.stop()}
        onMouseOut={(e) => e.target.start()}
        scrollamount="10"
        behavior="scroll"
      >
        Selamat Datang di #MEDIA KITA.
      </marquee> */}

      <div className="grid">
        {news.map((item, index) => (
          <div className="grid-item space-y-2" key={index}>
            <a href={'/news/details/' + item.id} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full">
              <img src={item.thumbnail} alt={item.title} />
            </a>
            <h2>{item.title}</h2>
            <p>{item.createdAt.toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </>
  );
}
