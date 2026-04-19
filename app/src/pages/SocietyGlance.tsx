import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';

export default function SocietyGlance() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-cinzel text-3xl text-[#001233] mb-2">Society at Glance</h1>
          <div className="w-24 h-0.5 bg-[#D4A373] mb-8" />

          <div className="prose max-w-none">
            <p className="text-[#6C757D] leading-relaxed mb-6">
              The Higher Education and Research Society is a Navi Mumbai-based international learned society 
              concerned to advance understanding of higher education, especially through the insights, perspectives 
              and knowledge offered by systematic research and scholarship. It is a registered society with the 
              Government of Maharashtra, Assistant Charity Commissioner, Thane District, Maharashtra.
            </p>
            <p className="text-[#6C757D] leading-relaxed mb-6">
              The Society aims to be the leading international society in the field, as to both the support and 
              the dissemination of research and higher education. We aim to commit to sustainable development and 
              focus on the solutions to the climate change, social inequality, awareness of literature and language, 
              spread of scientific attitude in academicians and citizens, practical and solution based approach to 
              the higher education in general, introduction of applied education and many more.
            </p>
            <p className="text-[#6C757D] leading-relaxed mb-6">
              The society aims to attain the sustainable development in the field of higher education and research 
              through constant support to research and higher learning activities through various means available. 
              This role is especially pronounced in the realm of higher education and research society because at 
              these level students are being prepared to enter the skilled human resource market and emerge with 
              skills to contribute to the intellectual property and they will act as harbingers of ideas.
            </p>
            <p className="text-[#6C757D] leading-relaxed mb-6">
              The sustainable development that we wish is not only an economic process but also an academic process. 
              It enables the pattern of resources meeting the needs of the present as well as to enhance the ability 
              of future generations to meet their own intellectual needs. In order to preserve the standard of natural 
              world, economic, social, environmental and academic world, it is essential to consider and harmonise 
              the intellectual factors.
            </p>
            <p className="text-[#6C757D] leading-relaxed">
              Hence, with a vigour and vitality in our ideas and dreams to undertake a herculean task of spreading 
              applied as well as conceptual higher education and research to boost the knowledge and economy.
            </p>
          </div>
        </motion.div>
        <div className="hidden lg:block">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
