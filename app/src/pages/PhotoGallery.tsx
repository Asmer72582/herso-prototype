import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const categories = ['all', 'conference', 'workshop', 'seminar', 'other'];

export default function PhotoGallery() {
  const [images, setImages] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/gallery`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setImages(data.images);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredItems = filter === 'all' ? images : images.filter(item => item.category === filter);

  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/uploads')) return `${import.meta.env.VITE_API_URL.replace('/api', '')}${path}`;
    return path;
  };

  const openLightbox = (index: number) => setLightbox(index);
  const closeLightbox = () => setLightbox(null);
  const prevImage = () => setLightbox((prev) => (prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null));
  const nextImage = () => setLightbox((prev) => (prev !== null ? (prev + 1) % filteredItems.length : null));

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-cinzel text-3xl text-[#001233] mb-2">Photo Gallery</h1>
          <div className="w-24 h-0.5 bg-[#D4A373] mb-6" />

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-sm rounded capitalize transition-colors ${
                  filter === cat
                    ? 'bg-[#001233] text-[#FDF6E3]'
                    : 'bg-gray-100 text-[#6C757D] hover:bg-[#001233]/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading gallery images...</div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="gallery-item rounded-lg overflow-hidden shadow-md cursor-pointer"
                    onClick={() => openLightbox(index)}
                  >
                    <div className="aspect-video overflow-hidden">
                      <img src={getImageUrl(item.imageUrl)} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3 bg-white">
                      <p className="font-cinzel text-sm text-[#001233]">{item.title}</p>
                      <p className="text-xs text-[#6C757D]">{item.eventYear}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
        <div className="hidden lg:block">
          <Sidebar />
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button className="absolute top-4 right-4 text-white hover:text-[#D4A373] transition-colors" onClick={closeLightbox}>
              <X size={32} />
            </button>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-[#D4A373] transition-colors" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
              <ChevronLeft size={40} />
            </button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-[#D4A373] transition-colors" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
              <ChevronRight size={40} />
            </button>
            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={getImageUrl(filteredItems[lightbox]?.imageUrl)}
              alt={filteredItems[lightbox]?.title}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-center">
              <p className="font-cinzel">{filteredItems[lightbox]?.title}</p>
              <p className="text-sm text-white/60">{filteredItems[lightbox]?.eventYear}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
