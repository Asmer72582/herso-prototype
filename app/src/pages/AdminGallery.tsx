import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Trash2, X, Save, Upload, Search
} from 'lucide-react';

interface GalleryImage {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  eventYear: number;
}

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const token = localStorage.getItem('adminToken');

  const [form, setForm] = useState({
    title: '', description: '', imageUrl: '', category: 'conference', eventYear: new Date().getFullYear()
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/gallery`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setImages(data.images);
    } catch {
      alert('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingImage(null);
    setForm({ title: '', description: '', imageUrl: '', category: 'conference', eventYear: new Date().getFullYear() });
    setShowModal(true);
  };

  const handleEdit = (img: GalleryImage) => {
    setEditingImage(img);
    setForm({ title: img.title, description: img.description, imageUrl: img.imageUrl, category: img.category, eventYear: img.eventYear });
    setShowModal(true);
  };

  const saveImage = async () => {
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    try {
      const url = editingImage 
        ? `${import.meta.env.VITE_API_URL}/admin/gallery/${editingImage._id}`
        : `${import.meta.env.VITE_API_URL}/admin/gallery`;
      const method = editingImage ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchImages();
      }
    } catch {
      alert('Save failed');
    }
  };

  const deleteImage = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchImages();
    } catch {
      alert('Delete failed');
    }
  };

  const filteredImages = images.filter(img => 
    img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    img.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/uploads')) return `${import.meta.env.VITE_API_URL.replace('/api', '')}${path}`;
    return path;
  };

  if (loading) return <div className="p-10 text-center font-cinzel">Loading Gallery...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-cinzel text-3xl text-[#001233] mb-1">Photo Gallery</h1>
          <p className="text-gray-400 text-sm">Manage event photos and gallery content</p>
        </div>
        <button onClick={handleCreate} className="flex items-center gap-2 px-6 py-3 bg-[#001233] text-white rounded-xl font-bold shadow-lg hover:bg-[#001a45] transition-all">
          <Plus size={20} />
          <span>Add New Photo</span>
        </button>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by title or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#D4A373] outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredImages.map((img) => (
          <motion.div key={img._id} whileHover={{ y: -5 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
            <div className="h-48 relative overflow-hidden">
              <img src={getImageUrl(img.imageUrl)} alt={img.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button onClick={() => handleEdit(img)} className="p-2 bg-white rounded-lg text-blue-600 shadow-xl hover:scale-11 transition-all"><Edit size={18} /></button>
                <button onClick={() => deleteImage(img._id)} className="p-2 bg-white rounded-lg text-red-600 shadow-xl hover:scale-11 transition-all"><Trash2 size={18} /></button>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="text-[10px] px-2 py-1 rounded bg-[#D4A373] text-white font-bold uppercase tracking-widest">{img.category}</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-cinzel text-sm text-[#001233] mb-1 line-clamp-1">{img.title}</h3>
              <p className="text-[10px] text-gray-400">{img.eventYear}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden">
              <div className="p-6 bg-[#001233] text-white flex justify-between items-center">
                <h2 className="font-cinzel text-xl">{editingImage ? 'Edit Photo' : 'Add New Photo'}</h2>
                <button onClick={() => setShowModal(false)}><X size={20} /></button>
              </div>
              
              <div className="p-8 space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Photo Title</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl outline-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                    <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl outline-none appearance-none">
                      <option value="conference">Conference</option>
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Year</label>
                    <input type="number" value={form.eventYear} onChange={(e) => setForm({...form, eventYear: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Image</label>
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={getImageUrl(form.imageUrl) || '/journal-placeholder.jpg'} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow space-y-2">
                      <input type="file" accept="image/*" id="gallery-img-upload" className="hidden" onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          const formData = new FormData();
                          formData.append('file', e.target.files[0]);
                          const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/upload`, {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${token}` },
                            body: formData
                          });
                          const data = await res.json();
                          if (data.success) setForm({...form, imageUrl: data.url});
                        }
                      }} />
                      <label htmlFor="gallery-img-upload" className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs cursor-pointer hover:bg-blue-100">
                        <Upload size={14} />
                        <span>Upload Photo</span>
                      </label>
                      <input type="text" value={form.imageUrl} onChange={(e) => setForm({...form, imageUrl: e.target.value})} className="block w-full text-[10px] bg-gray-50 p-2 rounded border-none outline-none" placeholder="Or paste URL" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl outline-none h-20 resize-none" />
                </div>
                
                <div className="pt-2 flex gap-3">
                  <button onClick={() => setShowModal(false)} className="flex-grow py-3 text-sm font-bold text-gray-400 hover:bg-gray-50 rounded-xl">Cancel</button>
                  <button onClick={saveImage} className="flex-grow py-3 bg-[#001233] text-white rounded-xl font-bold hover:bg-[#001a45] shadow-lg shadow-[#001233]/20 flex items-center justify-center gap-2">
                    <Save size={18} />
                    <span>Save Photo</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
