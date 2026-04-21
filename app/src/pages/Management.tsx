import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';

interface ManagementMember {
  _id: string;
  name: string;
  designation: string;
  order: number;
}

export default function Management() {
  const [managementData, setManagementData] = useState<ManagementMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManagement = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/management`);
        const data = await res.json();
        if (data.success) {
          setManagementData(data.members);
        }
      } catch (error) {
        console.error('Error fetching management:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchManagement();
  }, []);

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
                {loading ? (
                  <tr>
                    <td colSpan={3} className="text-center py-10">Loading...</td>
                  </tr>
                ) : managementData.length > 0 ? (
                  managementData.map((member, index) => (
                    <motion.tr
                      key={member._id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <td className="text-center font-semibold">{index + 1}</td>
                      <td className="font-medium text-[#001233]">{member.name}</td>
                      <td className="text-[#6C757D]">{member.designation}</td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-10">No management members found.</td>
                  </tr>
                )}
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
