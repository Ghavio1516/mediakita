// app/news/details/[news_id]/page.tsx

import React from 'react';
import Image from 'next/image';
import { getNewsById, getAllNews } from '../../../../action/news';

// Menambahkan tipe untuk props
interface NewsDetailsProps {
  news: {
    title: string;
    thumbnail: string;
    content: string;
  } | null;
}

// Fungsi untuk mengambil data berita berdasarkan news_id
export async function getStaticProps({ params }: { params: { news_id: string } }) {
  const news = await getNewsById(params.news_id);

  return {
    props: {
      news, // Mengirimkan data berita sebagai props
    },
  };
}

// Fungsi untuk menentukan path dinamis untuk setiap halaman berita
export async function getStaticPaths() {
  const allNews = await getAllNews(); // Mengambil semua berita untuk mendapatkan semua ID
  const paths = allNews.map((news) => ({
    params: { news_id: news.id }, // Menyusun path berdasarkan ID berita
  }));

  return {
    paths,
    fallback: 'blocking', // Gunakan 'blocking' agar Next.js menunggu hingga data siap
  };
}

const NewsDetails = ({ news }: NewsDetailsProps) => {
  if (!news) {
    return <div>News not found</div>; // Menangani jika berita tidak ditemukan
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
