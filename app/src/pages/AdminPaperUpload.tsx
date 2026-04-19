import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import mammoth from 'mammoth';
import { 
  ArrowLeft, Plus, Edit, Trash2, FileText, Upload, 
  Save, X, Download, User, Hash, AlignLeft, Loader2, CheckCircle2,
  FileCode, Globe, Cloud, FileStack
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
  articles: Article[];
}

export default function AdminPaperUpload() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importing, setImporting] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const [paperForm, setPaperForm] = useState<Article>({
    title: '',
    authors: [''],
    abstract: '',
    pdfUrl: '',
    pages: ''
  });

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchPublication();
  }, [id, token, navigate]);

  const fetchPublication = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/publications/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPublication(data.publication);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setPaperForm(prev => ({ ...prev, pdfUrl: data.url }));
        return data.url;
      }
    } catch {
      alert('Upload failed');
    }
    return null;
  };

  const handleDocxImport = async (file: File) => {
    setImporting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const fullText = result.value;
      const lines = fullText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      if (lines.length === 0) throw new Error("Document is empty");

      // Heuristic Parsing
      const title = lines[0] || "Untitled Word Document";
      let authors = ["Unknown Author"];
      let abstract = "";
      
      // Look for authors (heuristic)
      if (lines.length > 1) {
        const authorLine = lines.find(l => l.toLowerCase().includes('by ') || l.toLowerCase().includes('authors:')) || lines[1];
        authors = authorLine.replace(/by |authors:/gi, '').split(/,| and /).map(a => a.trim());
      }
      
      // Look for Abstract
      const abstractIdx = lines.findIndex(l => l.toLowerCase().startsWith('abstract'));
      if (abstractIdx !== -1 && lines.length > abstractIdx + 1) {
        abstract = lines.slice(abstractIdx + 1, abstractIdx + 4).join(' ');
      }

      // First, we need to upload the actual document to the server to get a URL
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/admin/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const uploadData = await uploadRes.json();
      const pdfUrl = uploadData.success ? uploadData.url : '';

      if (publication) {
        const newArticles = [...publication.articles, { 
          title, 
          authors, 
          abstract: abstract.substring(0, 500) + (abstract.length > 500 ? "..." : ""),
          pdfUrl,
          pages: ""
        }];
        setPublication({ ...publication, articles: newArticles });
        alert(`Successfully imported Word document: ${title}`);
      }
      setShowImportModal(false);
    } catch (err: any) {
      alert(err.message || "Failed to parse Word document.");
    } finally {
      setImporting(false);
    }
  };

  const openAddModal = () => {
    setPaperForm({ title: '', authors: [''], abstract: '', pdfUrl: '', pages: '' });
    setEditingIndex(null);
    setShowModal(true);
  };

  const openEditModal = (idx: number) => {
    if (!publication) return;
    setPaperForm({ ...publication.articles[idx] });
    setEditingIndex(idx);
    setShowModal(true);
  };

  const savePaperToLocal = () => {
    if (!publication) return;
    const newArticles = [...publication.articles];
    if (editingIndex !== null) {
      newArticles[editingIndex] = paperForm;
    } else {
      newArticles.push(paperForm);
    }
    setPublication({ ...publication, articles: newArticles });
    setShowModal(false);
  };

  const deletePaperLocal = (idx: number) => {
    if (!publication || !confirm('Are you sure you want to delete this paper?')) return;
    const newArticles = [...publication.articles];
    newArticles.splice(idx, 1);
    setPublication({ ...publication, articles: newArticles });
  };

  const persistChanges = async () => {
    if (!publication) return;
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/publications/${publication._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ articles: publication.articles })
      });
      const data = await res.json();
      if (data.success) {
        alert('Changes saved successfully!');
      } else {
        alert('Failed to save changes');
      }
    } catch {
      alert('Network error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#FDF6E3]">
      <div className="w-12 h-12 border-4 border-[#D4A373] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="font-cinzel text-[#001233] animate-pulse">Loading Issue Data...</p>
    </div>
  );

  if (!publication) return <div className="p-10 text-center">Publication not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/admin/publications')}
            className="flex items-center gap-2 text-[#D4A373] hover:text-[#001233] transition-colors text-sm group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Publications
          </button>
          <div>
            <h1 className="font-cinzel text-3xl text-[#001233] mb-1">{publication.title}</h1>
            <p className="text-[#6C757D] flex items-center gap-4 text-sm font-medium">
              <span className="flex items-center gap-1.5"><FileText size={14} className="text-[#D4A373]" /> {publication.volume}, {publication.issue}</span>
              <span className="flex items-center gap-1.5"><X size={14} className="text-gray-300" /> {publication.articles.length} Research Papers</span>
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <input 
            type="file" 
            id="word-import" 
            accept=".docx" 
            className="hidden" 
            onChange={(e) => e.target.files?.[0] && handleDocxImport(e.target.files[0])}
          />
          <label
            htmlFor="word-import"
            className={`flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 border border-blue-100 rounded-lg font-bold shadow-sm hover:bg-blue-50 transition-all cursor-pointer ${importing ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {importing ? <Loader2 size={18} className="animate-spin" /> : <FileStack size={18} />}
            <span>{importing ? 'Importing...' : 'Import Word File'}</span>
          </label>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#D4A373] text-[#001233] rounded-lg font-bold shadow-lg hover:bg-[#c49363] transition-all"
          >
            <Plus size={18} />
            <span>Add New Paper</span>
          </button>
          <button
            onClick={persistChanges}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#001233] text-[#FDF6E3] rounded-lg font-bold shadow-lg hover:bg-[#001a45] disabled:opacity-50 transition-all"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Modern Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#001233] text-[#FDF6E3]">
                <th className="px-6 py-5 text-left text-xs font-cinzel uppercase tracking-widest">#</th>
                <th className="px-6 py-5 text-left text-xs font-cinzel uppercase tracking-widest">Title & Authors</th>
                <th className="px-6 py-5 text-center text-xs font-cinzel uppercase tracking-widest">Pages</th>
                <th className="px-6 py-5 text-center text-xs font-cinzel uppercase tracking-widest">PDF</th>
                <th className="px-6 py-5 text-right text-xs font-cinzel uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {publication.articles.length > 0 ? (
                publication.articles.map((article, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-5">
                      <span className="text-xs font-bold text-gray-400">0{idx + 1}</span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[#001233] font-bold text-sm mb-1.5 line-clamp-1">{article.title}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {article.authors.map((author, aIdx) => (
                          <span key={aIdx} className="text-[10px] bg-[#D4A373]/10 text-[#001233] px-2 py-0.5 rounded-full font-medium border border-[#D4A373]/20 italic">
                            {author}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-xs font-bold text-[#6C757D] bg-gray-100 px-3 py-1 rounded-md">
                        {article.pages || '--'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      {article.pdfUrl ? (
                        <a 
                          href={article.pdfUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          title="View PDF"
                        >
                          <Download size={14} />
                        </a>
                      ) : (
                        <span className="text-[10px] text-gray-300 italic">None</span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(idx)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                          title="Edit Paper"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => deletePaperLocal(idx)}
                          className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                          title="Delete Paper"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="max-w-sm mx-auto">
                      <FileText size={48} className="mx-auto text-gray-100 mb-4" />
                      <p className="font-cinzel text-lg text-[#001233] mb-2">Issue is empty</p>
                      <p className="text-sm text-[#6C757D] mb-6">Start by adding the first research paper to this publication issue.</p>
                      <button 
                        onClick={openAddModal}
                        className="text-[#D4A373] font-bold hover:underline"
                      >
                        Click here to create a paper
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-[#001233]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-6 bg-[#001233] flex items-center justify-between text-[#FDF6E3]">
                <h2 className="font-cinzel text-xl flex items-center gap-3">
                  {editingIndex !== null ? <Edit size={24} className="text-[#D4A373]" /> : <Plus size={24} className="text-[#D4A373]" />}
                  {editingIndex !== null ? 'Edit Research Paper' : 'Add New Research Paper'}
                </h2>
                <button onClick={() => setShowModal(false)} className="hover:rotate-90 transition-transform">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {/* Title */}
                <div className="group">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#6C757D] uppercase mb-2 group-focus-within:text-[#D4A373]">
                    <AlignLeft size={14} /> Paper Title *
                  </label>
                  <textarea 
                    value={paperForm.title}
                    onChange={(e) => setPaperForm({ ...paperForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#D4A373]/20 focus:border-[#D4A373] outline-none transition-all resize-none min-h-[80px]"
                    placeholder="Enter full research paper title..."
                  />
                </div>

                {/* Authors */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-[#6C757D] uppercase mb-3">
                    <User size={14} /> Authors
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {paperForm.authors.map((author, aIdx) => (
                      <div key={aIdx} className="relative group">
                        <input 
                          type="text"
                          value={author}
                          onChange={(e) => {
                            const newAuthors = [...paperForm.authors];
                            newAuthors[aIdx] = e.target.value;
                            setPaperForm({ ...paperForm, authors: newAuthors });
                          }}
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:bg-white focus:border-[#D4A373] outline-none transition-all pr-10"
                          placeholder={`Author ${aIdx + 1}`}
                        />
                        {paperForm.authors.length > 1 && (
                          <button 
                            onClick={() => {
                              const newAuthors = [...paperForm.authors];
                              newAuthors.splice(aIdx, 1);
                              setPaperForm({ ...paperForm, authors: newAuthors });
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button 
                      onClick={() => setPaperForm({ ...paperForm, authors: [...paperForm.authors, ''] })}
                      className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-100 rounded-lg text-xs font-bold text-[#D4A373] hover:bg-gray-50 hover:border-[#D4A373] transition-all"
                    >
                      <Plus size={14} /> Add Author
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Pages */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-[#6C757D] uppercase mb-2">
                      <Hash size={14} /> Page Range
                    </label>
                    <input 
                      type="text"
                      value={paperForm.pages}
                      onChange={(e) => setPaperForm({ ...paperForm, pages: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#D4A373]"
                      placeholder="e.g. 156-172"
                    />
                  </div>

                  {/* PDF Upload */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-[#6C757D] uppercase mb-2">
                      <Upload size={14} /> Research PDF (Full Paper)
                    </label>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept=".pdf" 
                        id="modal-pdf-upload"
                        className="hidden" 
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                      />
                      <label 
                        htmlFor="modal-pdf-upload"
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed rounded-xl text-sm font-medium cursor-pointer transition-all ${
                          paperForm.pdfUrl 
                          ? 'bg-green-50 border-green-200 text-green-700' 
                          : 'border-gray-200 text-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {paperForm.pdfUrl ? <CheckCircle2 size={16} /> : <Upload size={16} />}
                        {paperForm.pdfUrl ? 'Paper Uploaded' : 'Select PDF File'}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Abstract */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-[#6C757D] uppercase mb-2">
                    <AlignLeft size={14} /> Abstract (Optional)
                  </label>
                  <textarea 
                    value={paperForm.abstract}
                    onChange={(e) => setPaperForm({ ...paperForm, abstract: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#D4A373] outline-none transition-all min-h-[120px]"
                    placeholder="Enter a brief summary of the research paper..."
                  />
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 text-sm font-bold text-[#6C757D] hover:text-[#001233] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={savePaperToLocal}
                  disabled={!paperForm.title}
                  className="px-8 py-2.5 bg-[#001233] text-[#FDF6E3] rounded-xl text-sm font-bold shadow-lg hover:bg-[#001a45] transition-all disabled:opacity-50"
                >
                  Confirm Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D4A373;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
