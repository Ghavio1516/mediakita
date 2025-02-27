'use client'
import React, { useEffect, useState } from 'react'

const Carousel = () => {
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
        </>
    )
}

export default Carousel