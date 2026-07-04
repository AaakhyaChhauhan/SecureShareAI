const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  // Virus scan fields
  virusStatus: {
    type: String,
    enum: ['pending', 'scanning', 'safe', 'suspicious', 'malicious'],
    default: 'pending',
  },
  scanId: {
    type: String,
    default: null,
  },
  detectionRatio: {
    detected: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  scanResult: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  // AI summary fields
  aiSummary: {
    riskLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL', null],
      default: null,
    },
    summary: { type: String, default: null },
    recommendation: { type: String, default: null },
  },
  // Organization fields
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null,
  },
  tags: {
    type: [String],
    default: [],
  },
  notifyOnDownload: {
    type: Boolean,
    default: false,
  },
  // Share fields
  shareLink: {
    type: String,
    unique: true,
    sparse: true,
    default: null,
  },
  passwordHash: {
    type: String,
    default: null,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
});

// Index for share link lookups
fileSchema.index({ shareLink: 1 });
// Index for listing user files
fileSchema.index({ ownerId: 1, uploadDate: -1 });

module.exports = mongoose.model('File', fileSchema);
