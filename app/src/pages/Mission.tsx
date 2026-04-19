import { motion } from 'framer-motion';
import { Eye, Target } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function Mission() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-8">
            <img src="/logo.png" alt="HERSO Logo" className="h-48 w-auto" />
          </div>

          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Target className="text-[#D4A373]" size={28} />
                <h1 className="font-cinzel text-3xl text-[#001233]">Mission</h1>
              </div>
              <div className="w-24 h-0.5 bg-[#D4A373] mb-6" />
              <p className="text-[#6C757D] leading-relaxed italic">
                The society is with targeted mission to improve the quality, efficiency and effectiveness of 
                education, research and training systems in India and across the globe. This will in turn be 
                a vantage point for us to encourage and improve Higher Educational Institutions' contribution 
                to society and nation. Consequently, it will be a stimulating factor to create and foster an 
                Indian area of higher education and it will empower the excellence and improve the visibility 
                of higher educational activities focused on services to society and nation.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <Eye className="text-[#D4A373]" size={28} />
                <h1 className="font-cinzel text-3xl text-[#001233]">Vision</h1>
              </div>
              <div className="w-24 h-0.5 bg-[#D4A373] mb-6" />
              <p className="text-[#6C757D] leading-relaxed italic">
                To be one of the best non-governmental organizations across the globe making education 
                significantly research oriented and practical in learning.
              </p>
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
