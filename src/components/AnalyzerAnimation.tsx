
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface AnalyzerAnimationProps {
  isAnalyzing: boolean;
}

const AnalyzerAnimation: React.FC<AnalyzerAnimationProps> = ({ isAnalyzing }) => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Preparing...');
  
  useEffect(() => {
    if (!isAnalyzing) {
      setProgress(0);
      return;
    }
    
    const messages = [
      'Identifying fruit/vegetable...',
      'Analyzing texture and color...',
      'Evaluating quality...',
      'Measuring moisture content...',
      'Determining size category...',
      'Checking market prices...',
      'Almost done...',
    ];
    
    let interval: NodeJS.Timeout;
    let messageIndex = 0;
    
    // Simulate progress
    interval = setInterval(() => {
      setProgress(prev => {
        // Change messages at certain thresholds
        if (prev >= 10 && messageIndex === 0) {
          setMessage(messages[1]);
          messageIndex = 1;
        } else if (prev >= 30 && messageIndex === 1) {
          setMessage(messages[2]);
          messageIndex = 2;
        } else if (prev >= 45 && messageIndex === 2) {
          setMessage(messages[3]);
          messageIndex = 3;
        } else if (prev >= 60 && messageIndex === 3) {
          setMessage(messages[4]);
          messageIndex = 4;
        } else if (prev >= 75 && messageIndex === 4) {
          setMessage(messages[5]);
          messageIndex = 5;
        } else if (prev >= 90 && messageIndex === 5) {
          setMessage(messages[6]);
          messageIndex = 6;
        }
        
        // Slow down progress as it gets higher
        const increment = 100 - prev > 50 ? 2 : 1;
        const newProgress = Math.min(prev + increment, 98); // Cap at 98%
        return newProgress;
      });
    }, 200);
    
    return () => clearInterval(interval);
  }, [isAnalyzing]);
  
  if (!isAnalyzing) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-fade-in">
      <div className="mb-8 analyzer-progress relative">
        <svg className="w-32 h-32" viewBox="0 0 100 100">
          <circle 
            className="bg" 
            cx="50" 
            cy="50" 
            r="40" 
            fill="none" 
            strokeWidth="4"
          />
          <circle 
            className="progress" 
            cx="50" 
            cy="50" 
            r="40" 
            fill="none" 
            strokeWidth="4"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (251.2 * progress) / 100}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 size={28} className="animate-spin-slow text-primary" />
        </div>
      </div>
      
      <div className="text-center animate-pulse-light">
        <h3 className="text-xl font-medium mb-2">{message}</h3>
        <p className="text-muted-foreground">{progress}% complete</p>
      </div>
    </div>
  );
};

export default AnalyzerAnimation;
