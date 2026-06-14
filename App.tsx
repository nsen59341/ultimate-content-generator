
import React, { useState, useCallback, useEffect } from 'react';
import { WorkflowState, Platform, ContentCardData, GenerationResult, UserPreferences, DEFAULT_PREFERENCES, HistoryItem } from './types';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ContentCard from './components/ContentCard';
import PlatformSelector from './components/PlatformSelector';
import PreferencesSection from './components/PreferencesSection';
import OutputView from './components/OutputView';
import HistoryPanel from './components/HistoryPanel';
import { fetchAndAnalyzeContent, generatePlatformContent, generateImage, generateVideo, fetchHistory, saveHistory, deleteHistoryItem } from './services/gemini';

const App: React.FC = () => {
  const [state, setState] = useState<WorkflowState>(WorkflowState.INPUT);
  const [isLoading, setIsLoading] = useState(false);
  const [sourceContent, setSourceContent] = useState('');
  const [cardData, setCardData] = useState<ContentCardData | null>(null);
  const [impactSummary, setImpactSummary] = useState('');
  const [fullContent, setFullContent] = useState('');
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [genResult, setGenResult] = useState<GenerationResult | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeHistoryItem, setActiveHistoryItem] = useState<HistoryItem | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load history on mount + sync localStorage to server
  useEffect(() => {
    const initHistory = async () => {
      try {
        let serverHistory = await fetchHistory();
        const localStr = localStorage.getItem('repurposer_history');
        let localHistory: HistoryItem[] = [];
        try {
          if (localStr) localHistory = JSON.parse(localStr);
        } catch (e) {
          console.error("Local history JSON parse error:", e);
        }

        // Sync local-only items to server
        if (localHistory.length > 0) {
          const serverIds = new Set(serverHistory.map(h => h.id));
          let syncedCount = 0;
          for (const item of localHistory) {
            if (!serverIds.has(item.id)) {
              await saveHistory(item);
              syncedCount++;
            }
          }
          if (syncedCount > 0) {
            serverHistory = await fetchHistory();
          }
        }

        setHistory(serverHistory);
        localStorage.setItem('repurposer_history', JSON.stringify(serverHistory));
      } catch (error) {
        console.error("Failed to initialize history logs:", error);
      }
    };
    initHistory();
  }, []);

  const handleSaveOrUpdateHistory = async (updatedItem: HistoryItem) => {
    try {
      await saveHistory(updatedItem);
      
      setHistory(prev => {
        const filtered = prev.filter(h => h.id !== updatedItem.id);
        const newHist = [updatedItem, ...filtered];
        localStorage.setItem('repurposer_history', JSON.stringify(newHist));
        return newHist;
      });
    } catch (err) {
      console.error("Failed to update history:", err);
    }
  };

  const handleInputSubmit = async (input: string) => {
    setIsLoading(true);
    setSourceContent(input);
    try {
      const { card, impact, fullContent } = await fetchAndAnalyzeContent(input);
      setCardData(card);
      setImpactSummary(impact);
      setFullContent(fullContent);

      // Create a persistent database history log
      const newId = `item_${Date.now()}`;
      const newItem: HistoryItem = {
        id: newId,
        sourceInput: input,
        cardData: card,
        impactSummary: impact,
        fullContent: fullContent,
        preferences: preferences,
        generations: [],
        createdAt: new Date().toISOString()
      };
      
      setActiveHistoryItem(newItem);
      await handleSaveOrUpdateHistory(newItem);

      setState(WorkflowState.DASHBOARD);
    } catch (error) {
      console.error("Error analyzing content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlatformSelect = async (platform: Platform) => {
    setState(WorkflowState.GENERATING);
    setIsLoading(true);
    setGenResult({ platform, content: '' });

    try {
      const promptOrContent = await generatePlatformContent(platform, fullContent, preferences);
      
      let finalResult: GenerationResult = { platform, content: promptOrContent };
      
      if (platform === Platform.Image) {
        const imageUrl = await generateImage(promptOrContent);
        finalResult.imageUrl = imageUrl;
      } else if (platform === Platform.Video) {
         const videoUrl = await generateVideo(promptOrContent);
         finalResult.videoUrl = videoUrl;
      }
      
      setGenResult(finalResult);

      // Append generation result to active history record
      if (activeHistoryItem) {
        const existsIndex = activeHistoryItem.generations.findIndex(g => g.platform === platform);
        let updatedGens = [...activeHistoryItem.generations];
        if (existsIndex > -1) {
          updatedGens[existsIndex] = finalResult;
        } else {
          updatedGens.push(finalResult);
        }

        const updatedItem: HistoryItem = {
          ...activeHistoryItem,
          generations: updatedGens
        };
        setActiveHistoryItem(updatedItem);
        await handleSaveOrUpdateHistory(updatedItem);
      }
    } catch (error: any) {
      console.error("Error generating platform content:", error);
      alert(error.message || "Failed to generate content for " + platform);
      setState(WorkflowState.DASHBOARD);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadHistoryItem = (item: HistoryItem) => {
    setSourceContent(item.sourceInput);
    setCardData(item.cardData);
    setImpactSummary(item.impactSummary);
    setFullContent(item.fullContent);
    setPreferences(item.preferences);
    
    if (item.generations && item.generations.length > 0) {
      setGenResult(item.generations[item.generations.length - 1]);
    } else {
      setGenResult(null);
    }
    
    setActiveHistoryItem(item);
    setIsHistoryOpen(false);
    setState(WorkflowState.DASHBOARD);
  };

  const handleDeleteHistoryItem = async (id: string) => {
    try {
      const success = await deleteHistoryItem(id);
      if (success) {
        const updatedHistory = history.filter(h => h.id !== id);
        setHistory(updatedHistory);
        localStorage.setItem('repurposer_history', JSON.stringify(updatedHistory));
        
        if (activeHistoryItem && activeHistoryItem.id === id) {
          setActiveHistoryItem(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete history item:", err);
    }
  };

  const handleReset = () => {
    setState(WorkflowState.DASHBOARD);
    setGenResult(null);
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-indigo-500 selection:text-white">
      <Header onOpenHistory={() => setIsHistoryOpen(true)} historyCount={history.length} />
      
      <main>
        {state === WorkflowState.INPUT && (
          <InputSection 
            onSubmit={handleInputSubmit} 
            isLoading={isLoading} 
            history={history} 
            onLoadItem={handleLoadHistoryItem} 
          />
        )}

        {(state === WorkflowState.DASHBOARD || state === WorkflowState.GENERATING) && cardData && (
          <div className="animate-in fade-in duration-1000 slide-in-from-bottom-4">
            <ContentCard data={cardData} impact={impactSummary} />
            
            {state === WorkflowState.DASHBOARD && (
              <>
                <PreferencesSection preferences={preferences} onChange={setPreferences} />
                <PlatformSelector onSelect={handlePlatformSelect} isGenerating={isLoading} />
              </>
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

      <HistoryPanel 
        history={history} 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        onLoadItem={handleLoadHistoryItem} 
        onDeleteItem={handleDeleteHistoryItem} 
      />

      {/* Persistent Call to Action */}
      {state !== WorkflowState.INPUT && (
        <button 
          onClick={() => {
            setState(WorkflowState.INPUT);
            setCardData(null);
            setGenResult(null);
            setActiveHistoryItem(null);
          }}
          className="fixed bottom-8 right-8 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 z-50 group"
          title="Start Over"
          id="global-start-over-btn"
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
