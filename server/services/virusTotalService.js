const axios = require('axios');
const fs = require('fs');
const path = require('path');

const VT_API_BASE = 'https://www.virustotal.com/api/v3';

/**
 * Scan a file using VirusTotal API v3
 * @param {string} filePath - Absolute path to the file
 * @returns {Object} - { scanId, detected, total, details }
 */
const scanFile = async (filePath) => {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;

  if (!apiKey || apiKey === 'your_virustotal_api_key') {
    console.log('VirusTotal API key not configured. Using mock scan.');
    return mockScan(filePath);
  }

  try {
    // Step 1: Upload file to VirusTotal
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    const FormData = (await import('form-data')).default;
    const formData = new FormData();
    formData.append('file', fileBuffer, fileName);

    const uploadResponse = await axios.post(`${VT_API_BASE}/files`, formData, {
      headers: {
        'x-apikey': apiKey,
        ...formData.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    const analysisId = uploadResponse.data.data.id;

    // Step 2: Poll for results (with timeout)
    const result = await pollForResults(analysisId, apiKey);
    return result;
  } catch (error) {
    console.error('VirusTotal scan error:', error.message);
    // Fallback to mock if API fails
    return mockScan(filePath);
  }
};

/**
 * Poll VirusTotal for analysis results
 */
const pollForResults = async (analysisId, apiKey, maxAttempts = 20) => {
  for (let i = 0; i < maxAttempts; i++) {
    // Wait 15 seconds between polls
    await new Promise((resolve) => setTimeout(resolve, 15000));

    try {
      const response = await axios.get(`${VT_API_BASE}/analyses/${analysisId}`, {
        headers: { 'x-apikey': apiKey },
      });

      const { status } = response.data.data.attributes;

      if (status === 'completed') {
        const { stats, results } = response.data.data.attributes;
        const detected = stats.malicious + stats.suspicious;
        const total =
          stats.malicious +
          stats.suspicious +
          stats.undetected +
          stats.harmless +
          stats.timeout +
          (stats['confirmed-timeout'] || 0) +
          (stats.failure || 0) +
          (stats['type-unsupported'] || 0);

        // Extract flagged engines
        const flaggedEngines = {};
        if (results) {
          Object.entries(results).forEach(([engine, result]) => {
            if (result.category === 'malicious' || result.category === 'suspicious') {
              flaggedEngines[engine] = {
                category: result.category,
                result: result.result,
              };
            }
          });
        }

        return {
          scanId: analysisId,
          detected,
          total,
          details: {
            stats,
            flaggedEngines,
          },
        };
      }
    } catch (error) {
      console.error(`Poll attempt ${i + 1} failed:`, error.message);
    }
  }

  // Timeout fallback
  return {
    scanId: analysisId,
    detected: 0,
    total: 0,
    details: { stats: {}, flaggedEngines: {}, note: 'Scan timed out' },
  };
};

/**
 * Mock scan for development (when API key not available)
 */
const mockScan = (filePath) => {
  const fileName = path.basename(filePath).toLowerCase();

  // Simulate different results based on filename patterns
  const isSuspicious = fileName.includes('suspicious') || fileName.includes('test-malware');
  const isMalicious = fileName.includes('malicious') || fileName.includes('virus');

  const detected = isMalicious ? 12 : isSuspicious ? 2 : 0;
  const total = 68;

  return {
    scanId: `mock-${Date.now()}`,
    detected,
    total,
    details: {
      stats: {
        malicious: isMalicious ? 10 : 0,
        suspicious: isSuspicious ? 2 : 0,
        undetected: total - detected,
        harmless: 0,
        timeout: 0,
      },
      flaggedEngines: isMalicious
        ? {
            'MockEngine-A': { category: 'malicious', result: 'Trojan.Generic' },
            'MockEngine-B': { category: 'malicious', result: 'Win32.Malware' },
          }
        : isSuspicious
        ? {
            'MockEngine-C': { category: 'suspicious', result: 'PUP.Optional' },
          }
        : {},
      note: 'Mock scan — configure VIRUSTOTAL_API_KEY for real scanning',
    },
  };
};

module.exports = { scanFile };
