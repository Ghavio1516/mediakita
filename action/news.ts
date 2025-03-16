import db from "../lib/db";

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
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM news ORDER BY createdAt DESC',
            (err, results: any) => {  // Tentukan tipe data 'any' untuk results
                if (err) {
                    reject(err); // Mengirimkan error jika terjadi kesalahan
                } else {
                    resolve(results as News[]); // Pastikan hasil query memiliki tipe News[]
                }
            }
        );
    });
};

// Mengambil berita berdasarkan ID (getNewsById)
const getNewsById = async (id: string): Promise<News | null> => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM news WHERE id = ?',
            [id],
            (err, results: any) => {  // Tentukan tipe data 'any' untuk results
                if (err) {
                    reject(err);
                } else {
                    resolve(results[0] ? (results[0] as News) : null); // Pastikan hasil pertama memiliki tipe News
                }
            }
        );
    });
};

export { getAllNews, getNewsById };
