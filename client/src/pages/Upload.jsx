import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload as UploadIcon, FileText, X, CheckCircle2, Shield, AlertTriangle, Brain, Loader2 } from 'lucide-react';
import { fileService } from '../services/fileService';
import { formatFileSize, getRiskColor } from '../utils/helpers';
import toast from 'react-hot-toast';

const Upload = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [scanStatus, setScanStatus] = useState(null); // null | 'scanning' | 'complete'
  const [fileDetails, setFileDetails] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error.code === 'file-too-large') {
        toast.error('File is too large. Maximum size is 50MB.');
      } else if (error.code === 'file-invalid-type') {
        toast.error('File type not supported. Use PDF, DOCX, ZIP, or images.');
      }
      return;
    }
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setUploadResult(null);
      setScanStatus(null);
      setFileDetails(null);
      setUploadProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 50 * 1024 * 1024,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
    },
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setScanStatus('scanning');
    try {
      const result = await fileService.uploadFile(selectedFile, setUploadProgress);
      setUploadResult(result);
      toast.success('File uploaded! Scanning in progress...');

      // Poll for scan completion
      pollScanStatus(result.file.id);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
      setScanStatus(null);
      setUploading(false);
    }
  };

  const pollScanStatus = async (fileId) => {
    const maxAttempts = 40;
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      try {
        const data = await fileService.getFileById(fileId);
        if (data.file.virusStatus !== 'pending' && data.file.virusStatus !== 'scanning') {
          setFileDetails(data.file);
          setScanStatus('complete');
          setUploading(false);
          return;
        }
      } catch (e) {
        // continue polling
      }
    }
    // Timeout — still show what we have
    try {
      const data = await fileService.getFileById(fileId);
      setFileDetails(data.file);
    } catch {}
    setScanStatus('complete');
    setUploading(false);
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploading(false);
    setUploadResult(null);
    setScanStatus(null);
    setFileDetails(null);
  };

  const getFileIcon = (name) => {
    const ext = name?.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return '📄';
    if (ext === 'docx') return '📝';
    if (ext === 'zip') return '📦';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return '🖼️';
    return '📎';
  };

  return (
    <div className="page-container max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white mb-2">Upload File</h1>
        <p className="text-slate-400 mb-8">Upload a file to scan for malware and get AI security insights</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!uploadResult ? (
          <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`card cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-cyan-500 bg-cyan-500/5 glow-primary'
                  : selectedFile
                  ? 'border-emerald-500/30'
                  : 'border-dashed border-slate-600 hover:border-slate-500'
              }`}
              style={{ padding: '3rem 2rem', borderStyle: selectedFile ? 'solid' : 'dashed' }}
              id="file-dropzone"
            >
              <input {...getInputProps()} id="file-input" />

              {selectedFile ? (
                <div className="text-center">
                  <div className="text-5xl mb-4">{getFileIcon(selectedFile.name)}</div>
                  <p className="text-lg font-semibold text-white mb-1">{selectedFile.name}</p>
                  <p className="text-sm text-slate-400 mb-4">{formatFileSize(selectedFile.size)}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); resetUpload(); }}
                    className="btn btn-ghost text-sm text-slate-400"
                  >
                    <X size={16} /> Remove
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all ${
                    isDragActive ? 'gradient-primary scale-110' : 'glass'
                  }`}>
                    <UploadIcon size={28} className={isDragActive ? 'text-white' : 'text-slate-400'} />
                  </div>
                  <p className="text-lg font-medium text-white mb-1">
                    {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
                  </p>
                  <p className="text-sm text-slate-400 mb-4">or click to browse</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['PDF', 'DOCX', 'ZIP', 'PNG', 'JPG'].map((type) => (
                      <span key={type} className="text-xs px-2 py-1 rounded-md bg-white/5 text-slate-500 border border-white/5">
                        {type}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 mt-3">Max file size: 50MB</p>
                </div>
              )}
            </div>

            {/* Upload Button */}
            {selectedFile && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="btn btn-primary w-full py-3 text-base"
                  id="upload-submit"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                      Uploading... {uploadProgress}%
                    </>
                  ) : (
                    <>
                      <Shield size={18} />
                      Upload & Scan
                    </>
                  )}
                </button>

                {/* Progress bar */}
                {uploading && (
                  <div className="mt-3 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full gradient-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Scan Progress */}
            {scanStatus === 'scanning' && (
              <div className="card text-center py-12">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-pulse-glow" />
                  <div className="absolute inset-2 rounded-full border border-cyan-500/30" style={{ animation: 'spin 3s linear infinite' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Shield size={32} className="text-cyan-400" />
                  </div>
                  {/* Scan line */}
                  <div
                    className="absolute left-0 right-0 h-0.5 bg-cyan-400/60"
                    style={{ animation: 'scanLine 2s ease-in-out infinite' }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Scanning Your File...</h3>
                <p className="text-sm text-slate-400 mb-1">{uploadResult.file.originalName}</p>
                <p className="text-xs text-slate-500">Checking against antivirus engines and generating AI analysis</p>

                <div className="flex justify-center gap-6 mt-8">
                  {['Uploaded', 'Scanning', 'Analyzing'].map((stage, i) => (
                    <div key={stage} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${i <= 1 ? 'bg-cyan-400' : 'bg-slate-600'}`}
                        style={i === 1 ? { animation: 'pulse 1s infinite' } : {}}
                      />
                      <span className={`text-xs ${i <= 1 ? 'text-cyan-400' : 'text-slate-500'}`}>{stage}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scan Complete */}
            {scanStatus === 'complete' && fileDetails && (
              <div className="space-y-4">
                {/* Status Card */}
                <div className={`card border ${
                  fileDetails.virusStatus === 'safe' ? 'border-emerald-500/30' :
                  fileDetails.virusStatus === 'suspicious' ? 'border-yellow-500/30' :
                  'border-red-500/30'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      fileDetails.virusStatus === 'safe' ? 'gradient-safe' :
                      fileDetails.virusStatus === 'suspicious' ? 'gradient-warning' :
                      'gradient-danger'
                    }`}>
                      {fileDetails.virusStatus === 'safe' ? (
                        <CheckCircle2 size={28} className="text-white" />
                      ) : (
                        <AlertTriangle size={28} className="text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {fileDetails.virusStatus === 'safe' ? 'File is Safe' :
                         fileDetails.virusStatus === 'suspicious' ? 'Suspicious File' :
                         'Malicious File Detected'}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {fileDetails.detectionRatio?.detected || 0} / {fileDetails.detectionRatio?.total || 68} antivirus engines flagged this file
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Summary */}
                {fileDetails.aiSummary?.summary && (
                  <div className="card">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain size={18} className="text-violet-400" />
                      <h4 className="font-semibold text-white">AI Security Summary</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Risk Level:</span>
                        <span
                          className="text-sm font-bold px-2.5 py-0.5 rounded-full"
                          style={{
                            color: getRiskColor(fileDetails.aiSummary.riskLevel),
                            background: `${getRiskColor(fileDetails.aiSummary.riskLevel)}20`,
                          }}
                        >
                          {fileDetails.aiSummary.riskLevel}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">{fileDetails.aiSummary.summary}</p>
                      <div className="glass rounded-lg p-3">
                        <p className="text-xs text-slate-400 mb-1">Recommendation</p>
                        <p className="text-sm text-white">{fileDetails.aiSummary.recommendation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/files/${fileDetails._id}`)}
                    className="btn btn-primary flex-1"
                  >
                    View Details
                  </button>
                  <button onClick={resetUpload} className="btn btn-secondary">
                    Upload Another
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Upload;
