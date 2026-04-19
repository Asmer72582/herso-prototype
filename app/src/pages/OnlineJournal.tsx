import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Users, FileText, ClipboardList, Archive, Calendar, Phone, Mail, ChevronRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';

interface Publication {
  _id: string;
  title: string;
  volume: string;
  issue: string;
  month: string;
  year: number;
  description: string;
  coverImage: string;
  isPublished: boolean;
}

const journalNavItems = [
  { label: 'About Journal', icon: BookOpen },
  { label: 'Editorial Board', icon: Users },
  { label: 'Guidelines for Authors', icon: FileText },
  { label: 'Registration Form', icon: ClipboardList },
  { label: 'Archives', icon: Archive },
  { label: 'Current Issue', icon: Calendar },
];

export default function OnlineJournal() {
  const [activeTab, setActiveTab] = useState('About Journal');
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/publications?type=online`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPublications(data.publications);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getImageUrl = (path: string) => {
    if (!path) return '/journal-cover-1.jpg';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/uploads')) return `${import.meta.env.VITE_API_URL.replace('/api', '')}${path}`;
    return path;
  };

  const currentIssue = publications[0];
  const archives = publications.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Journal Header */}
          <div className="mb-8">
            <h1 className="font-cinzel text-2xl md:text-3xl text-[#001233] mb-2">
              Journal of Higher Education and Research Society
            </h1>
            <p className="text-[#D4A373] font-cinzel">A Refereed International</p>
            <p className="text-sm text-[#6C757D] mt-2">ISSN – 2349 – 0209</p>
          </div>

          {/* Journal Navigation */}
          <div className="bg-[#001233] rounded-lg p-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {journalNavItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setActiveTab(item.label)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm rounded transition-colors ${
                    activeTab === item.label
                      ? 'bg-[#D4A373] text-[#001233]'
                      : 'text-[#FDF6E3] hover:bg-[#001a45]'
                  }`}
                >
                  <item.icon size={14} />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            {activeTab === 'About Journal' && (
              <div>
                <h2 className="font-cinzel text-xl text-[#001233] mb-4">About the Journal</h2>
                <p className="text-[#6C757D] leading-relaxed mb-4">
                  Journal of Higher Education and Research Society: A Refereed International is a biannual 
                  (April-October) Open Access E-journal, published under the auspices of Higher Education and 
                  Research Society, with the aim of bringing Higher Education-relevant issues/topics to incorporate 
                  a modern, appealing design with wide-ranging contributions from respected authors, peer groups, 
                  research scholars, students, professionals and likeminded groups.
                </p>
                <p className="text-[#6C757D] leading-relaxed mb-4">
                  The Journal does not seek to advocate the role or operations of Higher Education and Research 
                  Society, Navi Mumbai but to draw attention to the intersections of Higher Education, including 
                  the potential role of intellectuals, research institutes, academic institutes, university departments, 
                  government and other likeminded as well as peer group in the achievement of development.
                </p>
                <p className="text-[#6C757D] leading-relaxed mb-4">
                  Following the conventions of academic journal style that of typical MLA Styled documents and 
                  publications, and that of quality academic journal.
                </p>
                <div className="bg-[#001233]/5 rounded-lg p-4 mt-6">
                  <p className="text-sm text-[#001233] font-semibold mb-2">Note:</p>
                  <p className="text-sm text-[#6C757D]">
                    The Society publishes the research articles presented in annual international conference 
                    organized by it after the peer review process. The society does not charge publication 
                    charges from the participants.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'Editorial Board' && (
              <div>
                <h2 className="font-cinzel text-xl text-[#001233] mb-4">Editorial Board</h2>
                <div className="space-y-4">
                  {[
                    { name: 'Dr. Sudhir Nikam', role: 'Chief Editor', aff: 'Higher Education & Research Society' },
                    { name: 'Dr. Madhavi Nikam', role: 'Executive Editor', aff: 'Higher Education & Research Society' },
                    { name: 'Dr. Satyawan Hanegave', role: 'Editor', aff: 'University of Mumbai' },
                    { name: 'Prof. Venkatesh Rankhamb', role: 'Editor', aff: 'Savitribai Phule Pune University' },
                  ].map((editor) => (
                    <div key={editor.name} className="flex items-start gap-4 p-3 bg-[#001233]/5 rounded-lg">
                      <div className="w-10 h-10 bg-[#001233] rounded-full flex items-center justify-center text-[#D4A373] font-cinzel text-sm flex-shrink-0">
                        {editor.name.split(' ').slice(-1)[0][0]}
                      </div>
                      <div>
                        <p className="font-semibold text-[#001233]">{editor.name}</p>
                        <p className="text-sm text-[#D4A373]">{editor.role}</p>
                        <p className="text-xs text-[#6C757D]">{editor.aff}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Guidelines for Authors' && (
              <div>
                <h2 className="font-cinzel text-xl text-[#001233] mb-4">Guidelines for Authors</h2>
                <ul className="space-y-3 text-[#6C757D]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4A373] mt-1">1.</span>
                    <span>Articles should be typed in MLA format with 1.5 line spacing.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4A373] mt-1">2.</span>
                    <span>Word limit: 3000-5000 words including references.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4A373] mt-1">3.</span>
                    <span>Abstract of 150-200 words with 5-6 keywords.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4A373] mt-1">4.</span>
                    <span>References should follow MLA 8th edition style.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4A373] mt-1">5.</span>
                    <span>Submit articles via email to sudhirnikam@gmail.com</span>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'Registration Form' && (
              <div>
                <h2 className="font-cinzel text-xl text-[#001233] mb-4">Author Registration</h2>
                <p className="text-[#6C757D] mb-4">
                  To submit your research article, please register as an author. 
                  Registration is free of charge.
                </p>
                <Link to="/contact" className="btn-gold inline-block text-sm uppercase tracking-wider">
                  Contact for Registration
                </Link>
              </div>
            )}

            {activeTab === 'Archives' && (
              <div>
                <h2 className="font-cinzel text-xl text-[#001233] mb-4">Journal Archives</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {loading ? (
                    <p>Loading archives...</p>
                  ) : archives.length > 0 ? (
                    archives.map((pub) => (
                      <Link 
                        key={pub._id} 
                        to={`/jhers/${pub._id}`}
                        className="flex items-center gap-4 p-3 bg-[#001233]/5 rounded-lg hover:bg-[#001233]/10 transition-colors cursor-pointer group"
                      >
                        <div className="w-12 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={getImageUrl(pub.coverImage)} 
                            alt={pub.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-xs font-bold text-[#001233] truncate uppercase tracking-tight">{pub.title}</p>
                          <p className="text-[10px] text-[#D4A373] mt-0.5">{pub.volume}, {pub.issue}</p>
                          <p className="text-[9px] text-[#6C757D]">{pub.month} {pub.year}</p>
                        </div>
                        <ChevronRight size={14} className="text-[#D4A373] group-hover:translate-x-1 transition-transform flex-shrink-0" />
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-[#6C757D]">No archived issues found.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'Current Issue' && (
              <div>
                <h2 className="font-cinzel text-xl text-[#001233] mb-4">Current Issue</h2>
                {loading ? (
                  <p>Loading current issue...</p>
                ) : currentIssue ? (
                  <div className="flex flex-col md:flex-row gap-6">
                    <img 
                      src={getImageUrl(currentIssue.coverImage)} 
                      alt="Current Issue" 
                      className="w-48 h-auto rounded-lg shadow-md border border-gray-100" 
                    />
                    <div>
                      <h3 className="font-cinzel text-lg text-[#001233] mb-2">{currentIssue.title}</h3>
                      <p className="text-sm text-[#6C757D] mb-4">
                        {currentIssue.description || 'Access the latest peer-reviewed research papers and articles in this issue.'}
                      </p>
                      <Link to={`/jhers/${currentIssue._id}`} className="btn-gold text-sm uppercase tracking-wider inline-block">
                        View Table of Contents
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[#6C757D]">No current issue published.</p>
                )}
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="mt-8 bg-[#001233] rounded-lg p-6 text-[#FDF6E3]">
            <h3 className="font-cinzel text-lg text-[#D4A373] mb-3">Address for Correspondence</h3>
            <p className="text-sm leading-relaxed mb-2">Dr. Sudhir Nikam</p>
            <p className="text-sm leading-relaxed">A-2, 503, Punyoday Park, Near Don Bosco School,</p>
            <p className="text-sm leading-relaxed">Adharwadi, Kalyan (West), Thane-421 301</p>
            <div className="flex items-center gap-2 mt-3 text-sm">
              <Phone size={14} className="text-[#D4A373]" />
              <span>Cell: 09322530571</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm">
              <Mail size={14} className="text-[#D4A373]" />
              <span>Sudhirnikam@gmail.com | hersomumbai@gmail.com</span>
            </div>
          </div>
        </motion.div>
        <div className="hidden lg:block">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
