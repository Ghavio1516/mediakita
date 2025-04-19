"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

interface DisnakerItem {
  id: string;
  categoryId: string;
  name: string;
  selling_price: number;
  buying_price: number;
  unit: string;
  status: 'available' | 'limited' | 'unavailable';
}

interface DisnakerCategory {
  id: string;
  name: string;
  slug: string;
}

interface NewItem {
  categoryId: string;
  name: string;
  selling_price: number | '';
  buying_price: number | '';
  unit: string;
  status: 'available' | 'limited' | 'unavailable';
}

interface StatusOption {
  value: 'available' | 'limited' | 'unavailable';
  label: string;
  icon: string;
}

export default function DisnakerAdminPage() {
  const [items, setItems] = useState<DisnakerItem[]>([]);
  const [categories, setCategories] = useState<DisnakerCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<DisnakerItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<NewItem>({
    categoryId: '',
    name: '',
    selling_price: '',
    buying_price: '',
    unit: '',
    status: 'available'
  });

  const statusOptions: StatusOption[] = [
    { value: 'available', label: 'Sedang Menerima', icon: '🟢' },
    { value: 'limited', label: 'Stock Gudang Hampir Penuh', icon: '🟡' },
    { value: 'unavailable', label: 'Tidak Menerima / Stock Gudang Penuh', icon: '🔴' }
  ];

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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.categoryId || !newItem.name || !newItem.selling_price || !newItem.buying_price || !newItem.unit) {
      alert('Semua field harus diisi');
      return;
    }

    try {
      await axios.post('/api/disnaker/items', newItem);
      setNewItem({
        categoryId: '',
        name: '',
        selling_price: '',
        buying_price: '',
        unit: '',
        status: 'available'
      });
      setShowAddForm(false);
      fetchData();
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Gagal menambah item');
    }
  };

  const handleStatusChange = async (item: DisnakerItem, newStatus: 'available' | 'limited' | 'unavailable') => {
    try {
      await axios.put(`/api/disnaker/items/${item.id}`, {
        status: newStatus
      });
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Gagal mengubah status');
    }
  };

  const handleSave = async (item: DisnakerItem) => {
    try {
      await axios.put(`/api/disnaker/items/${item.id}`, {
        name: item.name,
        selling_price: item.selling_price,
        buying_price: item.buying_price,
        unit: item.unit,
        status: item.status
      });
      setEditingItem(null);
      fetchData();
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Gagal menyimpan perubahan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Anda yakin ingin menghapus item ini?')) return;

    try {
      await axios.delete(`/api/disnaker/items/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Gagal menghapus item');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">Admin Disnaker</h1>
              <p className="text-gray-600">
                Kelola data harga dan status barang Disnaker
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              {showAddForm ? 'Tutup Form' : '+ Tambah Item'}
            </button>
          </div>

          {showAddForm && (
            <div className="mt-6 border-t pt-6">
              <h2 className="text-lg font-semibold mb-4">Tambah Item Baru</h2>
              <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={newItem.categoryId}
                    onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Barang
                  </label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga Jual ($)
                  </label>
                  <input
                    type="number"
                    value={newItem.selling_price}
                    onChange={(e) => setNewItem({ ...newItem, selling_price: e.target.value ? Number(e.target.value) : '' })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga Beli ($)
                  </label>
                  <input
                    type="number"
                    value={newItem.buying_price}
                    onChange={(e) => setNewItem({ ...newItem, buying_price: e.target.value ? Number(e.target.value) : '' })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Satuan
                  </label>
                  <input
                    type="text"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Simpan Item
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Nama Barang</th>
                    <th className="px-4 py-2 text-left">Satuan</th>
                    <th className="px-4 py-2 text-right">Harga Jual</th>
                    <th className="px-4 py-2 text-right">Harga Beli</th>
                    <th className="px-4 py-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items
                    .filter((item) => item.categoryId === category.id)
                    .map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="px-4 py-2">
                          <select
                            value={item.status}
                            onChange={(e) => handleStatusChange(item, e.target.value as 'available' | 'limited' | 'unavailable')}
                            className="w-full px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500"
                          >
                            {statusOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.icon} {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          {editingItem?.id === item.id ? (
                            <input
                              type="text"
                              value={editingItem.name}
                              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            <span className="hover:text-blue-600 cursor-pointer" onClick={() => setEditingItem(item)}>
                              {item.name}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {editingItem?.id === item.id ? (
                            <input
                              type="text"
                              value={editingItem.unit}
                              onChange={(e) => setEditingItem({ ...editingItem, unit: e.target.value })}
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            item.unit
                          )}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {editingItem?.id === item.id ? (
                            <input
                              type="number"
                              value={editingItem.selling_price}
                              onChange={(e) => setEditingItem({ ...editingItem, selling_price: Number(e.target.value) })}
                              className="w-32 px-2 py-1 border rounded text-right"
                              min="0"
                              step="0.01"
                            />
                          ) : (
                            <span className="hover:text-blue-600 cursor-pointer" onClick={() => setEditingItem(item)}>
                              $ {item.selling_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {editingItem?.id === item.id ? (
                            <input
                              type="number"
                              value={editingItem.buying_price}
                              onChange={(e) => setEditingItem({ ...editingItem, buying_price: Number(e.target.value) })}
                              className="w-32 px-2 py-1 border rounded text-right"
                              min="0"
                              step="0.01"
                            />
                          ) : (
                            <span className="hover:text-blue-600 cursor-pointer" onClick={() => setEditingItem(item)}>
                              $ {item.buying_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex justify-center gap-2">
                            {editingItem?.id === item.id ? (
                              <>
                                <button
                                  onClick={() => handleSave(editingItem)}
                                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                  Simpan
                                </button>
                                <button
                                  onClick={() => setEditingItem(null)}
                                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                  Batal
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => setEditingItem(item)}
                                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                  Hapus
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Keterangan Status:</h2>
          <div className="space-y-2">
            {statusOptions.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 