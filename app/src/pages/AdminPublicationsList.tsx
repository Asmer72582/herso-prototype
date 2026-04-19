import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Trash2, X, Save, Upload, Link as LinkIcon,
  Search, SlidersHorizontal
} from 'lucide-react';

interface Article {
  _id?: string;
  title: string;
  authors: string[];
  pdfUrl?: string;
}

interface Publication {
  _id: string;
  title: string;
  volume: string;
  issue: string;
  month: string;
  year: number;
  type: string;
  description: string;
  coverImage: string;
  isPublished: boolean;
  articles: Article[];
  createdAt?: string;
}

export default function AdminPublicationsList() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPub, setEditingPub] = useState<Publication | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  const [form, setForm] = useState({
    title: '', volume: '', issue: '', month: '', year: new Date().getFullYear(),
    type: 'online', description: '', coverImage: '', isPublished: true
  });

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/publications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setPublications(data.publications);
    } catch {
      alert('Failed to load publications');
    } finally {
      setLoading(false);
    }
  };

  const filteredPublications = publications
    .filter(pub => 
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.volume.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.issue.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Sort by Year desc, then Month desc, then createdAt desc
      if (b.year !== a.year) return b.year - a.year;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

  const handleCreate = () => {
    setEditingPub(null);
    setForm({
      title: '', volume: '', issue: '', month: '', year: new Date().getFullYear(),
      type: 'online', description: '', coverImage: '', pdfUrl: '', isPublished: true
    });
    setShowModal(true);
  };

  const handleEdit = (pub: Publication) => {
    setEditingPub(pub);
    setForm({
      title: pub.title, volume: pub.volume, issue: pub.issue, month: pub.month,
      year: pub.year, type: pub.type, description: pub.description,
      coverImage: pub.coverImage, isPublished: pub.isPublished
    });
    setShowModal(true);
  };

  const savePublication = async () => {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    try {
      const url = editingPub 
        ? `${import.meta.env.VITE_API_URL}/admin/publications/${editingPub._id}`
        : `${import.meta.env.VITE_API_URL}/admin/publications`;
      const method = editingPub ? 'PUT' : 'POST';
      
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchPublications();
      }
    } catch {
      alert('Save failed');
    }
  };

  const deletePublication = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/admin/publications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchPublications();
    } catch {
      alert('Delete failed');
    }
  };

  if (loading) return <div className="p-10 text-center font-cinzel">Loading Publications...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-cinzel text-3xl text-[#001233] mb-1">Publications</h1>
          <p className="text-gray-400 text-sm">Manage journal volumes and issues</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 bg-[#001233] text-white rounded-xl font-bold shadow-lg hover:bg-[#001a45] transition-all"
        >
          <Plus size={20} />
          <span>Add New Issue</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by title, volume or issue..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#D4A373] outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-400">
          <SlidersHorizontal size={18} />
          <span className="text-sm font-bold uppercase tracking-widest text-[10px]">Sorting: Newest First</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPublications.map((pub) => (
          <motion.div 
            key={pub._id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
          >
            <div className="h-40 bg-gray-100 relative group">
              <img 
                src={pub.coverImage?.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${pub.coverImage}` : (pub.coverImage || '/journal-placeholder.jpg')} 
                alt={pub.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button onClick={() => handleEdit(pub)} className="p-2 bg-white rounded-lg text-blue-600 shadow-xl hover:scale-110 transition-all"><Edit size={18} /></button>
                <button onClick={() => deletePublication(pub._id)} className="p-2 bg-white rounded-lg text-red-600 shadow-xl hover:scale-110 transition-all"><Trash2 size={18} /></button>
              </div>
              <div className="absolute top-3 left-3">
                <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest ${pub.isPublished ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {pub.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
            
            <div className="p-6 flex-grow flex flex-col">
              <div className="mb-4">
                <h3 className="font-cinzel text-lg text-[#001233] mb-1 line-clamp-1">{pub.title}</h3>
                <p className="text-xs text-gray-400 font-medium">{pub.volume}, {pub.issue} • {pub.month} {pub.year}</p>
              </div>
              
              <div className="mt-auto space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest border-t pt-4">
                  <span>Research Papers</span>
                  <span className="text-[#D4A373]">{pub.articles?.length || 0} Articles</span>
                </div>
                
                <button 
                  onClick={() => navigate(`/admin/publications/${pub._id}/papers`)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#D4A373]/10 text-[#001233] rounded-xl font-bold hover:bg-[#D4A373] transition-all group"
                >
                  <LinkIcon size={16} className="text-[#D4A373] group-hover:text-[#001233]" />
                  <span>Manage Issues Content</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal for Create/Edit */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden overflow-y-auto max-h-[90vh]"
            >
              <div className="p-6 bg-[#001233] text-white flex justify-between items-center">
                <h2 className="font-cinzel text-xl">{editingPub ? 'Edit Issue' : 'Add New Journal Issue'}</h2>
                <button onClick={() => setShowModal(false)}><X size={20} /></button>
              </div>
              
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Issue Title</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#D4A373] outline-none transition-all" placeholder="e.g. VOL-13 / Issue-2 / October 2025" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Volume</label>
                    <input type="text" value={form.volume} onChange={(e) => setForm({...form, volume: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl outline-none" placeholder="Vol. 13" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Issue</label>
                    <input type="text" value={form.issue} onChange={(e) => setForm({...form, issue: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl outline-none" placeholder="Issue 2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Month</label>
                    <input type="text" value={form.month} onChange={(e) => setForm({...form, month: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Year</label>
                    <input type="number" value={form.year} onChange={(e) => setForm({...form, year: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Issue Cover (Image)</label>
                  <div className="flex gap-4">
                    <div className="w-24 h-32 bg-gray-100 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                      <img src={form.coverImage || '/journal-placeholder.jpg'} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow space-y-3">
                      <input type="text" value={form.coverImage} onChange={(e) => setForm({...form, coverImage: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border-none rounded-lg text-[10px] outline-none" placeholder="Cover Image URL or path" />
                      <input type="file" accept="image/*" id="cover-img-upload" className="hidden" onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          const formData = new FormData();
                          formData.append('file', e.target.files[0]);
                          const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/upload`, {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${token}` },
                            body: formData
                          });
                          const data = await res.json();
                          if (data.success) setForm({...form, coverImage: data.url});
                        }
                      }} />
                      <label htmlFor="cover-img-upload" className="inline-flex items-center gap-2 px-4 py-2 bg-[#001233] text-white rounded-lg font-bold text-[10px] cursor-pointer hover:bg-[#001a45]">
                        <Upload size={12} />
                        <span>Choose Cover Image</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                  <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({...form, isPublished: e.target.checked})} className="w-5 h-5 accent-[#D4A373]" />
                  <span className="text-sm font-bold text-[#001233]">Publish to Website Immediately</span>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button onClick={() => setShowModal(false)} className="flex-grow py-4 text-sm font-bold text-gray-400 hover:bg-gray-50 rounded-2xl transition-all">Cancel</button>
                  <button onClick={savePublication} className="flex-grow py-4 bg-[#001233] text-white rounded-2xl font-bold shadow-xl shadow-[#001233]/20 hover:bg-[#001a45] transition-all flex items-center justify-center gap-2">
                    <Save size={18} />
                    <span>Save Issue</span>
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
