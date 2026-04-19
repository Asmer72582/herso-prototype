import { motion } from 'framer-motion';
import { FileText, MapPin } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function RegistrationDetails() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-cinzel text-3xl text-[#001233] mb-2">Registration Details</h1>
          <div className="w-24 h-0.5 bg-[#D4A373] mb-8" />

          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-[#D4A373]" size={24} />
                <h2 className="font-cinzel text-xl text-[#001233]">Society Registration</h2>
              </div>
              <p className="text-[#6C757D] leading-relaxed mb-4">
                The Society is registered with the Government of Maharashtra, 
                The Assistant Charity Commissioner, Thane.
              </p>
              <div className="bg-[#001233]/5 rounded-lg p-4">
                <p className="text-sm text-[#6C757D] mb-1">Registration Number</p>
                <p className="font-cinzel text-lg text-[#001233] font-semibold">MAHA/651/2013/THANE</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="text-[#D4A373]" size={24} />
                <h2 className="font-cinzel text-xl text-[#001233]">Official Address</h2>
              </div>
              <div className="bg-[#001233]/5 rounded-lg p-4">
                <p className="text-[#001233] leading-relaxed">
                  NL6/5/13, Sector – 10,<br />
                  Nerul, Navi Mumbai-400706 (Maharashtra),<br />
                  India.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="font-cinzel text-xl text-[#001233] mb-4">Trust Registration</h2>
              <p className="text-[#6C757D] leading-relaxed mb-4">
                The Society is also registered as a Trust under the Bombay Trusts Act 1950.
              </p>
              <div className="bg-[#001233]/5 rounded-lg p-4">
                <p className="text-sm text-[#6C757D] mb-1">Trust Registration Number</p>
                <p className="font-cinzel text-lg text-[#001233] font-semibold">AF/27205/Thane</p>
              </div>
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
