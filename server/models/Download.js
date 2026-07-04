const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    required: true,
    index: true,
  },
  downloadDate: {
    type: Date,
    default: Date.now,
  },
  ipAddress: {
    type: String,
    default: 'unknown',
  },
  userAgent: {
    type: String,
    default: 'unknown',
  },
});

downloadSchema.index({ fileId: 1, downloadDate: -1 });

module.exports = mongoose.model('Download', downloadSchema);
