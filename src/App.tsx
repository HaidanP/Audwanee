import React, { useState } from 'react';
import { GraduationCap, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { RainAnimation } from './components/RainAnimation';
import { VulnerabilityMeter } from './components/VulnerabilityMeter';
import { FindingsChecklist } from './components/FindingsChecklist';
import { ActionableSuggestions } from './components/ActionableSuggestions';
import { analyzePrompt } from './services/analysisService';
import { AnalysisResult, UploadedFile } from './types';

function App() {
  const [promptText, setPromptText] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const samplePrompt = `How did internal divisions within the Cherokee Nation shape the events and outcomes of the 1838 removal journey known as the Trail of Tears?

In your response, be sure to:

Identify the major factions involved and their leaders.
Explain how each faction viewed the Treaty of New Echota.
Describe how these divisions impacted the logistics and experience of removal (e.g., treatment, funding, leadership, route, outcomes).`;

  const loadSampleAssignment = () => {
    setPromptText(samplePrompt);
    
    // Create a sample file object for the PDF
    const sampleFile: UploadedFile = {
      id: 'sample-cherokee-pdf',
      name: 'CherokeeParty Moves West.pdf',
      type: 'application/pdf',
      size: 1024000, // Approximate size
      data: '/CherokeeParty Moves West.pdf' // Reference to the file in public folder
    };
    
    setFiles([sampleFile]);
    setAnalysisResult(null);
    setError(null);
    
    // Trigger textarea resize after state update
    setTimeout(() => {
      const textarea = document.getElementById('prompt') as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
      }
    }, 0);
  };
  const handleAnalyze = async () => {
    if (!promptText.trim()) {
      setError('Please enter an assignment prompt to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzePrompt(promptText, files);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setPromptText('');
    setFiles([]);
    setAnalysisResult(null);
    setError(null);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptText(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Realistic Rain Animation */}
      <RainAnimation />

      {/* Header */}
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-8 bg-[#35063e] py-12 px-8 shadow-xl">
          {/* Mobile Logo - Above Title */}
          <div className="block md:hidden mb-6">
            <div className="w-24 h-24 mx-auto flex items-center justify-center">
              <img 
                src="/SEWANEETIGER.png" 
                alt="Audwanee Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error('Logo failed to load:', e);
                  e.currentTarget.style.display = 'none';
                }}
                onLoad={() => console.log('Logo loaded successfully')}
              />
            </div>
          </div>
          
          {/* Desktop Logo - Next to Title */}
          <div className="hidden md:flex items-center justify-center mb-4">
            <div className="w-16 h-16 lg:w-20 lg:h-20 mr-2 flex items-center justify-center">
              <img 
                src="/SEWANEETIGER.png" 
                alt="Audwanee Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error('Logo failed to load:', e);
                  e.currentTarget.style.display = 'none';
                }}
                onLoad={() => console.log('Logo loaded successfully')}
              />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              <span className="font-logo tracking-wider">Audwanee</span>
            </h1>
          </div>
          
          {/* Mobile Title - Below Logo */}
          <div className="block md:hidden mb-4">
            <h1 className="text-4xl font-bold text-white">
              <span className="font-logo tracking-wider">Audwanee</span>
            </h1>
          </div>
          
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
            Analyze your assignment prompts for AI resilience and get actionable suggestions 
            to create more engaging, process-based learning experiences.
          </p>
        </div>

        <div>
        {/* Main Input Section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100 p-10 mb-6">
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <label htmlFor="prompt" className="text-xl font-semibold text-gray-800">
                  Assignment Prompt
                </label>
                <button
                  onClick={loadSampleAssignment}
                  disabled={isAnalyzing}
                  className="inline-flex items-center px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
                >
                  Test with an example
                </button>
              </div>
              <textarea
                id="prompt"
                value={promptText}
                onChange={handleTextareaChange}
                disabled={isAnalyzing}
                className="w-full min-h-72 px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none overflow-hidden transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500 text-xl leading-relaxed"
                placeholder="Enter your complete assignment prompt here. Include all instructions, requirements, rubrics, and supporting materials that students will receive..."
                style={{ height: 'auto' }}
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                Supporting Materials (Optional) {files.length > 0 && `— ${files.length}`}
              </label>
              <FileUpload
                files={files}
                onFilesChange={setFiles}
                disabled={isAnalyzing}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start space-x-4">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-base font-semibold text-red-800">Analysis Error</h3>
                  <p className="text-sm text-red-700 mt-2 leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            <div className="flex space-x-6 pt-4">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !promptText.trim()}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Assignment'
                )}
              </button>
              
              {(analysisResult || error) && (
                <button
                  onClick={handleReset}
                  disabled={isAnalyzing}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {analysisResult && (
          <div className="space-y-10 animate-fade-in">
            {/* Vulnerability Meter */}
            <div className="relative z-10">
              <VulnerabilityMeter
              risk={analysisResult.overallRisk}
              score={analysisResult.riskScore}
              />
            </div>

            {/* Summary */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                Analysis Summary
              </h3>
              <p className="text-gray-700 leading-relaxed text-base">
                {analysisResult.summary}
              </p>
            </div>

            {/* Findings and Suggestions */}
            <div className="flex flex-col xl:flex-row gap-10 items-start">
              <div className="w-full xl:w-1/2">
                <FindingsChecklist findings={analysisResult.findings} />
              </div>
              <div className="w-full xl:w-1/2">
                <ActionableSuggestions suggestions={analysisResult.suggestions} />
              </div>
            </div>
          </div>
        )}

        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;