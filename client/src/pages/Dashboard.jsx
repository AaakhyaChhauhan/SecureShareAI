import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, FileText, Shield, Share2, Download, AlertTriangle, Clock, ArrowRight, Folder, FolderPlus, ChevronRight } from 'lucide-react';
import { fileService } from '../services/fileService';
import { folderService } from '../services/folderService';
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
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null); // null means root
  const [loading, setLoading] = useState(true);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  useEffect(() => {
    loadDashboard();
  }, [currentFolder]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      // If we're at root, load stats and folders
      if (!currentFolder) {
        const [statsData, foldersData, filesData] = await Promise.all([
          fileService.getDashboardStats(),
          folderService.getFolders(),
          fileService.getFiles(1, 20, 'root'), // Fetch root files
        ]);
        setStats(statsData);
        setFolders(foldersData);
        setFiles(filesData.files);
      } else {
        // If inside a folder, only fetch files for that folder
        const filesData = await fileService.getFiles(1, 20, currentFolder._id);
        setFiles(filesData.files);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      await folderService.createFolder(newFolderName);
      toast.success('Folder created!');
      setNewFolderName('');
      setShowFolderModal(false);
      loadDashboard();
    } catch (error) {
      toast.error('Failed to create folder');
    }
  };

  const getFileIcon = (mimeType) => {
    if (mimeType?.includes('pdf')) return '📄';
    if (mimeType?.includes('word') || mimeType?.includes('document')) return '📝';
    if (mimeType?.includes('zip')) return '📦';
    if (mimeType?.includes('image')) return '🖼️';
    return '📎';
  };

  if (loading && !files.length && !folders.length) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full" style={{ animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Welcome */}
      {!currentFolder && (
        <>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-2xl font-bold text-white">
              Welcome back, <span className="gradient-text">{user?.name}</span>
            </h1>
            <p className="text-slate-400 mt-1">Here's your security overview</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={FileText} label="Files Uploaded" value={stats.filesUploaded} gradient="from-cyan-500 to-blue-500" delay={0} />
            <StatCard icon={AlertTriangle} label="Threats Found" value={stats.threatsFound} gradient="from-red-500 to-orange-500" delay={0.1} />
            <StatCard icon={Share2} label="Files Shared" value={stats.filesShared} gradient="from-violet-500 to-purple-500" delay={0.2} />
            <StatCard icon={Download} label="Total Downloads" value={stats.totalDownloads} gradient="from-emerald-500 to-cyan-500" delay={0.3} />
          </div>
        </>
      )}

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => setCurrentFolder(null)} className="text-slate-400 hover:text-white transition-colors">
          Home
        </button>
        {currentFolder && (
          <>
            <ChevronRight size={16} className="text-slate-600" />
            <span className="text-white font-medium">{currentFolder.name}</span>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-3 mb-8">
        <Link to="/upload" className="btn btn-primary">
          <Upload size={18} /> Upload File
        </Link>
        {!currentFolder && (
          <button onClick={() => setShowFolderModal(true)} className="btn btn-secondary">
            <FolderPlus size={18} /> New Folder
          </button>
        )}
      </motion.div>

      {/* Folders (only show at root) */}
      {!currentFolder && folders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Folders</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {folders.map(folder => (
              <button 
                key={folder._id}
                onClick={() => setCurrentFolder(folder)}
                className="card flex items-center gap-3 p-4 hover:border-cyan-500/50 hover:bg-white/5 transition-all cursor-pointer"
              >
                <Folder className="text-cyan-400" size={24} />
                <span className="text-white font-medium truncate">{folder.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Files List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h2 className="text-lg font-semibold text-white mb-4">Files {currentFolder ? `in ${currentFolder.name}` : ''}</h2>

        {files.length === 0 ? (
          <div className="card text-center py-16">
            <div className="w-16 h-16 rounded-2xl glass mx-auto mb-4 flex items-center justify-center">
              <Upload size={28} className="text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No files here</h3>
            <p className="text-slate-400 mb-6">Upload a file to this location</p>
            <Link to="/upload" className="btn btn-primary inline-flex">
              <Upload size={16} /> Upload File
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 pl-4">File</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3">Tags</th>
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
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3 pl-4">
                      <Link to={`/files/${file._id}`} className="flex items-center gap-3">
                        <span className="text-xl">{getFileIcon(file.mimeType)}</span>
                        <div>
                          <span className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                            {file.originalName}
                          </span>
                          <span className="text-xs text-slate-500 block">{formatFileSize(file.fileSize)}</span>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1 flex-wrap max-w-[150px]">
                        {file.tags && file.tags.map(tag => (
                          <span key={tag} className="text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-slate-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`badge ${getStatusColor(file.virusStatus)}`}>
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

      {/* Create Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card max-w-sm w-full">
            <h3 className="text-xl font-semibold text-white mb-4">Create New Folder</h3>
            <form onSubmit={handleCreateFolder}>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder Name"
                className="input mb-4"
                autoFocus
              />
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowFolderModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={!newFolderName.trim()}>Create</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
