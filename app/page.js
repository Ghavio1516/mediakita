"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const items = Array.from({ length: 6 }, (_, i) => ({
    title: `Thumbnail ${i + 1}`,
    date: "30 Desember 2024",
    link: `/news/details/${i + 1}`,
  }));

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fungsi untuk melompat ke gambar berikutnya
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 3); // Menggunakan 3 gambar
  };

  // Fungsi untuk kembali ke gambar sebelumnya
  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + 3) % 3 // Menggunakan 3 gambar
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 3); // Ganti gambar setiap 3 detik
    }, 5000);

    return () => clearInterval(interval); // Cleanup ketika komponen dibersihkan
  }, []);

  const carouselImages = [
    "/spaceavailable1.png", // Gambar pertama
    "/spaceavailable2.png", // Gambar kedua
    "/spaceavailable3.png", // Gambar ketiga
  ];

  return (
    <>
      {/* Carousel */}
      <div className="carousel">
        <div className="carousel-inner" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
          {carouselImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Iklan ${index + 1}`}
              className="carousel-image"
            />
          ))}
        </div>

        {/* Tombol navigasi */}
        <button className="carousel-control prev" onClick={prevImage}>
          &lt;
        </button>
        <button className="carousel-control next" onClick={nextImage}>
          &gt;
        </button>
      </div>

      <marquee
        className="py-3"
        direction="left"
        onMouseOver={(e) => e.target.stop()}
        onMouseOut={(e) => e.target.start()}
        scrollamount="10"
        behavior="scroll"
      >
        Selamat Datang di #MEDIA KITA.
      </marquee>

      <div className="grid">
        {items.map((item, index) => (
          <div className="grid-item space-y-2" key={index}>
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full">
              <img src="/thumbnail.png" alt={item.title} />
            </a>
            <h2>{item.title}</h2>
            <p>{item.date}</p>
          </div>
        ))}
      </div>
    </>
  );
}
