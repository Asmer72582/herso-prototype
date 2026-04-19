import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, Users, Award, Globe } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const stats = [
  { icon: BookOpen, label: 'Publications', value: '50+' },
  { icon: Users, label: 'Members', value: '500+' },
  { icon: Award, label: 'Conferences', value: '25+' },
  { icon: Globe, label: 'Countries', value: '15+' },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [latestPubs, setLatestPubs] = useState<any[]>([]);
  const [heroSlides, setHeroSlides] = useState<any[]>([]);

  useEffect(() => {
    // Fetch hero slides
    fetch(`${import.meta.env.VITE_API_URL}/hero`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.slides.length > 0) {
          setHeroSlides(data.slides);
        } else {
          // Fallback static slides if none in DB
          setHeroSlides([
            { image: '/hero-1.jpg', title: 'International Conference 2023', subtitle: 'Advancing Global Education' },
            { image: '/hero-2.jpg', title: 'Academic Excellence', subtitle: 'Research & Innovation' },
            { image: '/hero-3.jpg', title: 'Building Future Leaders', subtitle: 'Higher Education for All' },
          ]);
        }
      })
      .catch(() => {
        setHeroSlides([
          { image: '/hero-1.jpg', title: 'International Conference 2023', subtitle: 'Advancing Global Education' },
        ]);
      });

    const timer = setInterval(() => {
      if (heroSlides.length > 0) {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }
    }, 5000);

    // Fetch latest publications
    fetch(`${import.meta.env.VITE_API_URL}/publications/latest`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLatestPubs(data.publications);
        }
      })
      .catch(err => console.error('Error fetching latest pubs:', err));

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/journal-cover-1.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `${import.meta.env.VITE_API_URL.replace('/api', '')}${imagePath}`;
    return imagePath;
  };

  return (
    <div>
      {/* Hero Slider */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${getImageUrl(slide.image)})` }}
            />
            <div className="absolute inset-0 bg-[#001233]/60" />
          </div>
        ))}

        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center px-4">
            {heroSlides[currentSlide] && (
              <>
                <motion.h1
                  key={currentSlide}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="font-cinzel text-3xl md:text-5xl lg:text-6xl text-[#FDF6E3] hero-text-shadow mb-4"
                >
                  {heroSlides[currentSlide].title}
                </motion.h1>
                <motion.p
                  key={`sub-${currentSlide}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-lg md:text-xl text-[#D4A373] hero-text-shadow"
                >
                  {heroSlides[currentSlide].subtitle}
                </motion.p>
              </>
            )}
          </div>
        </div>

        {/* Navigation arrows */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-[#FDF6E3] hover:text-[#D4A373] transition-colors">
          <ChevronLeft size={40} />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-[#FDF6E3] hover:text-[#D4A373] transition-colors">
          <ChevronRight size={40} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-[#D4A373] w-8' : 'bg-[#FDF6E3]/50'
                }`}
            />
          ))}
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-[#001233] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <stat.icon className="mx-auto text-[#D4A373] mb-2" size={28} />
                <div className="font-cinzel text-2xl md:text-3xl text-[#FDF6E3] font-semibold">{stat.value}</div>
                <div className="text-sm text-[#FDF6E3]/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content with sidebar */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
          {/* Main content */}
          <div className="space-y-12">
            {/* Welcome section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-cinzel text-2xl md:text-3xl text-[#001233] mb-4">
                Welcome to Higher Education and Research Society
              </h2>
              <p className="text-[#6C757D] leading-relaxed mb-4">
                The Higher Education and Research Society is dedicated to advancing the quality and effectiveness of higher education,
                research, and training systems in India and across the globe. We encourage Higher Educational Institutions, Academicians,
                Researchers, and Professionals to contribute to society and nation-building through innovative research and academic excellence.
              </p>
              <Link to="/society-at-glance" className="btn-gold inline-block text-sm uppercase tracking-wider">
                Learn More
              </Link>
            </motion.div>

            {/* President's Desk */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#001233] rounded-lg p-6 md:p-8"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img
                    src="/president.webp"
                    alt="Dr. Sudhir Nikam"
                    className="w-40 h-52 object-cover rounded-lg border-2 border-[#D4A373]"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-cinzel text-xl text-[#D4A373] mb-3">From President's Desk</h3>
                  <p className="text-[#FDF6E3]/90 leading-relaxed italic mb-4">
                    "Higher Education and Research Society is a magnifying step with the targeted mission to enhance the quality
                    and effectiveness of higher education, research and training system in India and across the globe encouraging
                    Higher Educational Institutions', Academicians, Researchers' and Professionals' contribution to society and nation."
                  </p>
                  <p className="text-[#D4A373] font-semibold">- Dr. Sudhir Nikam</p>
                  <p className="text-[#FDF6E3]/60 text-sm">President, Higher Education & Research Society</p>
                </div>
              </div>
            </motion.div>

            {/* Latest Journals */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-cinzel text-2xl text-[#001233] mb-6">Latest Publications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {latestPubs.slice(0, 4).map((pub, index) => (
                  <Link key={pub._id} to={`/jhers/${pub._id}`} className="group cursor-pointer">
                    <div className="overflow-hidden rounded-lg shadow-md mb-3 aspect-[3/4]">
                      <img
                        src={getImageUrl(pub.coverImage)}
                        alt={pub.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-cinzel text-[11px] font-bold text-[#001233] group-hover:text-[#D4A373] transition-colors line-clamp-2 uppercase tracking-tighter">
                      {pub.title}
                    </h3>
                    <p className="text-[10px] text-[#6C757D]">{pub.volume}, {pub.issue}</p>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Mission Preview */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center py-8"
            >
              <h2 className="font-cinzel text-2xl md:text-3xl text-[#001233] mb-4">
                Our Mission
              </h2>
              <p className="text-[#6C757D] max-w-3xl mx-auto leading-relaxed mb-6">
                To improve the quality, efficiency and effectiveness of education, research and training systems
                in India and across the globe, encouraging Higher Educational Institutions' contribution to society and nation.
              </p>
              <Link to="/mission-vision" className="btn-gold inline-block text-sm uppercase tracking-wider">
                Read Our Mission & Vision
              </Link>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>
        </div>
      </section>
    </div>
  );
}
