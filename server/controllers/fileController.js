const fs = require('fs');
const path = require('path');
const File = require('../models/File');
const Download = require('../models/Download');
const { scanFile } = require('../services/virusTotalService');
const { generateSummary } = require('../services/aiSummaryService');

// @desc    Upload a file
// @route   POST /api/files/upload
exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const file = await File.create({
      ownerId: req.user.id,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      virusStatus: 'pending',
    });

    // Trigger async virus scan (don't await — let it run in background)
    triggerScanAndSummary(file._id, req.file.path);

    res.status(201).json({
      message: 'File uploaded successfully. Scanning in progress.',
      file: {
        id: file._id,
        originalName: file.originalName,
        fileSize: file.fileSize,
        mimeType: file.mimeType,
        uploadDate: file.uploadDate,
        virusStatus: file.virusStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Async function to scan file and generate AI summary
async function triggerScanAndSummary(fileId, filePath) {
  try {
    // Update status to scanning
    await File.findByIdAndUpdate(fileId, { virusStatus: 'scanning' });

    // Run virus scan
    const scanResults = await scanFile(filePath);

    // Update file with scan results
    const virusStatus =
      scanResults.detected === 0
        ? 'safe'
        : scanResults.detected <= 3
        ? 'suspicious'
        : 'malicious';

    await File.findByIdAndUpdate(fileId, {
      virusStatus,
      scanId: scanResults.scanId,
      detectionRatio: {
        detected: scanResults.detected,
        total: scanResults.total,
      },
      scanResult: scanResults.details,
    });

    // Generate AI summary
    const fileDoc = await File.findById(fileId);
    const aiSummary = await generateSummary(
      {
        virusStatus,
        detected: scanResults.detected,
        total: scanResults.total,
        details: scanResults.details,
      },
      {
        originalName: fileDoc.originalName,
        mimeType: fileDoc.mimeType,
        fileSize: fileDoc.fileSize,
      }
    );

    await File.findByIdAndUpdate(fileId, { aiSummary });

    console.log(`Scan complete for file ${fileId}: ${virusStatus}`);
  } catch (error) {
    console.error(`Scan failed for file ${fileId}:`, error.message);
    // On error, set a fallback status
    await File.findByIdAndUpdate(fileId, {
      virusStatus: 'safe',
      aiSummary: {
        riskLevel: 'LOW',
        summary: 'Scan could not be completed. File has been marked as safe by default.',
        recommendation: 'Consider re-scanning the file if you have concerns.',
      },
    });
  }
}

// @desc    Get all files for current user
// @route   GET /api/files
exports.getFiles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = { ownerId: req.user.id };
    if (req.query.folderId !== undefined) {
      query.folderId = req.query.folderId === 'root' ? null : req.query.folderId;
    }

    const [files, total] = await Promise.all([
      File.find(query)
        .sort({ uploadDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      File.countDocuments(query),
    ]);

    res.json({
      files,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single file by ID (owner only)
// @route   GET /api/files/:id
exports.getFileById = async (req, res, next) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      ownerId: req.user.id,
    }).lean();

    if (!file) {
      return res.status(404).json({ message: 'File not found.' });
    }

    // Get download stats
    const downloadStats = await Download.aggregate([
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

    const stats = downloadStats[0] || {
      totalDownloads: 0,
      lastDownload: null,
      uniqueIPs: [],
    };

    res.json({
      file,
      analytics: {
        totalDownloads: stats.totalDownloads,
        lastDownload: stats.lastDownload,
        uniqueUsers: stats.uniqueIPs ? stats.uniqueIPs.length : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a file (owner only)
// @route   DELETE /api/files/:id
exports.deleteFile = async (req, res, next) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      ownerId: req.user.id,
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found.' });
    }

    // Delete file from disk
    const filePath = path.join(__dirname, '..', 'uploads', file.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete download records
    await Download.deleteMany({ fileId: file._id });

    // Delete file record
    await File.findByIdAndDelete(file._id);

    res.json({ message: 'File deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update file details (tags, folder, notification)
// @route   PUT /api/files/:id
exports.updateFile = async (req, res, next) => {
  try {
    const { tags, folderId, notifyOnDownload } = req.body;
    
    const updateData = {};
    if (tags !== undefined) updateData.tags = tags;
    if (folderId !== undefined) updateData.folderId = folderId;
    if (notifyOnDownload !== undefined) updateData.notifyOnDownload = notifyOnDownload;

    const file = await File.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.id },
      updateData,
      { new: true }
    );

    if (!file) {
      return res.status(404).json({ message: 'File not found.' });
    }

    res.json(file);
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/files/stats/dashboard
exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [totalFiles, threats, sharedFiles, totalDownloads] = await Promise.all([
      File.countDocuments({ ownerId: userId }),
      File.countDocuments({ ownerId: userId, virusStatus: { $in: ['suspicious', 'malicious'] } }),
      File.countDocuments({ ownerId: userId, shareLink: { $ne: null } }),
      Download.countDocuments({
        fileId: { $in: await File.find({ ownerId: userId }).distinct('_id') },
      }),
    ]);

    res.json({
      filesUploaded: totalFiles,
      threatsFound: threats,
      filesShared: sharedFiles,
      totalDownloads,
    });
  } catch (error) {
    next(error);
  }
};
