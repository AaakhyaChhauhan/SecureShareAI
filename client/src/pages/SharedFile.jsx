import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Download, Lock, FileText, Clock, AlertTriangle, CheckCircle2, HardDrive, Brain, Eye, EyeOff } from 'lucide-react';
import { fileService } from '../services/fileService';
import { formatFileSize, formatDate, getRiskColor, downloadBlob } from '../utils/helpers';
import toast from 'react-hot-toast';

const SharedFile = () => {
  const { shareCode } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verified, setVerified] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadSharedFile();
  }, [shareCode]);

  const loadSharedFile = async () => {
    try {
      const data = await fileService.getSharedFile(shareCode);
      setFile(data.file);
      if (!data.file.isPasswordProtected) {
        setVerified(true);
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 404) {
        setError('This share link is invalid or has been removed.');
      } else if (status === 410) {
        setError('This share link has expired.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    try {
      await fileService.verifyPassword(shareCode, password);
      setVerified(true);
      toast.success('Password verified!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Incorrect password');
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fileService.downloadSharedFile(shareCode, password || null);
      const blob = new Blob([response.data]);
      downloadBlob(blob, file.originalName);
      toast.success('Download started!');
    } catch (error) {
      toast.error('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="mesh-gradient" />
        <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full" style={{ animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="mesh-gradient" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card text-center max-w-md w-full py-12">
          <div className="w-16 h-16 rounded-2xl gradient-danger mx-auto mb-4 flex items-center justify-center">
            <AlertTriangle size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Link Unavailable</h1>
          <p className="text-slate-400">{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="mesh-gradient" />

      <div className="absolute top-6 left-6">
        <div className="flex items-center gap-2">
          <div className="gradient-primary p-2 rounded-xl">
            <Shield size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">SecureShare AI</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* File Info Card */}
        <div className="card mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-3xl">
              {file.mimeType?.includes('pdf') ? '📄' :
               file.mimeType?.includes('word') ? '📝' :
               file.mimeType?.includes('zip') ? '📦' :
               file.mimeType?.includes('image') ? '🖼️' : '📎'}
            </div>
            <div>
              <h1 className="text-lg font-bold text-white line-clamp-2">{file.originalName}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                <span className="flex items-center gap-1"><HardDrive size={12} /> {formatFileSize(file.fileSize)}</span>
              </div>
            </div>
          </div>

          {/* Security Status */}
          <div className={`glass rounded-xl p-4 ${
            file.virusStatus === 'safe' ? 'border border-emerald-500/20' :
            file.virusStatus === 'suspicious' ? 'border border-yellow-500/20' :
            'border border-red-500/20'
          }`}>
            <div className="flex items-center gap-3 mb-2">
              {file.virusStatus === 'safe' ? (
                <CheckCircle2 size={20} className="text-emerald-400" />
              ) : (
                <AlertTriangle size={20} className={file.virusStatus === 'suspicious' ? 'text-yellow-400' : 'text-red-400'} />
              )}
              <span className="font-semibold text-white">
                {file.virusStatus === 'safe' ? 'Verified Safe' : file.virusStatus === 'suspicious' ? 'Suspicious' : 'Malicious'}
              </span>
            </div>

            {file.aiSummary?.summary && (
              <p className="text-sm text-slate-300 mb-2">{file.aiSummary.summary}</p>
            )}

            {file.aiSummary?.riskLevel && (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  color: getRiskColor(file.aiSummary.riskLevel),
                  background: `${getRiskColor(file.aiSummary.riskLevel)}15`,
                }}
              >
                Risk: {file.aiSummary.riskLevel}
              </span>
            )}
          </div>

          {/* Expiry */}
          {file.expiresAt && (
            <div className="flex items-center gap-2 mt-3 text-sm text-slate-400">
              <Clock size={14} />
              <span>Expires: {formatDate(file.expiresAt)}</span>
            </div>
          )}
        </div>

        {/* Password Gate or Download */}
        {!verified ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={18} className="text-yellow-400" />
              <h2 className="font-semibold text-white">Password Required</h2>
            </div>
            <p className="text-sm text-slate-400 mb-4">This file is password protected. Enter the password to download.</p>
            <form onSubmit={handleVerifyPassword}>
              <div className="relative mb-4">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pl-9 pr-10"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="shared-file-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button type="submit" className="btn btn-primary w-full py-3" id="verify-password-btn">
                <Lock size={16} /> Verify & Download
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="btn btn-primary w-full py-3.5 text-base"
              id="download-btn"
            >
              {downloading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin 0.8s linear infinite' }} />
                  Downloading...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Download File
                </>
              )}
            </button>
            <p className="text-center text-xs text-slate-500 mt-3">
              {file.downloadCount || 0} downloads
            </p>
          </motion.div>
        )}

        {/* Footer Branding */}
        <div className="text-center mt-8">
          <p className="text-xs text-slate-600">
            Secured by <span className="gradient-text font-semibold">SecureShare AI</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SharedFile;
