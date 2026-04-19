import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, Bell, Image, MessageSquare,
  Plus, Edit, Trash2, X, Save, BarChart3, Upload,
  UserPlus
} from 'lucide-react';

interface Article {
  _id?: string;
  title: string;
  authors: string[];
  abstract?: string;
  pdfUrl?: string;
  pages?: string;
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
  createdAt: string;
}

interface Announcement {
  _id: string;
  title: string;
  content: string;
  category: string;
  isActive: boolean;
  createdAt: string;
}

interface Stats {
  totalPublications: number;
  totalAnnouncements: number;
  totalGalleryImages: number;
  totalMessages: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [publications, setPublications] = useState<Publication[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [showPubModal, setShowPubModal] = useState(false);
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [editingPub, setEditingPub] = useState<Publication | null>(null);
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
  const [pubForm, setPubForm] = useState<{
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
  }>({
    title: '', volume: '', issue: '', month: '', year: new Date().getFullYear(),
    type: 'online', description: '', coverImage: '', isPublished: true, articles: []
  });
  const [annForm, setAnnForm] = useState({ title: '', content: '', category: 'general', isActive: true });

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [token, navigate]);

  const fetchData = async () => {
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const [pubsRes, annsRes, statsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/publications`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL}/announcements`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL}/admin/stats`, { headers })
      ]);
      const pubsData = await pubsRes.json();
      const annsData = await annsRes.json();
      const statsData = await statsRes.json();
      if (pubsData.success) setPublications(pubsData.publications);
      if (annsData.success) setAnnouncements(annsData.announcements);
      if (statsData.success) setStats(statsData.stats);
    } catch {
      setPublications([]);
      setAnnouncements([
        { _id: '1', title: 'JHERS October 2025 Published', content: 'Latest issue published', category: 'journal', isActive: true, createdAt: '2025-10-01' },
      ]);
      setStats({ totalPublications: 5, totalAnnouncements: 4, totalGalleryImages: 3, totalMessages: 0 });
    }
  };

  const handleFileUpload = async (file: File, isPdf = false) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const endpoint = isPdf ? '/admin/upload-pdf' : '/admin/upload';
      const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) return data.url;
      throw new Error(data.error);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('File upload failed: ' + error.message);
      return null;
    }
  };

  const savePublication = async () => {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    try {
      if (editingPub) {
        await fetch(`${import.meta.env.VITE_API_URL}/admin/publications/${editingPub._id}`, { method: 'PUT', headers, body: JSON.stringify(pubForm) });
      } else {
        await fetch(`${import.meta.env.VITE_API_URL}/admin/publications`, { method: 'POST', headers, body: JSON.stringify(pubForm) });
      }
      setShowPubModal(false);
      setEditingPub(null);
      setPubForm({
        title: '', volume: '', issue: '', month: '', year: new Date().getFullYear(),
        type: 'online', description: '', coverImage: '', isPublished: true, articles: []
      });
      fetchData();
    } catch {
      alert('Failed to save publication');
    }
  };

  const deletePublication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/admin/publications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch {
      alert('Failed to delete publication');
    }
  };

  const editPublication = (pub: Publication) => {
    setEditingPub(pub);
    setPubForm({
      title: pub.title,
      volume: pub.volume,
      issue: pub.issue,
      month: pub.month,
      year: pub.year,
      type: pub.type,
      description: pub.description,
      coverImage: pub.coverImage,
      isPublished: pub.isPublished,
      articles: pub.articles || []
    });
    setShowPubModal(true);
  };

  const saveAnnouncement = async () => {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    try {
      if (editingAnn) {
        await fetch(`${import.meta.env.VITE_API_URL}/admin/announcements/${editingAnn._id}`, { method: 'PUT', headers, body: JSON.stringify(annForm) });
      } else {
        await fetch(`${import.meta.env.VITE_API_URL}/admin/announcements`, { method: 'POST', headers, body: JSON.stringify(annForm) });
      }
      setShowAnnModal(false);
      setEditingAnn(null);
      setAnnForm({ title: '', content: '', category: 'general', isActive: true });
      fetchData();
    } catch {
      alert('Failed to save announcement');
    }
  };

  const deleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/admin/announcements/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      fetchData();
    } catch {
      alert('Failed to delete announcement');
    }
  };

  const editAnnouncement = (ann: Announcement) => {
    setEditingAnn(ann);
    setAnnForm({
      title: ann.title,
      content: ann.content,
      category: ann.category,
      isActive: ann.isActive
    });
    setShowAnnModal(true);
  };

  return (
    <div className="p-6 h-full">
      <main className="flex-grow">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="font-cinzel text-2xl text-[#001233] mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Publications', value: stats?.totalPublications || 0, icon: BookOpen, color: 'bg-blue-500' },
                { label: 'Announcements', value: stats?.totalAnnouncements || 0, icon: Bell, color: 'bg-green-500' },
                { label: 'Gallery Images', value: stats?.totalGalleryImages || 0, icon: Image, color: 'bg-purple-500' },
                { label: 'Messages', value: stats?.totalMessages || 0, icon: MessageSquare, color: 'bg-orange-500' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#6C757D]">{stat.label}</p>
                      <p className="font-cinzel text-2xl text-[#001233] mt-1">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} text-white p-3 rounded-lg`}>
                      <stat.icon size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
                <h2 className="font-cinzel text-lg text-[#001233] mb-4">Recent Publications</h2>
                <div className="space-y-3">
                  {publications.slice(0, 5).map((pub) => (
                    <div key={pub._id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <BookOpen size={16} className="text-[#D4A373]" />
                      <div className="flex-grow">
                        <p className="text-sm text-[#001233] font-medium">{pub.title}</p>
                        <p className="text-xs text-[#6C757D]">{pub.volume}, {pub.issue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
                <h2 className="font-cinzel text-lg text-[#001233] mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => { setActiveTab('publications'); }}
                    className="w-full flex items-center gap-3 p-3 bg-[#001233]/5 rounded hover:bg-[#001233]/10 transition-colors text-left"
                  >
                    <Plus size={16} className="text-[#D4A373]" />
                    <span className="text-sm text-[#001233]">Add New Publication</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('announcements'); }}
                    className="w-full flex items-center gap-3 p-3 bg-[#001233]/5 rounded hover:bg-[#001233]/10 transition-colors text-left"
                  >
                    <Plus size={16} className="text-[#D4A373]" />
                    <span className="text-sm text-[#001233]">Add New Announcement</span>
                  </button>
                  <button
                    onClick={() => window.open('/', '_blank')}
                    className="w-full flex items-center gap-3 p-3 bg-[#001233]/5 rounded hover:bg-[#001233]/10 transition-colors text-left"
                  >
                    <BarChart3 size={16} className="text-[#D4A373]" />
                    <span className="text-sm text-[#001233]">View Website</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Publications Tab */}
        {activeTab === 'publications' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-cinzel text-2xl text-[#001233]">Publications</h1>
              <button
                onClick={() => {
                  setEditingPub(null);
                  setPubForm({
                    title: '', volume: '', issue: '', month: '', year: new Date().getFullYear(),
                    type: 'online', description: '', coverImage: '', isPublished: true, articles: []
                  });
                  setShowPubModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#001233] text-[#FDF6E3] rounded text-sm hover:bg-[#001a45] transition-colors"
              >
                <Plus size={16} />
                <span>Add Publication</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#001233] text-[#FDF6E3]">
                      <th className="px-4 py-3 text-left text-sm font-cinzel">Title</th>
                      <th className="px-4 py-3 text-left text-sm font-cinzel">Volume</th>
                      <th className="px-4 py-3 text-left text-sm font-cinzel">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-cinzel">Year</th>
                      <th className="px-4 py-3 text-left text-sm font-cinzel">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-cinzel">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publications.map((pub) => (
                      <tr key={pub._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => navigate(`/admin/publications/${pub._id}/papers`)}
                            className="text-[#001233] font-bold hover:text-[#D4A373] transition-colors text-left"
                          >
                            {pub.title}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#6C757D]">{pub.volume}, {pub.issue}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded capitalize ${pub.type === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                            {pub.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#6C757D]">{pub.year}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded ${pub.isPublished ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {pub.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => editPublication(pub)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                              <Edit size={14} />
                            </button>
                            <button onClick={() => deletePublication(pub._id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-cinzel text-2xl text-[#001233]">Announcements</h1>
              <button
                onClick={() => {
                  setEditingAnn(null);
                  setAnnForm({ title: '', content: '', category: 'general', isActive: true });
                  setShowAnnModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#001233] text-[#FDF6E3] rounded text-sm hover:bg-[#001a45] transition-colors"
              >
                <Plus size={16} />
                <span>Add Announcement</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#001233] text-[#FDF6E3]">
                      <th className="px-4 py-3 text-left text-sm font-cinzel">Title</th>
                      <th className="px-4 py-3 text-left text-sm font-cinzel">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-cinzel">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-cinzel">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {announcements.map((ann) => (
                      <tr key={ann._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-[#001233]">{ann.title}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded capitalize ${ann.category === 'journal' ? 'bg-blue-100 text-blue-700' : ann.category === 'event' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {ann.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded ${ann.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {ann.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => editAnnouncement(ann)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                              <Edit size={14} />
                            </button>
                            <button onClick={() => deleteAnnouncement(ann._id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Publication Modal */}
      {showPubModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-cinzel text-lg text-[#001233]">{editingPub ? 'Edit' : 'Add'} Publication</h2>
              <button onClick={() => setShowPubModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={18} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-[#6C757D] mb-1">Title *</label>
                <input type="text" value={pubForm.title} onChange={(e) => setPubForm({ ...pubForm, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#D4A373]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#6C757D] mb-1">Volume</label>
                  <input type="text" value={pubForm.volume} onChange={(e) => setPubForm({ ...pubForm, volume: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#D4A373]" />
                </div>
                <div>
                  <label className="block text-sm text-[#6C757D] mb-1">Issue</label>
                  <input type="text" value={pubForm.issue} onChange={(e) => setPubForm({ ...pubForm, issue: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#D4A373]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#6C757D] mb-1">Month</label>
                  <input type="text" value={pubForm.month} onChange={(e) => setPubForm({ ...pubForm, month: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#D4A373]" />
                </div>
                <div>
                  <label className="block text-sm text-[#6C757D] mb-1">Year</label>
                  <input type="number" value={pubForm.year} onChange={(e) => setPubForm({ ...pubForm, year: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#D4A373]" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#6C757D] mb-1">Type</label>
                <select value={pubForm.type} onChange={(e) => setPubForm({ ...pubForm, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#D4A373]">
                  <option value="online">Online</option>
                  <option value="print">Print</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#6C757D] mb-1">Description</label>
                <textarea value={pubForm.description} onChange={(e) => setPubForm({ ...pubForm, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#D4A373]" />
              </div>
              <div>
                <label className="block text-sm text-[#6C757D] mb-1">Cover Image</label>
                <div className="flex gap-2">
                  <input type="text" value={pubForm.coverImage} onChange={(e) => setPubForm({ ...pubForm, coverImage: e.target.value })} className="flex-grow px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#D4A373]" placeholder="/journal-cover-1.jpg" />
                  <input type="file" accept="image/*" onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      const url = await handleFileUpload(e.target.files[0]);
                      if (url) setPubForm({ ...pubForm, coverImage: url });
                    }
                  }} className="hidden" id="cover-upload" />
                  <label htmlFor="cover-upload" className="px-3 py-2 bg-gray-100 text-[#001233] rounded text-sm cursor-pointer hover:bg-gray-200 flex items-center gap-2">
                    <Upload size={14} />
                    <span>Upload</span>
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={pubForm.isPublished} onChange={(e) => setPubForm({ ...pubForm, isPublished: e.target.checked })} className="rounded" />
                <label className="text-sm text-[#6C757D]">Published</label>
              </div>

              {/* Articles Management Section */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-cinzel text-md text-[#001233]">Research Papers / Articles</h3>
                  <button
                    type="button"
                    onClick={() => setPubForm({
                      ...pubForm,
                      articles: [...pubForm.articles, { title: '', authors: [''], abstract: '', pages: '' }]
                    })}
                    className="flex items-center gap-1 text-xs px-2 py-1 bg-green-50 text-green-700 rounded border border-green-200 hover:bg-green-100"
                  >
                    <Plus size={14} />
                    <span>Add Paper</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {pubForm.articles.map((article, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-[#001233]">Paper #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newArticles = [...pubForm.articles];
                            newArticles.splice(idx, 1);
                            setPubForm({ ...pubForm, articles: newArticles });
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <input
                        type="text"
                        placeholder="Article Title"
                        value={article.title}
                        onChange={(e) => {
                          const newArticles = [...pubForm.articles];
                          newArticles[idx].title = e.target.value;
                          setPubForm({ ...pubForm, articles: newArticles });
                        }}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#D4A373]"
                      />

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500">Authors</label>
                        {article.authors.map((author, aIdx) => (
                          <div key={aIdx} className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Author Name"
                              value={author}
                              onChange={(e) => {
                                const newArticles = [...pubForm.articles];
                                newArticles[idx].authors[aIdx] = e.target.value;
                                setPubForm({ ...pubForm, articles: newArticles });
                              }}
                              className="flex-grow px-2 py-1 border border-gray-300 rounded text-xs"
                            />
                            {article.authors.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newArticles = [...pubForm.articles];
                                  newArticles[idx].authors.splice(aIdx, 1);
                                  setPubForm({ ...pubForm, articles: newArticles });
                                }}
                                className="text-red-400 hover:text-red-600"
                              >
                                <X size={12} />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newArticles = [...pubForm.articles];
                            newArticles[idx].authors.push('');
                            setPubForm({ ...pubForm, articles: newArticles });
                          }}
                          className="text-[10px] text-blue-600 flex items-center gap-1 mt-1"
                        >
                          <UserPlus size={10} /> Add Author
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-500">Page Range</label>
                          <input
                            type="text"
                            placeholder="e.g. 15-25"
                            value={article.pages}
                            onChange={(e) => {
                              const newArticles = [...pubForm.articles];
                              newArticles[idx].pages = e.target.value;
                              setPubForm({ ...pubForm, articles: newArticles });
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-500">PDF Upload</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={async (e) => {
                                if (e.target.files?.[0]) {
                                  const url = await handleFileUpload(e.target.files[0], true);
                                  if (url) {
                                    const newArticles = [...pubForm.articles];
                                    newArticles[idx].pdfUrl = url;
                                    setPubForm({ ...pubForm, articles: newArticles });
                                  }
                                }
                              }}
                              className="hidden"
                              id={`pdf-upload-${idx}`}
                            />
                            <label
                              htmlFor={`pdf-upload-${idx}`}
                              className="flex-grow flex items-center justify-center gap-2 px-2 py-1 border border-dashed border-gray-400 rounded text-[10px] cursor-pointer hover:bg-gray-100"
                            >
                              <Upload size={10} />
                              {article.pdfUrl ? 'Replace PDF' : 'Upload PDF'}
                            </label>
                            {article.pdfUrl && (
                              <span className="text-[10px] text-green-600 font-bold">✓</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t">
              <button onClick={() => setShowPubModal(false)} className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={savePublication} className="flex items-center gap-2 px-4 py-2 bg-[#001233] text-[#FDF6E3] rounded text-sm hover:bg-[#001a45]">
                <Save size={14} />
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Announcement Modal */}
      {showAnnModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-lg w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-cinzel text-lg text-[#001233]">{editingAnn ? 'Edit' : 'Add'} Announcement</h2>
              <button onClick={() => setShowAnnModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={18} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-[#6C757D] mb-1">Title *</label>
                <input type="text" value={annForm.title} onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#D4A373]" />
              </div>
              <div>
                <label className="block text-sm text-[#6C757D] mb-1">Content</label>
                <textarea value={annForm.content} onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#D4A373]" />
              </div>
              <div>
                <label className="block text-sm text-[#6C757D] mb-1">Category</label>
                <select value={annForm.category} onChange={(e) => setAnnForm({ ...annForm, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#D4A373]">
                  <option value="general">General</option>
                  <option value="journal">Journal</option>
                  <option value="event">Event</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={annForm.isActive} onChange={(e) => setAnnForm({ ...annForm, isActive: e.target.checked })} className="rounded" />
                <label className="text-sm text-[#6C757D]">Active</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t">
              <button onClick={() => setShowAnnModal(false)} className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={saveAnnouncement} className="flex items-center gap-2 px-4 py-2 bg-[#001233] text-[#FDF6E3] rounded text-sm hover:bg-[#001a45]">
                <Save size={14} />
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
}
