import React from 'react'
import Image from 'next/image'
import { getNewsById } from '../../../../action/news'

const NewsDetails = async ({params}) => {
    params = await params
    const news_id = await params.news_id
    const news = await getNewsById(news_id)

    return (
        <div className='space-y-8 py-8 px-6'>
            <h1 className='text-3xl font-bold text-center'>{news.title}</h1>
            <Image src={news.thumbnail} alt='' width={1920} height={1080} className='mx-auto max-w-[80vw] h-[500px] object-cover rounded-2xl' />
            <div className='max-w-[80vw] mx-auto'>
                <p className='text-center'>
                    {news.content}
                </p>
            </div>
        </div>
    )
}

export default NewsDetails