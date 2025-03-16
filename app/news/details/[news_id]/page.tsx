import React from 'react';
import Image from 'next/image';
import { getNewsById } from '../../../../action/news';

interface NewsDetailsProps {
    params: { news_id: string }; // Mendefinisikan tipe untuk params
}

const NewsDetails = async ({ params }: NewsDetailsProps) => {
    const news_id = params.news_id; // Mengakses news_id dari params
    const news = await getNewsById(news_id); // Memanggil fungsi untuk mendapatkan berita berdasarkan ID

    if (!news) {
        return <div>News not found</div>; // Menangani jika berita tidak ditemukan
    }

    return (
        <div className='space-y-8 py-8 px-6'>
            <h1 className='text-3xl font-bold text-center'>{news.title}</h1>
            <Image 
                src={news.thumbnail} 
                alt={news.title} 
                width={1920} 
                height={1080} 
                className='mx-auto max-w-[80vw] h-[500px] object-cover rounded-2xl' 
            />
            <div className='max-w-[80vw] mx-auto'>
                <p className='text-center'>
                    {news.content}
                </p>
            </div>
        </div>
    );
}

export default NewsDetails;
