const OpenAI = require('openai');

/**
 * Generate an AI security summary using OpenAI
 * @param {Object} scanResults - { virusStatus, detected, total, details }
 * @param {Object} fileMetadata - { originalName, mimeType, fileSize }
 * @returns {Object} - { riskLevel, summary, recommendation }
 */
const generateSummary = async (scanResults, fileMetadata) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey === 'your_openai_api_key') {
    console.log('OpenAI API key not configured. Using fallback summary.');
    return generateFallbackSummary(scanResults, fileMetadata);
  }

  try {
    const openai = new OpenAI({ apiKey });

    const prompt = buildPrompt(scanResults, fileMetadata);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a cybersecurity analyst AI. Analyze file scan results and provide a concise security assessment. 
Always respond with valid JSON in this exact format:
{
  "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "summary": "2-3 sentence summary of the security analysis",
  "recommendation": "1-2 sentence actionable recommendation"
}`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 300,
      response_format: { type: 'json_object' },
    });

    const response = JSON.parse(completion.choices[0].message.content);

    return {
      riskLevel: response.riskLevel || 'LOW',
      summary: response.summary || 'Analysis complete.',
      recommendation: response.recommendation || 'No specific recommendation.',
    };
  } catch (error) {
    console.error('OpenAI summary generation error:', error.message);
    return generateFallbackSummary(scanResults, fileMetadata);
  }
};

/**
 * Build the analysis prompt for OpenAI
 */
const buildPrompt = (scanResults, fileMetadata) => {
  const fileSizeMB = (fileMetadata.fileSize / (1024 * 1024)).toFixed(2);
  const fileType = fileMetadata.mimeType.split('/').pop().toUpperCase();

  let prompt = `Analyze the following file scan results:

FILE INFORMATION:
- Name: ${fileMetadata.originalName}
- Type: ${fileType}
- Size: ${fileSizeMB} MB

SCAN RESULTS:
- Status: ${scanResults.virusStatus}
- Detection Ratio: ${scanResults.detected} / ${scanResults.total} antivirus engines flagged this file`;

  if (scanResults.details && scanResults.details.flaggedEngines) {
    const flagged = Object.entries(scanResults.details.flaggedEngines);
    if (flagged.length > 0) {
      prompt += '\n\nFLAGGED BY:';
      flagged.forEach(([engine, info]) => {
        prompt += `\n- ${engine}: ${info.result} (${info.category})`;
      });
    }
  }

  prompt += '\n\nProvide your security assessment as JSON.';
  return prompt;
};

/**
 * Fallback summary when OpenAI is unavailable
 */
const generateFallbackSummary = (scanResults, fileMetadata) => {
  const fileType = fileMetadata.mimeType.split('/').pop().toUpperCase();

  if (scanResults.detected === 0) {
    return {
      riskLevel: 'LOW',
      summary: `This ${fileType} file appears safe. No malicious signatures were detected by any of the ${scanResults.total} antivirus engines.`,
      recommendation: 'Safe to share and download.',
    };
  }

  if (scanResults.detected <= 3) {
    return {
      riskLevel: 'MEDIUM',
      summary: `This ${fileType} file was flagged by ${scanResults.detected} out of ${scanResults.total} antivirus engines. This could be a false positive, but caution is advised.`,
      recommendation: 'Review the detection details before sharing. Consider scanning with additional tools.',
    };
  }

  if (scanResults.detected <= 10) {
    return {
      riskLevel: 'HIGH',
      summary: `This ${fileType} file was flagged by ${scanResults.detected} out of ${scanResults.total} antivirus engines. Multiple detections suggest potential malware.`,
      recommendation: 'Do not share this file. Consider deleting it immediately.',
    };
  }

  return {
    riskLevel: 'CRITICAL',
    summary: `This ${fileType} file was flagged by ${scanResults.detected} out of ${scanResults.total} antivirus engines. This is very likely malware.`,
    recommendation: 'Delete this file immediately. Do not share or open it.',
  };
};

module.exports = { generateSummary };
