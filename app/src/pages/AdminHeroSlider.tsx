import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Trash2, X, Save, Upload, GripVertical, ChevronUp, ChevronDown
} from 'lucide-react';

interface HeroSlide {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  order: number;
}

export default function AdminHeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('adminToken');

  const [form, setForm] = useState({
    title: '', subtitle: '', image: '', order: 0
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/hero`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setSlides(data.slides);
    } catch {
      alert('Failed to load slides');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingSlide(null);
    setForm({ title: '', subtitle: '', image: '', order: slides.length });
    setShowModal(true);
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setForm({ title: slide.title, subtitle: slide.subtitle, image: slide.image, order: slide.order });
    setShowModal(true);
  };

  const saveSlide = async () => {
    setSaving(true);
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    try {
      const url = editingSlide 
        ? `${import.meta.env.VITE_API_URL}/admin/hero/${editingSlide._id}`
        : `${import.meta.env.VITE_API_URL}/admin/hero`;
      const method = editingSlide ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchSlides();
      }
    } catch {
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const deleteSlide = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/admin/hero/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchSlides();
    } catch {
      alert('Delete failed');
    }
  };

  const moveSlide = async (id: string, direction: 'up' | 'down') => {
    const index = slides.findIndex(s => s._id === id);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === slides.length - 1) return;

    const newSlides = [...slides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];

    // Update orders
    const updatedWithOrder = newSlides.map((s, i) => ({ ...s, order: i }));
    setSlides(updatedWithOrder);

    // Save all orders to backend
    await Promise.all(updatedWithOrder.map(s => 
      fetch(`${import.meta.env.VITE_API_URL}/admin/hero/${s._id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: s.order })
      })
    ));
  };

  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/uploads')) return `${import.meta.env.VITE_API_URL.replace('/api', '')}${path}`;
    return path;
  };

  if (loading) return <div className="p-10 text-center font-cinzel">Loading Hero Slider...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-cinzel text-3xl text-[#001233] mb-1">Hero Slider</h1>
          <p className="text-gray-400 text-sm">Manage the dynamic hero slides on the homepage</p>
        </div>
        <button onClick={handleCreate} className="flex items-center gap-2 px-6 py-3 bg-[#001233] text-white rounded-xl font-bold shadow-lg hover:bg-[#001a45] transition-all">
          <Plus size={20} />
          <span>Add New Slide</span>
        </button>
      </div>

      <div className="space-y-4">
        {slides.map((slide, idx) => (
          <div key={slide._id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-6 group">
            <div className="flex flex-col gap-1">
              <button onClick={() => moveSlide(slide._id, 'up')} disabled={idx === 0} className="p-1 text-gray-300 hover:text-[#D4A373] disabled:opacity-30"><ChevronUp size={20} /></button>
              <button onClick={() => moveSlide(slide._id, 'down')} disabled={idx === slides.length - 1} className="p-1 text-gray-300 hover:text-[#D4A373] disabled:opacity-30"><ChevronDown size={20} /></button>
            </div>
            
            <div className="w-32 h-20 bg-gray-100 rounded-xl overflow-hidden border border-gray-50 flex-shrink-0">
              <img src={getImageUrl(slide.image)} alt={slide.title} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-grow">
              <h3 className="text-sm font-bold text-[#001233]">{slide.title}</h3>
              <p className="text-xs text-gray-400 line-clamp-1">{slide.subtitle}</p>
            </div>
            
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(slide)} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all"><Edit size={18} /></button>
              <button onClick={() => deleteSlide(slide._id)} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}

        {slides.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed text-gray-400">
            No slides found. Add your first hero slide to get started.
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden">
              <div className="p-6 bg-[#001233] text-white flex justify-between items-center">
                <h2 className="font-cinzel text-xl">{editingSlide ? 'Edit Hero Slide' : 'Add New Slide'}</h2>
                <button onClick={() => setShowModal(false)}><X size={20} /></button>
              </div>
              
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Slide Title</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl outline-none" placeholder="e.g. International Conference 2023" />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Subtitle</label>
                  <input type="text" value={form.subtitle} onChange={(e) => setForm({...form, subtitle: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl outline-none" placeholder="e.g. Advancing Global Education" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Slide Background Image</label>
                  <div className="flex gap-4">
                    <div className="w-24 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={getImageUrl(form.image) || '/journal-placeholder.jpg'} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow space-y-2">
                      <input type="file" accept="image/*" id="hero-img-upload" className="hidden" onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          const formData = new FormData();
                          formData.append('file', e.target.files[0]);
                          const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/upload`, {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${token}` },
                            body: formData
                          });
                          const data = await res.json();
                          if (data.success) setForm({...form, image: data.url});
                        }
                      }} />
                      <label htmlFor="hero-img-upload" className="inline-flex items-center gap-2 px-5 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs cursor-pointer hover:bg-blue-100 transition-all">
                        <Upload size={14} />
                        <span>Upload Background</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button onClick={() => setShowModal(false)} className="flex-grow py-4 text-sm font-bold text-gray-400 hover:bg-gray-50 rounded-2xl transition-all">Cancel</button>
                  <button onClick={saveSlide} disabled={saving} className="flex-grow py-4 bg-[#001233] text-white rounded-2xl font-bold shadow-xl shadow-[#001233]/20 hover:bg-[#001a45] transition-all flex items-center justify-center gap-2">
                    {saving ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                    <span>{editingSlide ? 'Update Slide' : 'Create Slide'}</span>
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
