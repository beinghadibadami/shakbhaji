
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Leaf } from "lucide-react";

interface AnalysisResult {
  name: string;
  quality: number;
  moisture: number;
  size: string;
  insight: string;
  price?: string;
  quantity?: string;
}

interface ResultsDisplayProps {
  result: AnalysisResult | null;
  imageUrl: string | null;
  onReset: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, imageUrl, onReset }) => {
  if (!result) return null;

  const getQualityColor = (quality: number) => {
    if (quality >= 80) return 'bg-green-100 text-green-800';
    if (quality >= 60) return 'bg-lime-100 text-lime-800';
    if (quality >= 40) return 'bg-yellow-100 text-yellow-800';
    if (quality >= 20) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getMoistureColor = (moisture: number) => {
    if (moisture >= 80) return 'bg-blue-100 text-blue-800';
    if (moisture >= 60) return 'bg-sky-100 text-sky-800';
    if (moisture >= 40) return 'bg-teal-100 text-teal-800';
    if (moisture >= 20) return 'bg-cyan-100 text-cyan-800';
    return 'bg-slate-100 text-slate-800';
  };

  const getSizeIcon = (size: string) => {
    switch (size.toLowerCase()) {
      case 'small':
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
      case 'medium':
        return <div className="w-3 h-3 bg-gray-600 rounded-full"></div>;
      case 'big':
      case 'large':
        return <div className="w-4 h-4 bg-gray-700 rounded-full"></div>;
      default:
        return <div className="w-3 h-3 bg-gray-600 rounded-full"></div>;
    }
  };

  return (
    <div className="animate-slide-up">
      <Card className="neo-card overflow-visible">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <Leaf className="text-primary h-5 w-5" />
              </div>
              <CardTitle>Analysis Results</CardTitle>
            </div>
            <Button variant="outline" size="icon" onClick={onReset}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              {imageUrl && (
                <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border">
                  <img
                    src={imageUrl}
                    alt={result.name || 'Analyzed image'}
                    className="h-full w-full object-cover transition-all hover:scale-105 duration-300"
                  />
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-semibold capitalize">{result.name}</h3>
                {(result.price && result.quantity) && (
                  <div className="mt-1 flex items-center gap-2">
                    <div className="text-accent-foreground bg-accent/10 px-2.5 py-0.5 rounded-full text-sm font-medium">
                      {result.price} <span className="text-xs opacity-80">for {result.quantity}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div>
                  <div className="mb-1 flex justify-between items-center">
                    <span className="text-sm font-medium">Quality Score</span>
                    <span className={`progress-pill ${getQualityColor(result.quality)}`}>
                      {result.quality}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-lime-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${result.quality}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="mb-1 flex justify-between items-center">
                    <span className="text-sm font-medium">Moisture Content</span>
                    <span className={`progress-pill ${getMoistureColor(result.moisture)}`}>
                      {result.moisture}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-sky-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${result.moisture}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">Size</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium capitalize">{result.size}</span>
                    {getSizeIcon(result.size)}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium mb-2">Analysis Insight</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {result.insight}
                </p>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  <span>Save Report</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
