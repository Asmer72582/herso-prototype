import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';

const managementData = [
  { srNo: 1, name: 'Dr. Sudhir Nikam', designation: 'President' },
  { srNo: 2, name: 'Dr. Madhavi Nikam', designation: 'Secretary' },
  { srNo: 3, name: 'Dr. Satyawan Hanegave', designation: 'Treasurer' },
  { srNo: 4, name: 'Shri. Sharad Rankhamb', designation: 'Vice-President' },
  { srNo: 5, name: 'Smt. Supriya Rankhamb', designation: 'Jt. Secretary' },
  { srNo: 6, name: 'Prof. Venkatesh Rankhamb', designation: 'Member' },
  { srNo: 7, name: 'Prin. Umesh Bagal', designation: 'Member' },
  { srNo: 8, name: 'Adv. Chaani Srivastava, NewYork-New Delhi', designation: 'Legal Advisor' },
];

export default function Management() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-cinzel text-3xl text-[#001233] mb-2 text-center">Higher Education and Research Society</h1>
          <h2 className="font-cinzel text-xl text-[#D4A373] mb-8 text-center">Management</h2>

          <div className="overflow-x-auto">
            <table className="management-table w-full">
              <thead>
                <tr>
                  <th className="w-20 text-center">Sr. No.</th>
                  <th>Name</th>
                  <th>Designation</th>
                </tr>
              </thead>
              <tbody>
                {managementData.map((member, index) => (
                  <motion.tr
                    key={member.srNo}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <td className="text-center font-semibold">{member.srNo}</td>
                    <td className="font-medium text-[#001233]">{member.name}</td>
                    <td className="text-[#6C757D]">{member.designation}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        <div className="hidden lg:block">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
