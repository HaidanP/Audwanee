import { AnalysisResult, UploadedFile } from '../types';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const analyzePrompt = async (
  promptText: string,
  files: UploadedFile[]
): Promise<AnalysisResult> => {
  const systemPrompt = `You are an expert educational consultant specializing in assignment design and AI-resilient pedagogy. Your task is to analyze assignment prompts for their vulnerability to AI completion.

Analyze the assignment prompt for these key vulnerabilities:

1. **Generic Verbs**: Look for low-effort verbs like "summarize," "describe," "explain," "compare and contrast," "list," "define," "outline," etc.

2. **Lack of Specific Constraints**: Check if the prompt references:
   - Specific course readings with page numbers
   - In-class lecture content or discussions
   - Unique datasets provided in the course
   - Course-specific terminology or frameworks

3. **Absence of Process Requirements**: Look for process-oriented elements like:
   - Draft submissions or peer review
   - Annotated bibliographies or research logs
   - Lab notes or field observations
   - Reflection journals or learning portfolios
   - In-class presentations or discussions

4. **Impersonal Framing**: Check if the prompt asks for:
   - Personal connection or reflection
   - Application to student's life or community
   - Individual perspective or experience
   - Creative or original thinking

Return your analysis as a JSON object with this exact structure:
{
  "overallRisk": "low" | "medium" | "high",
  "riskScore": number (0-100),
  "findings": [
    {
      "id": string,
      "type": "warning" | "success",
      "category": string,
      "message": string,
      "details": string (optional)
    }
  ],
  "suggestions": [
    {
      "id": string,
      "category": string,
      "issue": string,
      "instead_of": string,
      "try_this": string,
      "explanation": string
    }
  ],
  "summary": string
}

Be constructive and specific in your feedback. Focus on actionable improvements rather than criticism.`;

  const content: any[] = [
    {
      type: "text",
      text: `Please analyze this assignment prompt for AI resilience:\n\n${promptText}`
    }
  ];

  // Add files to the content array
  files.forEach((file) => {
    if (file.type.startsWith('image/')) {
      content.push({
        type: "image_url",
        image_url: {
          url: file.data
        }
      });
    } else {
      // For non-image files, we'll include them as text context
      content.push({
        type: "text",
        text: `Attached file: ${file.name} (${file.type})`
      });
    }
  });

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Audwanee - AI Assignment Analyzer',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: content
          }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0]?.message?.content;
    
    if (!analysisText) {
      throw new Error('No analysis content received');
    }

    // Extract JSON from the response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse analysis results');
    }

    const analysisResult = JSON.parse(jsonMatch[0]) as AnalysisResult;
    
    // Validate the structure
    if (!analysisResult.overallRisk || !analysisResult.findings || !analysisResult.suggestions) {
      throw new Error('Invalid analysis result structure');
    }

    return analysisResult;
  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error('Failed to analyze prompt. Please try again.');
  }
};