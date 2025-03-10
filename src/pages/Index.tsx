
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UploadSection from "@/components/UploadSection";
import AnalyzerAnimation from "@/components/AnalyzerAnimation";
import ResultsDisplay from "@/components/ResultsDisplay";
import { analyzeImage, analyzeImageUrl } from "@/services/api";
import { ArrowDown, Leaf } from 'lucide-react';

interface AnalysisResult {
  name: string;
  quality: number;
  moisture: number;
  size: string;
  insight: string;
  price?: string;
  quantity?: string;
}

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageSelected = useCallback((file: File) => {
    setSelectedFile(file);
    setSelectedUrl(null);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
  }, []);

  const handleUrlSubmit = useCallback((url: string) => {
    setSelectedUrl(url);
    setSelectedFile(null);
    setPreviewUrl(url);
    setResult(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile && !selectedUrl) {
      toast({
        title: "No image selected",
        description: "Please upload an image or provide a URL",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      let analysisResult;
      
      if (selectedFile) {
        analysisResult = await analyzeImage(selectedFile);
      } else if (selectedUrl) {
        analysisResult = await analyzeImageUrl(selectedUrl);
      }

      // Add a short delay to show the analysis animation
      setTimeout(() => {
        if (analysisResult) {
          setResult(analysisResult);
        }
        setIsAnalyzing(false);
      }, 1500);
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "There was a problem analyzing your image. Please try again.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
  }, [selectedFile, selectedUrl, toast]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setSelectedUrl(null);
    setPreviewUrl(null);
    setResult(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="circle-blur bg-primary/20 top-0 left-1/4 transform -translate-x-1/2"></div>
          <div className="circle-blur bg-secondary/20 bottom-0 right-1/4 transform translate-x-1/2"></div>
          
          <div className="container px-4 mx-auto relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center justify-center px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Leaf className="mr-1 h-4 w-4" />
                <span>Advanced AI Analysis</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight">
                Analyze Fruits & Vegetables with Vision AI
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Get instant quality analysis, moisture content, and market prices for any fruit or vegetable. Simply upload an image or provide a URL.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' })}>
                  Try It Now
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center mt-8 animate-bounce-light">
              <ArrowDown className="text-muted-foreground h-6 w-6" />
            </div>
          </div>
        </section>
        
        {/* Analyzer Section */}
        <section id="analyzer" className="py-16 relative">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Upload & Analyze</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Upload an image of any fruit or vegetable to get detailed analysis on quality, 
                moisture content, size, and current market price.
              </p>
            </div>
            
            <div className="mb-8">
              <UploadSection 
                onImageSelected={handleImageSelected} 
                onUrlSubmit={handleUrlSubmit}
                isLoading={isAnalyzing}
              />
            </div>
            
            {previewUrl && !result && !isAnalyzing && (
              <div className="flex justify-center mt-6 animate-fade-in">
                <Button size="lg" onClick={handleAnalyze}>
                  Analyze Now
                </Button>
              </div>
            )}
            
            {result && previewUrl && (
              <div className="mt-12">
                <ResultsDisplay 
                  result={result} 
                  imageUrl={previewUrl}
                  onReset={handleReset}
                />
              </div>
            )}
          </div>
          
          {/* Analyzer Animation */}
          <AnalyzerAnimation isAnalyzing={isAnalyzing} />
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Key Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our cutting-edge AI technology provides comprehensive analysis for fruits and vegetables.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M19 12.9A7 7 0 1 1 12 6a7 7 0 0 1 7 6.9z"/>
                    <path d="M12 8v4l3 3"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Analysis</h3>
                <p className="text-muted-foreground">
                  Get instant quality assessment, moisture content, and size estimation within seconds.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M6 16.326A3.147 3.147 0 0 1 9 15a3 3 0 0 1 3 3c0 2-3 3-3 3"/>
                    <path d="M12 13a3 3 0 0 1 3-3 3 3 0 0 1 3 3c0 2-3 3-3 3"/>
                    <path d="m9 10-2 1h8"/>
                    <path d="M12 7v4"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Market Price Integration</h3>
                <p className="text-muted-foreground">
                  Access current market prices from major retailers, updated regularly.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M20 16.7a3 3 0 0 1-5.6 1.4"/>
                    <path d="M14 17H4a2 2 0 0 1-2-2v-1a4 4 0 0 1 4-4h8q.57 0 1.1.17"/>
                    <path d="M12 4L4.3 7.8c-.4.2-.7.5-.9.9L2 11"/>
                    <path d="M14.42 6A3 3 0 0 1 19 8v4"/>
                    <path d="M22 12l-5.5 2.5c-.5.232-.753.45-.89.77L14 19"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Insights</h3>
                <p className="text-muted-foreground">
                  Detailed observations about appearance, texture, color, and freshness.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
