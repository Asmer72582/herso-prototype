import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, Bell, Image, MessageSquare, Plus, BarChart3, Users
} from 'lucide-react';

interface Stats {
  totalPublications: number;
  totalAnnouncements: number;
  totalGalleryImages: number;
  totalMessages: number;
  totalManagementMembers?: number;
}

interface Publication {
  _id: string;
  title: string;
  volume: string;
  issue: string;
  month: string;
  year: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
  const token = localStorage.getItem('adminToken');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const [statsRes, pubsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/admin/stats`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL}/publications`, { headers })
      ]);
      const statsData = await statsRes.json();
      const pubsData = await pubsRes.json();
      if (statsData.success) setStats(statsData.stats);
      if (pubsData.success) setPublications(pubsData.publications);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
      <h1 className="font-cinzel text-3xl text-[#001233] mb-8">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Publications', value: stats?.totalPublications || 0, icon: BookOpen, color: 'bg-blue-600' },
          { label: 'Announcements', value: stats?.totalAnnouncements || 0, icon: Bell, color: 'bg-green-600' },
          { label: 'Management', value: stats?.totalManagementMembers || 0, icon: Users, color: 'bg-indigo-600' },
          { label: 'Gallery Images', value: stats?.totalGalleryImages || 0, icon: Image, color: 'bg-purple-600' },
          { label: 'Messages', value: stats?.totalMessages || 0, icon: MessageSquare, color: 'bg-orange-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="font-cinzel text-3xl text-[#001233]">{stat.value}</p>
            </div>
            <div className={`${stat.color} text-white p-3.5 rounded-2xl shadow-lg`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Issues */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-cinzel text-xl text-[#001233]">Recent Publications</h2>
            <button 
              onClick={() => navigate('/admin/publications')}
              className="text-sm font-bold text-[#D4A373] hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {publications.slice(0, 5).map((pub) => (
              <div key={pub._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-gray-100">
                <div className="w-10 h-10 bg-[#D4A373]/10 text-[#D4A373] rounded-lg flex items-center justify-center">
                  <BookOpen size={20} />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-bold text-[#001233]">{pub.title}</p>
                  <p className="text-xs text-gray-400">{pub.volume}, {pub.issue}</p>
                </div>
                <button 
                  onClick={() => navigate(`/admin/publications/${pub._id}/papers`)}
                  className="p-2 text-[#D4A373] hover:bg-[#D4A373]/10 rounded-lg transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Commands */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-cinzel text-xl text-[#001233] mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/admin/publications')}
              className="flex flex-col items-center justify-center p-6 bg-blue-50/50 border border-blue-100 rounded-2xl hover:bg-blue-50 transition-all group text-center"
            >
              <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                <Plus size={24} />
              </div>
              <span className="block text-sm font-bold text-[#001233]">New Publication</span>
              <span className="block text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Create Issue</span>
            </button>
            <button
              onClick={() => navigate('/admin/announcements')}
              className="flex flex-col items-center justify-center p-6 bg-green-50/50 border border-green-100 rounded-2xl hover:bg-green-50 transition-all group text-center"
            >
              <div className="w-12 h-12 bg-green-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-600/20 group-hover:scale-110 transition-transform">
                <Bell size={24} />
              </div>
              <span className="block text-sm font-bold text-[#001233]">Post Announcement</span>
              <span className="block text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Notify Users</span>
            </button>
            <button
              onClick={() => navigate('/admin/management')}
              className="flex flex-col items-center justify-center p-6 bg-indigo-50/50 border border-indigo-100 rounded-2xl hover:bg-indigo-50 transition-all group text-center"
            >
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <span className="block text-sm font-bold text-[#001233]">Management Council</span>
              <span className="block text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Edit Members</span>
            </button>
            <button
              onClick={() => window.open('/', '_blank')}
              className="flex flex-col items-center justify-center p-6 bg-purple-50/50 border border-purple-100 rounded-2xl hover:bg-purple-50 transition-all group text-center"
            >
              <div className="w-12 h-12 bg-purple-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-600/20 group-hover:scale-110 transition-transform">
                <BarChart3 size={24} />
              </div>
              <span className="block text-sm font-bold text-[#001233]">Public Website</span>
              <span className="block text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Live Preview</span>
            </button>
            <div className="flex flex-col items-center justify-center p-6 bg-orange-50/30 border border-dashed border-orange-100 rounded-2xl text-center opacity-60">
              <div className="w-12 h-12 bg-gray-200 text-gray-400 rounded-xl flex items-center justify-center mb-4">
                <Plus size={20} />
              </div>
              <span className="block text-sm font-bold text-gray-400">More Soon</span>
              <span className="block text-[10px] text-gray-300 mt-1 uppercase tracking-widest font-bold">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
