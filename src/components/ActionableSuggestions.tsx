import React from 'react';
import { Lightbulb, ArrowDown, Target } from 'lucide-react';
import { Suggestion } from '../types';

interface ActionableSuggestionsProps {
  suggestions: Suggestion[];
}

const formatText = (text: string) => {
  // Convert markdown-style formatting to HTML
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-purple-100 text-purple-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
};

export const ActionableSuggestions: React.FC<ActionableSuggestionsProps> = ({ suggestions }) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100">
      <div className="flex items-center mb-6">
        <Lightbulb className="w-6 h-6 text-purple-600 mr-3" />
        <h3 className="text-xl font-bold text-gray-900">
          Actionable Suggestions
        </h3>
      </div>
      
      <div className="space-y-8">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-start space-x-3 mb-4">
              <Target className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-bold text-purple-900 text-lg mb-2">
                  {suggestion.category}
                </h4>
                <div 
                  className="text-sm text-gray-700 leading-relaxed mb-4"
                  dangerouslySetInnerHTML={{ __html: formatText(suggestion.explanation) }}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-xs font-bold text-red-800 uppercase tracking-wide">Instead of</span>
                </div>
                <div 
                  className="text-sm text-red-700 italic leading-relaxed pl-5"
                  dangerouslySetInnerHTML={{ __html: formatText(`"${suggestion.instead_of}"`) }}
                />
              </div>
              
              <div className="flex justify-center">
                <ArrowDown className="w-5 h-5 text-purple-400" />
              </div>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Try this</span>
                </div>
                <div 
                  className="text-sm text-emerald-700 font-medium leading-relaxed pl-5"
                  dangerouslySetInnerHTML={{ __html: formatText(`"${suggestion.try_this}"`) }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {suggestions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No suggestions available</p>
        </div>
      )}
    </div>
  );
};