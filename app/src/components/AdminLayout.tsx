import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Bell, LogOut, Loader2, Image as ImageIcon, Layout, Users } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    setLoading(false);
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'publications', label: 'Publications', icon: BookOpen, path: '/admin/publications' },
    { id: 'announcements', label: 'Announcements', icon: Bell, path: '/admin/announcements' },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon, path: '/admin/gallery' },
    { id: 'hero', label: 'Hero Slider', icon: Layout, path: '/admin/hero' },
    { id: 'management', label: 'Management', icon: Users, path: '/admin/management' },
  ];

  const getActiveTab = () => {
    if (location.pathname.startsWith('/admin/dashboard')) return 'dashboard';
    if (location.pathname.startsWith('/admin/publications')) return 'publications';
    if (location.pathname.startsWith('/admin/announcements')) return 'announcements';
    if (location.pathname.startsWith('/admin/gallery')) return 'gallery';
    if (location.pathname.startsWith('/admin/hero')) return 'hero';
    if (location.pathname.startsWith('/admin/management')) return 'management';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-72 bg-[#001233] text-[#FDF6E3] flex-shrink-0 flex flex-col sticky top-0 h-screen shadow-2xl z-50">
        <div className="p-8 border-b border-[#FDF6E3]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D4A373] rounded-xl flex items-center justify-center font-cinzel text-xl text-[#001233] font-bold">H</div>
            <div>
              <h2 className="font-cinzel text-lg leading-tight">HERSO</h2>
              <p className="text-[10px] text-[#FDF6E3]/40 tracking-widest uppercase font-bold">Internal Admin</p>
            </div>
          </div>
        </div>
        
        <nav className="p-6 flex-grow">
          <ul className="space-y-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => navigate(tab.path)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-[#D4A373] text-[#001233] shadow-lg shadow-[#D4A373]/20 translate-x-2'
                      : 'text-[#FDF6E3]/60 hover:bg-[#001a45] hover:text-white'
                  }`}
                >
                  <tab.icon size={20} className={activeTab === tab.id ? 'animate-pulse' : ''} />
                  <span>{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-8 border-t border-[#FDF6E3]/10">
          <div className="bg-[#001a45] rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#D4A373]/20 flex items-center justify-center text-[#D4A373] font-bold text-xs">AS</div>
              <div>
                <p className="text-[10px] font-bold text-white leading-tight">Admin User</p>
                <p className="text-[8px] text-gray-400">System Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-red-400 border border-red-400/20 hover:bg-red-400 hover:text-white transition-all shadow-lg shadow-red-500/0 hover:shadow-red-500/20"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
          <p className="text-[8px] text-center text-gray-500 font-bold uppercase tracking-widest">© 2026 HERSO Publishing</p>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-grow bg-[#FDF6E3]/30 overflow-y-auto h-screen relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        <Outlet />
      </main>
    </div>
  );
}
