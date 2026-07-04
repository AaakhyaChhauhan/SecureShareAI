const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const File = require('../models/File');
const Download = require('../models/Download');

// @desc    Download a shared file
// @route   POST /api/download/:shareCode
exports.downloadFile = async (req, res, next) => {
  try {
    const { password } = req.body;
    const file = await File.findOne({ shareLink: req.params.shareCode }).populate('ownerId', 'email');

    if (!file) {
      return res.status(404).json({ message: 'File not found.' });
    }

    // Check expiry
    if (file.expiresAt && new Date() > file.expiresAt) {
      return res.status(410).json({ message: 'This share link has expired.' });
    }

    // Check password if protected
    if (file.passwordHash) {
      if (!password) {
        return res.status(401).json({ message: 'Password required.' });
      }
      const isMatch = await bcrypt.compare(password, file.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect password.' });
      }
    }

    // Check file exists on disk
    const filePath = path.join(__dirname, '..', 'uploads', file.fileName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server.' });
    }

    // Log download
    await Download.create({
      fileId: file._id,
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
    });

    // Increment download count
    file.downloadCount = (file.downloadCount || 0) + 1;
    await file.save();

    // Send email notification if enabled
    if (file.notifyOnDownload && file.ownerId && file.ownerId.email) {
      const emailService = require('../utils/emailService');
      emailService.sendDownloadNotification(
        file.ownerId.email,
        file.originalName,
        req.ip || req.connection.remoteAddress || 'unknown'
      );
    }

    // Stream file to client
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Length', file.fileSize);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get download analytics for a file
// @route   GET /api/files/:id/analytics
exports.getAnalytics = async (req, res, next) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      ownerId: req.user.id,
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found.' });
    }

    const downloads = await Download.find({ fileId: file._id })
      .sort({ downloadDate: -1 })
      .limit(50)
      .lean();

    const stats = await Download.aggregate([
      { $match: { fileId: file._id } },
      {
        $group: {
          _id: null,
          totalDownloads: { $sum: 1 },
          lastDownload: { $max: '$downloadDate' },
          uniqueIPs: { $addToSet: '$ipAddress' },
        },
      },
    ]);

    const summary = stats[0] || {
      totalDownloads: 0,
      lastDownload: null,
      uniqueIPs: [],
    };

    res.json({
      totalDownloads: summary.totalDownloads,
      lastDownload: summary.lastDownload,
      uniqueUsers: summary.uniqueIPs ? summary.uniqueIPs.length : 0,
      recentDownloads: downloads,
    });
  } catch (error) {
    next(error);
  }
};
