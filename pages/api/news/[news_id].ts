import db from '../../../lib/db';

// Tipe data untuk berita
type News = {
  id: string;
  title: string;
  thumbnail: string;
  content: string;
  createdAt: string;
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

// Menangani permintaan API
export default async function handler(req, res) {
  const { news_id } = req.query;  // Access dynamic `news_id` parameter

  switch (req.method) {
    case 'GET':
      if (news_id) {
        try {
          const news = await getNewsById(news_id as string);
          if (news) {
            res.status(200).json(news);
          } else {
            res.status(404).json({ error: 'News not found' });
          }
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      } else {
        res.status(400).json({ error: 'News ID is required' });
      }
      break;

    default:
      res.status(405).json({ error: 'Method Not Allowed' });
      break;
  }
}
