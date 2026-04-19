import { motion } from 'framer-motion';
import { Target, BookOpen, Globe, Lightbulb, Users, Award } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const objectives = [
  {
    icon: Target,
    title: 'Quality Enhancement',
    description: 'To enhance the quality and effectiveness of higher education, research and training systems in India and across the globe.'
  },
  {
    icon: BookOpen,
    title: 'Research Promotion',
    description: 'To promote systematic research and scholarship in various fields of higher education and allied disciplines.'
  },
  {
    icon: Globe,
    title: 'Global Collaboration',
    description: 'To foster international collaboration among educational institutions, researchers, and academicians worldwide.'
  },
  {
    icon: Lightbulb,
    title: 'Innovation & Development',
    description: 'To encourage innovation in teaching, learning, and research methodologies for sustainable development.'
  },
  {
    icon: Users,
    title: 'Community Building',
    description: 'To build a strong community of scholars, researchers, and educationists for knowledge exchange.'
  },
  {
    icon: Award,
    title: 'Excellence in Education',
    description: 'To recognize and reward outstanding contributions in the field of higher education and research.'
  }
];

export default function Objectives() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-cinzel text-3xl text-[#001233] mb-2">Objectives</h1>
          <div className="w-24 h-0.5 bg-[#D4A373] mb-8" />

          <p className="text-[#6C757D] leading-relaxed mb-10">
            The Higher Education and Research Society has been established with the following key objectives 
            to guide its mission and activities in the realm of higher education and research.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {objectives.map((obj, index) => (
              <motion.div
                key={obj.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <obj.icon className="text-[#D4A373] mb-3" size={28} />
                <h3 className="font-cinzel text-lg text-[#001233] mb-2">{obj.title}</h3>
                <p className="text-[#6C757D] text-sm leading-relaxed">{obj.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <div className="hidden lg:block">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
