import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const printJournals = [
  {
    title: 'Contemporary Discourse',
    subtitle: 'A Journal of Humanities and Social Sciences',
    description: 'Contemporary Discourse is a peer-reviewed print journal that explores contemporary issues in humanities and social sciences. It publishes original research articles, book reviews, and critical essays on topics ranging from literature, culture, philosophy, sociology, and political science.',
    cover: '/journal-cover-2.jpg',
    frequency: 'Bi-annual',
    issn: '2349-0217'
  },
  {
    title: 'Literary Insight',
    subtitle: 'A Journal of English Literature and Criticism',
    description: 'Literary Insight focuses on literary criticism, theory, and comparative literature studies. The journal welcomes submissions on all aspects of English literature, world literature, literary theory, cultural studies, and translation studies.',
    cover: '/journal-cover-1.jpg',
    frequency: 'Bi-annual',
    issn: '2349-0225'
  },
  {
    title: 'Research Ethics',
    subtitle: 'A Journal of Research Methodology and Ethics',
    description: 'Research Ethics is dedicated to promoting ethical practices in academic research. The journal publishes articles on research methodology, ethical guidelines, case studies, and policy discussions related to research integrity.',
    cover: '/journal-cover-2.jpg',
    frequency: 'Annual',
    issn: '2349-0233'
  }
];

export default function PrintJournal() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-cinzel text-3xl text-[#001233] mb-2">Print Journals</h1>
          <div className="w-24 h-0.5 bg-[#D4A373] mb-8" />

          <div className="space-y-10">
            {printJournals.map((journal, index) => (
              <motion.div
                key={journal.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={journal.cover}
                      alt={journal.title}
                      className="w-40 h-auto rounded-lg shadow-md"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen size={18} className="text-[#D4A373]" />
                      <h2 className="font-cinzel text-xl text-[#001233]">{journal.title}</h2>
                    </div>
                    <p className="text-sm text-[#D4A373] mb-3">{journal.subtitle}</p>
                    <p className="text-[#6C757D] text-sm leading-relaxed mb-4">{journal.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="bg-[#001233]/5 px-3 py-1 rounded text-[#001233]">
                        Frequency: {journal.frequency}
                      </span>
                      <span className="bg-[#001233]/5 px-3 py-1 rounded text-[#001233]">
                        ISSN: {journal.issn}
                      </span>
                    </div>
                  </div>
                </div>
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
