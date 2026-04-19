import { Link } from 'react-router-dom';
import { Camera, Bell, MessageSquare, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#001233] text-[#FDF6E3]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#FDF6E3]/80">
            &copy; {new Date().getFullYear()} Higher Education & Research Society. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/photo-gallery" className="flex items-center gap-2 hover:text-[#D4A373] transition-colors">
              <Camera size={14} />
              <span>Photo Gallery</span>
            </Link>
            <Link to="/announcements" className="flex items-center gap-2 hover:text-[#D4A373] transition-colors">
              <Bell size={14} />
              <span>Announcement</span>
            </Link>
            <Link to="/contact" className="flex items-center gap-2 hover:text-[#D4A373] transition-colors">
              <MessageSquare size={14} />
              <span>Feedback</span>
            </Link>
            <span className="flex items-center gap-2 text-[#FDF6E3]/60">
              <Shield size={14} />
              <span>Disclaimer</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
