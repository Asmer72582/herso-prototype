import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Camera, Bell, MessageSquare, Shield } from 'lucide-react';

interface Announcement {
  _id: string;
  title: string;
}

export default function Sidebar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/announcements`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAnnouncements(data.announcements.slice(0, 5));
        }
      })
      .catch(() => {
        // Fallback data if API is not available
        setAnnouncements([
          { _id: '1', title: 'JHERS October 2025 Issue Published' },
          { _id: '2', title: 'JHERS April 2025 Issue Published' },
          { _id: '3', title: 'JHERS October 2024 Issue Published' },
        ]);
      });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/announcements?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <aside className="space-y-6">
      {/* Search */}
      <div>
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l text-sm focus:outline-none focus:border-[#D4A373]"
          />
          <button type="submit" className="bg-[#D4A373] text-[#001233] px-3 py-2 rounded-r hover:bg-[#c09060] transition-colors">
            <Search size={18} />
          </button>
        </form>
      </div>

      {/* Announcements */}
      <div>
        <h3 className="font-cinzel text-lg font-semibold text-[#001233] mb-3 pb-2 border-b border-[#D4A373]">
          Announcement
        </h3>
        <ul className="space-y-0">
          {announcements.map((ann) => (
            <li key={ann._id} className="announcement-item">
              <Link to={`/announcements`} className="text-sm text-[#001233] hover:text-[#D4A373] transition-colors flex items-start gap-2">
                <span className="text-[#D4A373] mt-1">&bull;</span>
                <span>{ann.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Links */}
      <div className="pt-4">
        <ul className="space-y-2">
          <li>
            <Link to="/photo-gallery" className="flex items-center gap-2 text-sm text-[#6C757D] hover:text-[#D4A373] transition-colors py-1">
              <Camera size={14} />
              <span>Photo Gallery</span>
            </Link>
          </li>
          <li>
            <Link to="/announcements" className="flex items-center gap-2 text-sm text-[#6C757D] hover:text-[#D4A373] transition-colors py-1">
              <Bell size={14} />
              <span>Announcement</span>
            </Link>
          </li>
          <li>
            <Link to="/contact" className="flex items-center gap-2 text-sm text-[#6C757D] hover:text-[#D4A373] transition-colors py-1">
              <MessageSquare size={14} />
              <span>Feedback</span>
            </Link>
          </li>
          <li>
            <span className="flex items-center gap-2 text-sm text-[#6C757D] py-1">
              <Shield size={14} />
              <span>Disclaimer</span>
            </span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
