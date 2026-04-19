import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, Search, Menu, X, ChevronDown } from 'lucide-react';

const navItems = [
  { label: 'Home', path: '/' },
  {
    label: 'About Society',
    path: '#',
    children: [
      { label: 'Society at Glance', path: '/society-at-glance' },
      { label: 'Objectives', path: '/objectives' },
      { label: 'Registration Details', path: '/registration-details' },
    ],
  },
  { label: 'Management', path: '/management-council' },
  { label: 'Mission', path: '/mission-vision' },
  { label: 'Online Journal', path: '/jhers' },
  { label: 'Print Journal', path: '/print-journal' },
  { label: 'Photo Gallery', path: '/photo-gallery' },
  { label: 'Contact', path: '/contact' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full">
      {/* Top bar */}
      <div className="bg-[#001233] text-[#FDF6E3] py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:+919322530571" className="flex items-center gap-2 hover:text-[#D4A373] transition-colors">
              <Phone size={14} />
              <span>+91 9322530571</span>
            </a>
            <a href="mailto:sudhirnikam@gmail.com" className="flex items-center gap-2 hover:text-[#D4A373] transition-colors">
              <Mail size={14} />
              <span>sudhirnikam@gmail.com</span>
            </a>
          </div>
          <Link to="/admin/login" className="text-xs hover:text-[#D4A373] transition-colors uppercase tracking-wider">
            Admin Login
          </Link>
        </div>
      </div>

      {/* Logo section */}
      <div className="bg-white py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <Link to="/" className="flex-shrink-0">
            <img src="/logo.png" alt="HERSO Logo" className="h-20 w-auto" />
          </Link>
          <div className="flex-grow">
            <h1 className="font-cinzel text-2xl md:text-3xl font-semibold text-[#001233]">
              Higher Education & Research Society
            </h1>
            <p className="text-sm text-[#6C757D] mt-1 max-w-2xl">
              An Education Society registered under Government of India's Societies Registration Act 1860 (Maha/651/2013/Thane) and a Trust registered under Bombay Trusts Act 1950 (AF/27205/Thane)
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`bg-[#001233] sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Desktop nav */}
            <ul className="hidden md:flex items-center">
              {navItems.map((item) => (
                <li key={item.label} className="relative"
                  onMouseEnter={() => item.children && setDropdownOpen(true)}
                  onMouseLeave={() => item.children && setDropdownOpen(false)}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center gap-1 px-3 py-4 text-xs lg:text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
                      isActive(item.path) || (item.children?.some(c => isActive(c.path)))
                        ? 'text-[#D4A373] border-b-2 border-[#D4A373]'
                        : 'text-[#FDF6E3] hover:text-[#D4A373]'
                    }`}
                  >
                    {item.label}
                    {item.children && <ChevronDown size={14} />}
                  </Link>
                  {item.children && dropdownOpen && (
                    <ul className="absolute top-full left-0 bg-[#001233] shadow-xl min-w-[220px] py-2 border-t border-[#D4A373]">
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <Link
                            to={child.path}
                            className={`block px-4 py-2 text-sm transition-colors ${
                              isActive(child.path)
                                ? 'text-[#D4A373] bg-[#001a45]'
                                : 'text-[#FDF6E3] hover:text-[#D4A373] hover:bg-[#001a45]'
                            }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            {/* Search */}
            <div className="hidden xl:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-[#001a45] text-[#FDF6E3] pl-3 pr-8 py-1.5 text-xs rounded border border-[#D4A373]/30 focus:outline-none focus:border-[#D4A373] w-32 lg:w-40"
                />
                <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D4A373]" />
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-[#FDF6E3] p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#001233] border-t border-[#D4A373]/20">
            <ul className="py-2">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className={`block px-4 py-2 text-sm ${
                      isActive(item.path) ? 'text-[#D4A373]' : 'text-[#FDF6E3]'
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="pl-6">
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <Link
                            to={child.path}
                            className={`block px-4 py-1.5 text-sm ${
                              isActive(child.path) ? 'text-[#D4A373]' : 'text-[#FDF6E3]/70'
                            }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
