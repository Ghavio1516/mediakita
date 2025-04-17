'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface Banner {
  id: string;
  image_url: string;
  title: string;
  description: string;
  order_number: number;
  is_active: boolean;
}

export default function BannersAdminPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [newBanner, setNewBanner] = useState({
    image_url: '',
    title: '',
    description: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get('/api/banners');
      setBanners(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setLoading(false);
    }
  };

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/banners', {
        ...newBanner,
        order_number: banners.length,
      });
      setNewBanner({ image_url: '', title: '', description: '' });
      setShowAddForm(false);
      fetchBanners();
    } catch (error) {
      console.error('Error adding banner:', error);
      alert('Gagal menambah banner');
    }
  };

  const handleUpdateBanner = async (banner: Banner) => {
    try {
      await axios.put(`/api/banners/${banner.id}`, banner);
      setEditingBanner(null);
      fetchBanners();
    } catch (error) {
      console.error('Error updating banner:', error);
      alert('Gagal mengupdate banner');
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!window.confirm('Anda yakin ingin menghapus banner ini?')) return;

    try {
      await axios.delete(`/api/banners/${id}`);
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert('Gagal menghapus banner');
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(banners);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order numbers
    const updatedItems = items.map((item, index) => ({
      ...item,
      order_number: index,
    }));

    setBanners(updatedItems);

    try {
      await axios.put('/api/banners', updatedItems);
    } catch (error) {
      console.error('Error updating banner order:', error);
      alert('Gagal mengupdate urutan banner');
      fetchBanners();
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
              <h1 className="text-2xl font-bold mb-2">Admin Banner</h1>
              <p className="text-gray-600">
                Kelola banner carousel di halaman utama
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              {showAddForm ? 'Tutup Form' : '+ Tambah Banner'}
            </button>
          </div>

          {showAddForm && (
            <div className="mt-6 border-t pt-6">
              <h2 className="text-lg font-semibold mb-4">Tambah Banner Baru</h2>
              <form onSubmit={handleAddBanner} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Gambar
                  </label>
                  <input
                    type="text"
                    value={newBanner.image_url}
                    onChange={(e) =>
                      setNewBanner({ ...newBanner, image_url: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul
                  </label>
                  <input
                    type="text"
                    value={newBanner.title}
                    onChange={(e) =>
                      setNewBanner({ ...newBanner, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    value={newBanner.description}
                    onChange={(e) =>
                      setNewBanner({ ...newBanner, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
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
                    Simpan Banner
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="banners">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {banners.map((banner, index) => (
                  <Draggable
                    key={banner.id}
                    draggableId={banner.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white rounded-lg shadow-md p-4"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={banner.image_url}
                            alt={banner.title}
                            className="w-48 h-32 object-cover rounded"
                          />
                          <div className="flex-1">
                            {editingBanner?.id === banner.id ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={editingBanner.image_url}
                                  onChange={(e) =>
                                    setEditingBanner({
                                      ...editingBanner,
                                      image_url: e.target.value,
                                    })
                                  }
                                  className="w-full px-2 py-1 border rounded"
                                  placeholder="URL Gambar"
                                />
                                <input
                                  type="text"
                                  value={editingBanner.title}
                                  onChange={(e) =>
                                    setEditingBanner({
                                      ...editingBanner,
                                      title: e.target.value,
                                    })
                                  }
                                  className="w-full px-2 py-1 border rounded"
                                  placeholder="Judul"
                                />
                                <textarea
                                  value={editingBanner.description}
                                  onChange={(e) =>
                                    setEditingBanner({
                                      ...editingBanner,
                                      description: e.target.value,
                                    })
                                  }
                                  className="w-full px-2 py-1 border rounded"
                                  placeholder="Deskripsi"
                                  rows={2}
                                />
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => setEditingBanner(null)}
                                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                                  >
                                    Batal
                                  </button>
                                  <button
                                    onClick={() => handleUpdateBanner(editingBanner)}
                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                  >
                                    Simpan
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <h3 className="text-lg font-semibold">
                                  {banner.title || 'Untitled Banner'}
                                </h3>
                                <p className="text-gray-600 mt-1">
                                  {banner.description || 'No description'}
                                </p>
                                <div className="flex justify-end gap-2 mt-2">
                                  <button
                                    onClick={() => setEditingBanner(banner)}
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteBanner(banner.id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                  >
                                    Hapus
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {banners.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
            Belum ada banner. Klik tombol "Tambah Banner" untuk menambahkan banner baru.
          </div>
        )}
      </div>
    </div>
  );
} 