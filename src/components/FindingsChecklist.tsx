import React from 'react';
import { CheckCircle2, XCircle, ClipboardList } from 'lucide-react';
import { Finding } from '../types';

interface FindingsChecklistProps {
  findings: Finding[];
}

const formatText = (text: string) => {
  // Convert markdown-style formatting to HTML
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-purple-100 text-purple-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
};

export const FindingsChecklist: React.FC<FindingsChecklistProps> = ({ findings }) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100">
      <div className="flex items-center mb-6">
        <ClipboardList className="w-6 h-6 text-purple-600 mr-3" />
        <h3 className="text-xl font-bold text-gray-900">
          Diagnostic Checklist
        </h3>
      </div>
      
      <div className="space-y-4">
        {findings.map((finding) => (
          <div 
            key={finding.id} 
            className={`p-4 rounded-xl border-l-4 ${
              finding.type === 'success' 
                ? 'bg-emerald-50 border-l-emerald-500 border border-emerald-200' 
                : 'bg-red-50 border-l-red-500 border border-red-200'
            }`}
          >
            <div className="flex items-start space-x-3">
              {finding.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold mb-2 ${
                  finding.type === 'success' ? 'text-emerald-800' : 'text-red-800'
                }`}>
                  {finding.category}
                </div>
                <div 
                  className={`text-sm leading-relaxed ${
                    finding.type === 'success' ? 'text-emerald-700' : 'text-red-700'
                  }`}
                  dangerouslySetInnerHTML={{ __html: formatText(finding.message) }}
                />
                {finding.details && (
                  <div 
                    className="text-xs text-gray-600 mt-2 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatText(finding.details) }}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {findings.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No findings to display</p>
        </div>
      )}
    </div>
  );
};