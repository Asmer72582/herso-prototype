import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Calendar } from 'lucide-react';
import Sidebar from '../components/Sidebar';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/announcements`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAnnouncements(data.announcements);
        }
      })
      .catch(() => {
        setAnnouncements([
          { _id: '1', title: 'JHERS October 2025 Issue Published', content: 'The latest issue of JHERS has been published. Access it online now.', category: 'journal', createdAt: '2025-10-01' },
          { _id: '2', title: 'JHERS April 2025 Issue Published', content: 'The April 2025 issue is now available for download.', category: 'journal', createdAt: '2025-04-01' },
          { _id: '3', title: 'International Conference 2025 - Call for Papers', content: 'Submit your research papers for the upcoming international conference.', category: 'event', createdAt: '2025-01-15' },
          { _id: '4', title: 'New Editorial Board Members Announced', content: 'We welcome new members to our editorial board for 2025-2026.', category: 'general', createdAt: '2025-01-10' },
        ]);
      });
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'journal': return 'bg-blue-100 text-blue-700';
      case 'event': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Bell className="text-[#D4A373]" size={28} />
            <h1 className="font-cinzel text-3xl text-[#001233]">Announcements</h1>
          </div>
          <div className="w-24 h-0.5 bg-[#D4A373] mb-8" />

          <div className="space-y-4">
            {announcements.map((ann, index) => (
              <motion.div
                key={ann._id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded capitalize ${getCategoryColor(ann.category)}`}>
                        {ann.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[#6C757D]">
                        <Calendar size={12} />
                        {new Date(ann.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-cinzel text-lg text-[#001233] mb-1">{ann.title}</h3>
                    <p className="text-sm text-[#6C757D]">{ann.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <div className="hidden lg:block">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
