
import React, { useState, useCallback } from 'react';
import { WorkflowState, Platform, ContentCardData, GenerationResult } from './types';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ContentCard from './components/ContentCard';
import PlatformSelector from './components/PlatformSelector';
import OutputView from './components/OutputView';
import { fetchAndAnalyzeContent, generatePlatformContent, generateImage, generateVideo } from './services/gemini';

const App: React.FC = () => {
  const [state, setState] = useState<WorkflowState>(WorkflowState.INPUT);
  const [isLoading, setIsLoading] = useState(false);
  const [sourceContent, setSourceContent] = useState('');
  const [cardData, setCardData] = useState<ContentCardData | null>(null);
  const [impactSummary, setImpactSummary] = useState('');
  const [fullContent, setFullContent] = useState('');
  const [genResult, setGenResult] = useState<GenerationResult | null>(null);

  const handleInputSubmit = async (input: string) => {
    setIsLoading(true);
    setSourceContent(input);
    try {
      const { card, impact, fullContent } = await fetchAndAnalyzeContent(input);
      setCardData(card);
      setImpactSummary(impact);
      setFullContent(fullContent);
      setState(WorkflowState.DASHBOARD);
    } catch (error) {
      console.error("Error analyzing content:", error);
      // alert("Failed to analyze content. Please check the URL or text and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlatformSelect = async (platform: Platform) => {
    // If Video/Image requested and using high-end models, ensure key selection (for Veo if needed)
    if (platform === Platform.Video) {
      const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio?.openSelectKey();
        // Proceeding anyway as per instructions (assume success)
      }
    }

    setState(WorkflowState.GENERATING);
    setIsLoading(true);
    setGenResult({ platform, content: '' });

    try {
      const promptOrContent = await generatePlatformContent(platform, fullContent);
      
      let finalResult: GenerationResult = { platform, content: promptOrContent };
      
      if (platform === Platform.Image) {
        const imageUrl = await generateImage(promptOrContent);
        finalResult.imageUrl = imageUrl;
      } else if (platform === Platform.Video) {
        const videoUrl = await generateVideo(promptOrContent);
        finalResult.videoUrl = videoUrl;
      }
      
      setGenResult(finalResult);
    } catch (error: any) {
      console.error("Error generating platform content:", error);
      if (error.message?.includes("Requested entity was not found")) {
        alert("API Key error. Please re-select your key.");
        await (window as any).aistudio?.openSelectKey();
      } else {
        alert("Failed to generate content for " + platform);
      }
      setState(WorkflowState.DASHBOARD);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setState(WorkflowState.DASHBOARD);
    setGenResult(null);
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-indigo-500 selection:text-white">
      <Header />
      
      <main>
        {state === WorkflowState.INPUT && (
          <InputSection onSubmit={handleInputSubmit} isLoading={isLoading} />
        )}

        {(state === WorkflowState.DASHBOARD || state === WorkflowState.GENERATING) && cardData && (
          <div className="animate-in fade-in duration-1000 slide-in-from-bottom-4">
            <ContentCard data={cardData} impact={impactSummary} />
            
            {state === WorkflowState.DASHBOARD && (
              <PlatformSelector onSelect={handlePlatformSelect} isGenerating={isLoading} />
            )}

            {state === WorkflowState.GENERATING && genResult && (
              <OutputView 
                platform={genResult.platform} 
                content={genResult.content} 
                mediaUrl={genResult.imageUrl || genResult.videoUrl}
                onReset={handleReset}
                isMedia={genResult.platform === Platform.Image || genResult.platform === Platform.Video}
                isLoading={isLoading}
                sourceTitle={cardData.title}
              />
            )}
          </div>
        )}
      </main>

      {/* Persistent Call to Action */}
      {state !== WorkflowState.INPUT && (
        <button 
          onClick={() => {
            setState(WorkflowState.INPUT);
            setCardData(null);
            setGenResult(null);
          }}
          className="fixed bottom-8 right-8 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 z-50 group"
          title="Start Over"
        >
          <svg className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default App;
