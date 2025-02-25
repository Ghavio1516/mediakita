import { db } from "../lib/db";

const getAllNews = async () => {
    const news = await db.news.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    return news;
};

const getNewsById = async (id: string) => {
    const news = await db.news.findUnique({
        where: {
            id: id,
        },
    });
    return news;
};

export { getAllNews, getNewsById }