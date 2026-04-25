import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Mail, Users, Briefcase, Calendar, MapPin, Phone, ExternalLink, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const seedDatabase = async () => {
    try {
      await api.post('/admin/seed');
      fetchUsers();
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-[#14532D] flex items-center gap-3">
              <ShieldCheck className="text-[#16A34A]" size={36} /> Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Manage users and activity across the CareerMind AI platform.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={fetchUsers}
              className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all"
            >
              Refresh
            </button>
            <button 
              onClick={seedDatabase}
              className="bg-[#16A34A] hover:bg-[#15803D] text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-green-200 transition-all"
            >
              Seed Sample Users
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center my-20 gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#16A34A]"></div>
            <p className="text-gray-500 font-medium animate-pulse">Loading secure admin data...</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl shadow-green-100/50 overflow-hidden border border-gray-100"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/80 backdrop-blur-sm">
                  <tr>
                    <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">User Profile</th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Education & Phone</th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Target Role</th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Joined</th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50 text-sm">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="text-gray-200" size={48} />
                          <p className="text-gray-500 font-medium">No users registered yet.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-green-50/30 transition-colors">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0 rounded-2xl bg-gradient-to-br from-[#16A34A] to-[#14532D] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-green-100">
                              {user.fullName ? user.fullName.charAt(0) : '?'}
                            </div>
                            <div className="ml-4">
                              <div className="font-bold text-gray-900 text-base">{user.fullName || 'Unknown'}</div>
                              <div className="text-gray-500 flex items-center gap-1.5 mt-1 font-medium">
                                <Mail size={14} className="text-gray-400" /> {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-gray-800 font-bold flex items-center gap-1.5">
                            <Users size={16} className="text-[#16A34A]" /> {user.college || 'N/A'}
                          </div>
                          <div className="text-gray-500 mt-1 flex items-center gap-2">
                            <span>{user.branch} • {user.yearOfStudy}</span>
                          </div>
                          <div className="text-gray-400 mt-1.5 flex items-center gap-1.5 text-xs font-bold">
                            <Phone size={12} /> {user.phone || 'No phone'}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="px-4 py-1.5 inline-flex text-xs leading-5 font-bold rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1.5">
                            <Briefcase size={14} /> {user.targetRole || 'Not Specified'}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-gray-500 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} /> {new Date(user.joinedAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap font-medium">
                          <div className="flex gap-2">
                            <a 
                              href={`mailto:${user.email}`} 
                              className="bg-[#16A34A] text-white hover:bg-[#14532D] p-2.5 rounded-xl flex items-center justify-center transition-all shadow-md shadow-green-100"
                              title="Email User"
                            >
                              <Mail size={18} />
                            </a>
                            <button 
                              className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 p-2.5 rounded-xl flex items-center justify-center transition-all shadow-sm"
                              title="View Details"
                            >
                              <ExternalLink size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
