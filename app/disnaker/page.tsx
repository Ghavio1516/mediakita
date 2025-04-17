"use client";
import { useState, useEffect } from "react";
import axios from "axios";

interface DisnakerItem {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  unit: string;
  status: 'available' | 'limited' | 'unavailable';
}

interface DisnakerCategory {
  id: string;
  name: string;
  slug: string;
}

export default function DisnakerPage() {
  const [items, setItems] = useState<DisnakerItem[]>([]);
  const [categories, setCategories] = useState<DisnakerCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        axios.get('/api/disnaker/items'),
        axios.get('/api/disnaker/categories')
      ]);
      setItems(itemsRes.data.items);
      setCategories(categoriesRes.data);
      setLastUpdate(itemsRes.data.lastUpdate);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'available':
        return '🟢';
      case 'limited':
        return '🟡';
      case 'unavailable':
        return '🔴';
      default:
        return '⚪';
    }
  };

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen p-4 flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">HARGA DISNAKER</h1>
          <div className="text-right">
            <p className="text-gray-400">Last Update</p>
            <p className="text-green-500">
              {lastUpdate ? new Date(lastUpdate).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              }).toUpperCase() + ' | ' + 
              new Date(lastUpdate).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
              }) + ' WIB' : '-'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-green-400">Status Penerimaan</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span>🟢</span>
                <p>SEDANG DIJUAL</p>
              </div>
              <div className="flex items-center gap-3">
                <span>🟡</span>
                <p>STOCK GUDANG HAMPIR PENUH</p>
              </div>
              <div className="flex items-center gap-3">
                <span>🔴</span>
                <p>TIDAK MENERIMA / STOCK GUDANG PENUH</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-green-400">{category.name}</h2>
              <div className="space-y-4">
                {items
                  .filter((item) => item.categoryId === category.id)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-gray-800 p-4 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <span>{getStatusEmoji(item.status)}</span>
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-gray-400 text-sm">{item.unit}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-xl font-bold ${
                            item.status === 'available'
                              ? 'text-green-500'
                              : item.status === 'limited'
                              ? 'text-yellow-500'
                              : 'text-red-500'
                          }`}
                        >
                          ${item.price}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-red-500 text-lg font-semibold">
            SILAHKAN KE KANTOR PEMERINTAHAN UNTUK LANGSUNG DI JUAL
          </p>
        </div>
      </div>
    </div>
  );
}
