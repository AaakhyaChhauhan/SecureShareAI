import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Shield, Brain, Share2, Download, Trash2, Copy, CheckCircle2,
  AlertTriangle, Clock, FileText, Link2, Lock, Eye, Calendar, HardDrive
} from 'lucide-react';
import { fileService } from '../services/fileService';
import { formatFileSize, formatDate, formatRelativeTime, getRiskColor, getStatusColor, copyToClipboard } from '../utils/helpers';
import toast from 'react-hot-toast';

const FileDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareOptions, setShareOptions] = useState({ password: '', expiresIn: '1d' });
  const [sharing, setSharing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadFile();
  }, [id]);

  const loadFile = async () => {
    try {
      const data = await fileService.getFileById(id);
      setFile(data.file);
      setAnalytics(data.analytics);
    } catch (error) {
      toast.error('File not found');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      const result = await fileService.createShareLink(file._id, {
        password: shareOptions.password || undefined,
        expiresIn: shareOptions.expiresIn,
      });
      await loadFile();
      toast.success('Share link created!');
      copyToClipboard(result.shareUrl);
      toast.success('Link copied to clipboard!');
      setShowShareModal(false);
    } catch (error) {
      toast.error('Failed to create share link');
    } finally {
      setSharing(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/share/${file.shareLink}`;
    copyToClipboard(url);
    toast.success('Link copied!');
  };

  const handleRemoveShare = async () => {
    try {
      await fileService.removeShareLink(file._id);
      await loadFile();
      toast.success('Share link removed');
    } catch (error) {
      toast.error('Failed to remove share link');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    setDeleting(true);
    try {
      await fileService.deleteFile(file._id);
      toast.success('File deleted');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete file');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full" style={{ animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!file) return null;

  const detectionPercent = file.detectionRatio?.total > 0
    ? Math.round((file.detectionRatio.detected / file.detectionRatio.total) * 100)
    : 0;

  return (
    <div className="page-container max-w-4xl mx-auto">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => navigate('/dashboard')}
        className="btn btn-ghost mb-6 text-slate-400"
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </motion.button>

      {/* File Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-3xl">
              {file.mimeType?.includes('pdf') ? '📄' :
               file.mimeType?.includes('word') ? '📝' :
               file.mimeType?.includes('zip') ? '📦' :
               file.mimeType?.includes('image') ? '🖼️' : '📎'}
            </div>
            <div>
              <h1 className="text-lg font-bold text-white line-clamp-1">{file.originalName}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-400">
                <span className="flex items-center gap-1"><HardDrive size={13} /> {formatFileSize(file.fileSize)}</span>
                <span className="flex items-center gap-1"><Calendar size={13} /> {formatDate(file.uploadDate)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowShareModal(true)} className="btn btn-secondary text-sm">
              <Share2 size={16} /> Share
            </button>
            <button onClick={handleDelete} disabled={deleting} className="btn btn-ghost text-sm text-red-400 hover:text-red-300">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Scan Results */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-cyan-400" />
            <h2 className="font-semibold text-white">Scan Results</h2>
          </div>

          <div className="flex items-center justify-center mb-6">
            {/* Circular detection ratio */}
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={file.virusStatus === 'safe' ? '#10b981' : file.virusStatus === 'suspicious' ? '#f59e0b' : '#ef4444'}
                  strokeWidth="8"
                  strokeDasharray={`${(1 - detectionPercent / 100) * 264} 264`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{file.detectionRatio?.detected || 0}</span>
                <span className="text-xs text-slate-400">/ {file.detectionRatio?.total || 68}</span>
              </div>
            </div>
          </div>

          <div className="text-center mb-4">
            <span className={`badge text-base px-4 py-1.5 ${getStatusColor(file.virusStatus)}`}>
              {file.virusStatus === 'safe' && <CheckCircle2 size={14} />}
              {(file.virusStatus === 'suspicious' || file.virusStatus === 'malicious') && <AlertTriangle size={14} />}
              {file.virusStatus?.toUpperCase()}
            </span>
          </div>

          <p className="text-sm text-slate-400 text-center">
            {file.virusStatus === 'safe'
              ? 'No threats detected by any antivirus engine.'
              : `${file.detectionRatio?.detected} engine(s) flagged this file as potentially dangerous.`}
          </p>
        </motion.div>

        {/* AI Summary */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
          <div className="flex items-center gap-2 mb-4">
            <Brain size={18} className="text-violet-400" />
            <h2 className="font-semibold text-white">AI Security Summary</h2>
          </div>

          {file.aiSummary?.summary ? (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Risk Level</span>
                <div className="mt-1">
                  <span
                    className="text-lg font-bold px-3 py-1 rounded-lg inline-block"
                    style={{
                      color: getRiskColor(file.aiSummary.riskLevel),
                      background: `${getRiskColor(file.aiSummary.riskLevel)}15`,
                      border: `1px solid ${getRiskColor(file.aiSummary.riskLevel)}30`,
                    }}
                  >
                    {file.aiSummary.riskLevel}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Analysis</span>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">{file.aiSummary.summary}</p>
              </div>

              <div className="glass rounded-lg p-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Recommendation</span>
                <p className="text-sm text-white mt-1">{file.aiSummary.recommendation}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-10 h-10 rounded-xl glass mx-auto mb-3 flex items-center justify-center">
                <Brain size={20} className="text-slate-500" />
              </div>
              <p className="text-sm text-slate-400">AI summary is being generated...</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Share Link Info */}
      {file.shareLink && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card mt-4">
          <div className="flex items-center gap-2 mb-4">
            <Link2 size={18} className="text-cyan-400" />
            <h2 className="font-semibold text-white">Share Link</h2>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 glass rounded-lg px-3 py-2 text-sm text-slate-300 overflow-hidden">
              <span className="line-clamp-1">{window.location.origin}/share/{file.shareLink}</span>
            </div>
            <button onClick={handleCopyLink} className="btn btn-secondary text-sm py-2">
              <Copy size={14} /> Copy
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            {file.passwordHash && (
              <span className="flex items-center gap-1"><Lock size={13} /> Password Protected</span>
            )}
            {file.expiresAt && (
              <span className="flex items-center gap-1"><Clock size={13} /> Expires {formatRelativeTime(file.expiresAt)}</span>
            )}
            <span className="flex items-center gap-1"><Download size={13} /> {file.downloadCount || 0} downloads</span>
          </div>
          <button onClick={handleRemoveShare} className="btn btn-ghost text-xs text-red-400 mt-3">
            Remove Share Link
          </button>
        </motion.div>
      )}

      {/* Download Analytics */}
      {analytics && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card mt-4">
          <div className="flex items-center gap-2 mb-4">
            <Eye size={18} className="text-emerald-400" />
            <h2 className="font-semibold text-white">Download Analytics</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="glass rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-white">{analytics.totalDownloads}</p>
              <p className="text-xs text-slate-400 mt-1">Downloads</p>
            </div>
            <div className="glass rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-white">{analytics.uniqueUsers}</p>
              <p className="text-xs text-slate-400 mt-1">Unique Users</p>
            </div>
            <div className="glass rounded-lg p-3 text-center">
              <p className="text-sm font-medium text-white">{analytics.lastDownload ? formatRelativeTime(analytics.lastDownload) : 'Never'}</p>
              <p className="text-xs text-slate-400 mt-1">Last Download</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowShareModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card relative z-10 w-full max-w-md p-6"
            style={{ background: 'rgba(15, 23, 42, 0.95)' }}
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Share2 size={20} className="text-cyan-400" />
              Create Share Link
            </h3>

            <div className="space-y-4">
              {/* Expiry */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Link Expires In</label>
                <select
                  className="input"
                  value={shareOptions.expiresIn}
                  onChange={(e) => setShareOptions({ ...shareOptions, expiresIn: e.target.value })}
                  id="share-expiry"
                >
                  <option value="1h">1 Hour</option>
                  <option value="1d">1 Day</option>
                  <option value="7d">7 Days</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password Protection <span className="text-slate-500">(optional)</span>
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    className="input pl-9"
                    placeholder="Enter password"
                    value={shareOptions.password}
                    onChange={(e) => setShareOptions({ ...shareOptions, password: e.target.value })}
                    id="share-password"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={handleShare} disabled={sharing} className="btn btn-primary flex-1">
                  {sharing ? 'Creating...' : 'Create Link'}
                </button>
                <button onClick={() => setShowShareModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FileDetails;
