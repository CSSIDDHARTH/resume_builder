import {
  ResumeAnalysisResult,
  JobDescriptionDetails,
  RewriteResponse,
  RewriteStyle,
  EnhancedResumeResult,
  EnhancementStylePreset,
} from '../types';

export interface ParseFileResponse {
  text: string;
  wordCount: number;
  charCount: number;
  detectedSections: string[];
  fileType: string;
  originalFileName: string;
}

/**
 * Robust fetch wrapper that gracefully handles JSON, text/HTML responses, and connection errors.
 * Prevents "Unexpected token '<', <!doctype... is not valid JSON" crashes when receiving error pages or non-JSON payloads.
 */
async function safeApiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, options);
  } catch (networkErr: any) {
    console.error(`Network fetch failure for ${url}:`, networkErr);
    throw new Error(
      'Unable to connect to the server. Please check your internet connection or try again in a moment.'
    );
  }

  const contentType = response.headers.get('content-type') || '';
  let responseData: any = null;

  if (contentType.includes('application/json')) {
    try {
      responseData = await response.json();
    } catch (parseErr) {
      console.error('Failed to parse JSON response from server:', parseErr);
      throw new Error(
        `Server returned an invalid JSON response (HTTP ${response.status}). Please retry.`
      );
    }
  } else {
    // Non-JSON response (e.g. HTML error page or plaintext)
    const rawText = await response.text();
    console.warn(`Non-JSON response received from ${url} (HTTP ${response.status}):`, rawText.slice(0, 300));

    if (!response.ok) {
      throw new Error(
        `Server error (${response.status} ${response.statusText || 'Error'}). Please retry in a few seconds.`
      );
    }

    throw new Error('Unexpected response format from server. Please retry your request.');
  }

  if (!response.ok) {
    const errorMsg =
      responseData?.error ||
      responseData?.message ||
      `Request failed with HTTP status ${response.status}`;
    throw new Error(errorMsg);
  }

  return responseData.data as T;
}

export async function parseResumeFile(file: File): Promise<ParseFileResponse> {
  const formData = new FormData();
  formData.append('resumeFile', file);

  return safeApiFetch<ParseFileResponse>('/api/parse-file', {
    method: 'POST',
    body: formData,
  });
}

export async function analyzeResume(
  resumeText: string,
  jobDescription: string,
  resumeName?: string
): Promise<ResumeAnalysisResult> {
  return safeApiFetch<ResumeAnalysisResult>('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      resumeText,
      jobDescription,
      resumeName,
    }),
  });
}

export async function analyzeJobDescription(
  jobDescription: string
): Promise<JobDescriptionDetails> {
  return safeApiFetch<JobDescriptionDetails>('/api/analyze-job', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ jobDescription }),
  });
}

export async function rewriteResumeText(
  originalText: string,
  sectionType: string,
  style: RewriteStyle,
  jobContext?: string
): Promise<RewriteResponse> {
  return safeApiFetch<RewriteResponse>('/api/rewrite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      originalText,
      sectionType,
      style,
      jobContext,
    }),
  });
}

export async function enhanceFullResume(params: {
  resumeText: string;
  jobDescription?: string;
  targetRole?: string;
  targetCompany?: string;
  style?: EnhancementStylePreset;
  analysisContext?: string;
  currentScores?: {
    overall: number;
    atsCompatibility: number;
    skillsMatch: number;
    experienceQuality: number;
    missingKeywordsCount: number;
  };
}): Promise<EnhancedResumeResult> {
  return safeApiFetch<EnhancedResumeResult>('/api/enhance-full-resume', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
}
