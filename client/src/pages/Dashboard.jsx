import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, FileText, Shield, Share2, Download, AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { fileService } from '../services/fileService';
import { formatFileSize, formatRelativeTime, getStatusColor } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, label, value, gradient, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="card group relative overflow-hidden"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500`} />
    <div className="relative z-10">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} p-2 mb-3`}>
        <Icon size={24} className="text-white" />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-slate-400 mt-0.5">{label}</p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ filesUploaded: 0, threatsFound: 0, filesShared: 0, totalDownloads: 0 });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsData, filesData] = await Promise.all([
        fileService.getDashboardStats(),
        fileService.getFiles(1, 8),
      ]);
      setStats(statsData);
      setFiles(filesData.files);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (mimeType) => {
    if (mimeType?.includes('pdf')) return '📄';
    if (mimeType?.includes('word') || mimeType?.includes('document')) return '📝';
    if (mimeType?.includes('zip')) return '📦';
    if (mimeType?.includes('image')) return '🖼️';
    return '📎';
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full" style={{ animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white">
          Welcome back, <span className="gradient-text">{user?.name}</span>
        </h1>
        <p className="text-slate-400 mt-1">Here's your security overview</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FileText} label="Files Uploaded" value={stats.filesUploaded} gradient="from-cyan-500 to-blue-500" delay={0} />
        <StatCard icon={AlertTriangle} label="Threats Found" value={stats.threatsFound} gradient="from-red-500 to-orange-500" delay={0.1} />
        <StatCard icon={Share2} label="Files Shared" value={stats.filesShared} gradient="from-violet-500 to-purple-500" delay={0.2} />
        <StatCard icon={Download} label="Total Downloads" value={stats.totalDownloads} gradient="from-emerald-500 to-cyan-500" delay={0.3} />
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap gap-3 mb-8"
      >
        <Link to="/upload" className="btn btn-primary">
          <Upload size={18} />
          Upload File
        </Link>
      </motion.div>

      {/* Recent Files */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Files</h2>
          {files.length > 0 && (
            <Link to="/upload" className="btn btn-ghost text-sm text-cyan-400">
              View All <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {files.length === 0 ? (
          <div className="card text-center py-16">
            <div className="w-16 h-16 rounded-2xl glass mx-auto mb-4 flex items-center justify-center">
              <Upload size={28} className="text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No files yet</h3>
            <p className="text-slate-400 mb-6">Upload your first file to get started</p>
            <Link to="/upload" className="btn btn-primary inline-flex">
              <Upload size={16} />
              Upload File
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 pl-4">File</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3">Size</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3">Uploaded</th>
                  <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {files.map((file, i) => (
                  <motion.tr
                    key={file._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3 pl-4">
                      <Link to={`/files/${file._id}`} className="flex items-center gap-3">
                        <span className="text-xl">{getFileIcon(file.mimeType)}</span>
                        <span className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                          {file.originalName}
                        </span>
                      </Link>
                    </td>
                    <td className="py-3 text-sm text-slate-400">{formatFileSize(file.fileSize)}</td>
                    <td className="py-3">
                      <span className={`badge ${getStatusColor(file.virusStatus)}`}>
                        {file.virusStatus === 'scanning' && (
                          <div className="w-2 h-2 rounded-full bg-current" style={{ animation: 'pulse 1s infinite' }} />
                        )}
                        {file.virusStatus}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} />
                        {formatRelativeTime(file.uploadDate)}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <Link to={`/files/${file._id}`} className="btn btn-ghost text-xs text-cyan-400 py-1 px-3">
                        View
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
