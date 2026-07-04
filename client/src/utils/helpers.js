/**
 * Format file size in bytes to human-readable format
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return past.toLocaleDateString();
};

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get file type icon name based on MIME type
 */
export const getFileTypeFromMime = (mimeType) => {
  if (mimeType?.includes('pdf')) return 'pdf';
  if (mimeType?.includes('word') || mimeType?.includes('document')) return 'docx';
  if (mimeType?.includes('zip') || mimeType?.includes('compressed')) return 'zip';
  if (mimeType?.includes('image')) return 'image';
  return 'file';
};

/**
 * Get status color class
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'safe': return 'badge-safe';
    case 'suspicious': return 'badge-suspicious';
    case 'malicious': return 'badge-malicious';
    case 'scanning': return 'badge-scanning';
    case 'pending': return 'badge-pending';
    default: return 'badge-pending';
  }
};

/**
 * Get risk level color
 */
export const getRiskColor = (level) => {
  switch (level) {
    case 'LOW': return '#10b981';
    case 'MEDIUM': return '#f59e0b';
    case 'HIGH': return '#ef4444';
    case 'CRITICAL': return '#dc2626';
    default: return '#94a3b8';
  }
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    return true;
  }
};

/**
 * Trigger file download from blob
 */
export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
