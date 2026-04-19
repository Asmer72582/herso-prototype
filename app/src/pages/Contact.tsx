import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-cinzel text-3xl text-[#001233] mb-2">Contact Us</h1>
          <div className="w-24 h-0.5 bg-[#D4A373] mb-8" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-[#001233] rounded-lg p-6 text-[#FDF6E3]">
                <h2 className="font-cinzel text-lg text-[#D4A373] mb-4">Get in Touch</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-[#D4A373] flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-semibold mb-1">Address</p>
                      <p className="text-sm text-[#FDF6E3]/80">
                        NL6/5/13, Sector – 10,<br />
                        Nerul, Navi Mumbai-400706,<br />
                        Maharashtra, India.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-[#D4A373] flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-semibold mb-1">Phone</p>
                      <p className="text-sm text-[#FDF6E3]/80">+91 9322530571</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail size={18} className="text-[#D4A373] flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-semibold mb-1">Email</p>
                      <p className="text-sm text-[#FDF6E3]/80">sudhirnikam@gmail.com</p>
                      <p className="text-sm text-[#FDF6E3]/80">hersomumbai@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="font-cinzel text-lg text-[#001233] mb-3">Correspondence Address</h3>
                <p className="text-sm text-[#6C757D] leading-relaxed">
                  Dr. Sudhir Nikam<br />
                  A-2, 503, Punyoday Park,<br />
                  Near Don Bosco School,<br />
                  Adharwadi, Kalyan (West),<br />
                  Thane-421 301
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="font-cinzel text-lg text-[#001233] mb-4">Send a Message</h2>
              
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-green-700 font-medium">Thank you for your message!</p>
                  <p className="text-sm text-green-600 mt-1">We will get back to you soon.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-3 text-sm text-[#D4A373] hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#6C757D] mb-1">Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#D4A373] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#6C757D] mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#D4A373] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#6C757D] mb-1">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#D4A373] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#6C757D] mb-1">Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#D4A373] text-sm"
                    />
                  </div>
                  <button type="submit" className="btn-gold w-full flex items-center justify-center gap-2">
                    <Send size={14} />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
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
