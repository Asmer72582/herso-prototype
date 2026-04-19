import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Download, FileText, ArrowLeft, User } from 'lucide-react';

interface Article {
  _id: string;
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
  description: string;
  coverImage: string;
  pdfUrl?: string;
  articles: Article[];
}

export default function IssueDetail() {
  const { id } = useParams();
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/publications/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPublication(data.publication);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;
  if (!publication) return <div className="min-h-[60vh] flex items-center justify-center">Issue not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Link to="/jhers" className="flex items-center gap-2 text-[#D4A373] hover:text-[#001233] transition-colors mb-6 text-sm">
        <ArrowLeft size={16} />
        Back to Online Journal
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <img 
            src={publication.coverImage.startsWith('http') || publication.coverImage.startsWith('/uploads') ? (publication.coverImage.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${publication.coverImage}` : publication.coverImage) : '/journal-cover-1.jpg'} 
            alt={publication.title} 
            className="w-full rounded-lg shadow-lg border border-gray-100"
          />
          <div className="mt-6 bg-[#001233] p-5 rounded-lg text-[#FDF6E3]">
            <h2 className="font-cinzel text-lg text-[#D4A373] mb-3">Issue Information</h2>
            <div className="space-y-4 text-sm">
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-[#FDF6E3]/60">Volume:</span>
                  <span>{publication.volume}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-[#FDF6E3]/60">Issue:</span>
                  <span>{publication.issue}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-[#FDF6E3]/60">Date:</span>
                  <span>{publication.month} {publication.year}</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-cinzel text-3xl text-[#001233] mb-4">{publication.title}</h1>
          <p className="text-[#6C757D] mb-8 leading-relaxed">{publication.description}</p>

          <h3 className="font-cinzel text-xl text-[#001233] mb-6 flex items-center gap-2">
            <FileText className="text-[#D4A373]" />
            Table of Contents
          </h3>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#001233] text-[#FDF6E3]">
                    <th className="px-6 py-4 text-left font-cinzel text-sm">Research Paper Title & Authors</th>
                    <th className="px-4 py-4 text-center font-cinzel text-sm">Pages</th>
                    <th className="px-4 py-4 text-center font-cinzel text-sm">Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {publication.articles && publication.articles.length > 0 ? (
                    publication.articles.map((article, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-[#001233] font-medium mb-1">{article.title}</p>
                          <div className="flex flex-wrap gap-2">
                            {article.authors.map((author, aIdx) => (
                              <span key={aIdx} className="inline-flex items-center gap-1 text-[11px] bg-gray-100 px-2 py-0.5 rounded text-[#6C757D]">
                                <User size={10} />
                                {author}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center text-sm text-[#6C757D]">
                          {article.pages || '--'}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {article.pdfUrl ? (
                            <a 
                              href={article.pdfUrl.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${article.pdfUrl}` : article.pdfUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center p-2 text-[#D4A373] hover:text-[#001233] hover:bg-[#D4A373]/10 rounded-full transition-all"
                              title="Download PDF"
                            >
                              <Download size={18} />
                            </a>
                          ) : (
                            <span className="text-[10px] text-gray-400 italic">Not available</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center text-gray-500 italic">
                        No papers uploaded for this issue yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
