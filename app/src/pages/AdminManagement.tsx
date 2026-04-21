import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Trash2, X, Save, Settings
} from 'lucide-react';

interface ManagementMember {
  _id: string;
  name: string;
  designation: string;
  order: number;
}

export default function AdminManagement() {
  const [members, setMembers] = useState<ManagementMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<ManagementMember | null>(null);
  const token = localStorage.getItem('adminToken');

  const [form, setForm] = useState({
    name: '', designation: '', order: 0
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/management`);
      const data = await res.json();
      if (data.success) setMembers(data.members);
    } catch {
      alert('Failed to load management members');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingMember(null);
    setForm({
      name: '', designation: '', order: members.length + 1
    });
    setShowModal(true);
  };

  const handleEdit = (member: ManagementMember) => {
    setEditingMember(member);
    setForm({
      name: member.name, designation: member.designation, order: member.order
    });
    setShowModal(true);
  };

  const saveMember = async () => {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    try {
      const url = editingMember 
        ? `${import.meta.env.VITE_API_URL}/management/${editingMember._id}`
        : `${import.meta.env.VITE_API_URL}/management`;
      const method = editingMember ? 'PUT' : 'POST';
      
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchMembers();
      }
    } catch {
      alert('Save failed');
    }
  };

  const deleteMember = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/management/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchMembers();
    } catch {
      alert('Delete failed');
    }
  };

  if (loading) return <div className="p-10 text-center font-cinzel">Loading Management Members...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-cinzel text-3xl text-[#001233] mb-1">Management Council</h1>
          <p className="text-gray-400 text-sm">Add, remove or edit society management members</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 bg-[#001233] text-white rounded-xl font-bold shadow-lg hover:bg-[#001a45] transition-all"
        >
          <Plus size={20} />
          <span>Add Member</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#001233] text-white">
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest">Order</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest">Name</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest">Designation</th>
              <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.length > 0 ? (
              members.map((member) => (
                <tr key={member._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="w-8 h-8 bg-gray-100 text-[#001233] rounded-lg flex items-center justify-center text-xs font-bold font-cinzel italic">
                      {member.order}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-[#001233]">{member.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-[#D4A373]/10 text-[#001233] rounded-full text-[11px] font-bold">
                      {member.designation}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(member)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => deleteMember(member._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-gray-400 font-cinzel italic">
                  No management members found. Add your first member to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 bg-[#001233] text-white flex justify-between items-center">
                <h2 className="font-cinzel text-xl">{editingMember ? 'Edit Member' : 'Add New Member'}</h2>
                <button onClick={() => setShowModal(false)}><X size={20} /></button>
              </div>
              
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={form.name} 
                    onChange={(e) => setForm({...form, name: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#D4A373] outline-none transition-all" 
                    placeholder="Enter name"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Designation</label>
                  <input 
                    type="text" 
                    value={form.designation} 
                    onChange={(e) => setForm({...form, designation: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#D4A373] outline-none transition-all" 
                    placeholder="e.g. President, Member, Principal"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Display Order</label>
                  <input 
                    type="number" 
                    value={form.order} 
                    onChange={(e) => setForm({...form, order: parseInt(e.target.value)})} 
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#D4A373] outline-none transition-all" 
                    placeholder="1"
                  />
                  <p className="mt-2 text-[10px] text-gray-400 italic">Lower numbers appear first in the table.</p>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button onClick={() => setShowModal(false)} className="flex-grow py-4 text-sm font-bold text-gray-400 hover:bg-gray-50 rounded-2xl transition-all">Cancel</button>
                  <button onClick={saveMember} className="flex-grow py-4 bg-[#001233] text-white rounded-2xl font-bold shadow-xl shadow-[#001233]/20 hover:bg-[#001a45] transition-all flex items-center justify-center gap-2">
                    <Save size={18} />
                    <span>Save Member</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
