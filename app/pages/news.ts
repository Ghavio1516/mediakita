import db from '../../lib/db';
import { ResultSetHeader } from 'mysql2';

// Tipe data untuk berita
type News = {
  id: string;
  title: string;
  thumbnail: string;
  content: string;
  createdAt: string;
};

// Mengambil semua berita (getAllNews)
const getAllNews = async (): Promise<News[]> => {
  try {
    const [results] = await db.query('SELECT * FROM news ORDER BY createdAt DESC');
    return results as News[];  // Menyusun hasil query ke dalam bentuk News[]
  } catch (err) {
    throw new Error('Error fetching news: ' + err);
  }
};

// Mengambil berita berdasarkan ID (getNewsById)
const getNewsById = async (id: string): Promise<News | null> => {
  try {
    const [results] = await db.query('SELECT * FROM news WHERE id = ?', [id]);
    return results[0] ? (results[0] as News) : null;
  } catch (err) {
    throw new Error('Error fetching news by ID: ' + err);
  }
};

// Menambah berita baru (addNews)
const addNews = async (newsData: Omit<News, 'id' | 'createdAt'>): Promise<News> => {
  try {
    const { title, content, thumbnail } = newsData;
    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO news (title, content, thumbnail) VALUES (?, ?, ?)',
      [title, content, thumbnail]
    );
    const newNews: News = {
      id: result.insertId.toString(),  // Insert ID as string
      title,
      content,
      thumbnail,
      createdAt: new Date().toISOString(),
    };
    return newNews;
  } catch (err) {
    throw new Error('Error adding news: ' + err);
  }
};

// Mengupdate berita berdasarkan ID (updateNews)
const updateNews = async (id: string, newsData: Omit<News, 'id' | 'createdAt'>): Promise<News> => {
  try {
    const { title, content, thumbnail } = newsData;
    await db.query(
      'UPDATE news SET title = ?, content = ?, thumbnail = ? WHERE id = ?',
      [title, content, thumbnail, id]
    );
    const updatedNews: News = {
      id,
      title,
      content,
      thumbnail,
      createdAt: new Date().toISOString(),
    };
    return updatedNews;
  } catch (err) {
    throw new Error('Error updating news: ' + err);
  }
};

// Menghapus berita berdasarkan ID (deleteNews)
const deleteNews = async (id: string): Promise<void> => {
  try {
    await db.query('DELETE FROM news WHERE id = ?', [id]);
  } catch (err) {
    throw new Error('Error deleting news: ' + err);
  }
};

// Menangani permintaan API
export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const news = await getAllNews();
        res.status(200).json(news);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
      break;
    case 'POST':
      try {
        const newNews = await addNews(req.body);
        res.status(201).json(newNews);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
      break;
    case 'PUT':
      try {
        const updatedNews = await updateNews(req.body.id, req.body);
        res.status(200).json(updatedNews);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
      break;
    case 'DELETE':
      try {
        await deleteNews(req.body.id);
        res.status(200).json({ message: 'News deleted successfully' });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
      break;
    default:
      res.status(405).json({ error: 'Method Not Allowed' });
      break;
  }
}
