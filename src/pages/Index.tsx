
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import UploadSection from "@/components/UploadSection";
import AnalyzerAnimation from "@/components/AnalyzerAnimation";
import ResultsDisplay from "@/components/ResultsDisplay";
import { analyzeImage, analyzeImageUrl } from "@/services/api";
import { ArrowDown, Leaf, Sparkles, Apple, Carrot, BarChart4 } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/30">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-28 overflow-hidden">
          <div className="circle-blur bg-primary/30 top-0 left-1/4 transform -translate-x-1/2"></div>
          <div className="circle-blur bg-secondary/30 bottom-0 right-1/4 transform translate-x-1/2"></div>
          
          <div className="container px-4 mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-center md:space-x-12">
              <div className="text-left max-w-xl mb-12 md:mb-0 md:w-1/2">
                <div className="inline-flex items-center justify-center px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Sparkles className="mr-1 h-4 w-4" />
                  <span>AI-Powered Produce Analysis</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                  See Your <span className="text-primary">Produce</span> in a Whole New Light
                </h1>
                
                <p className="text-lg text-muted-foreground mb-8">
                  Discover the hidden quality, moisture content, and market value of any fruit or vegetable with just a photo. Our AI does the work for you.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="rounded-full text-base px-8 shadow-lg shadow-primary/20" onClick={() => document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' })}>
                    Try It Now
                  </Button>
                  <Link to="/about">
                    <Button size="lg" variant="outline" className="rounded-full text-base px-8 border-2">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="relative">
                  <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary/10 rounded-full"></div>
                  <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-secondary/20 rounded-full"></div>
                  
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-primary/10 border border-primary/10 transform rotate-2 transition-transform hover:rotate-0 duration-500">
                    <div className="bg-gradient-to-br from-muted via-white to-muted p-8 backdrop-blur-sm">
                      <div className="flex space-x-6 mb-8">
                        <div className="flex flex-col items-center">
                          <div className="rounded-full bg-green-100 p-4 mb-2">
                            <Apple className="h-8 w-8 text-primary" />
                          </div>
                          <span className="text-sm font-medium">Fruits</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="rounded-full bg-orange-100 p-4 mb-2">
                            <Carrot className="h-8 w-8 text-accent" />
                          </div>
                          <span className="text-sm font-medium">Vegetables</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="rounded-full bg-blue-100 p-4 mb-2">
                            <BarChart4 className="h-8 w-8 text-blue-500" />
                          </div>
                          <span className="text-sm font-medium">Analysis</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-white shadow-sm border">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-sm">Apple (Red Delicious)</span>
                            <span className="text-primary font-bold">92%</span>
                          </div>
                          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                            <div className="bg-primary h-full rounded-full" style={{ width: "92%" }}></div>
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">Quality Score</div>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-white shadow-sm border">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-sm">Moisture Content</span>
                            <span className="text-blue-500 font-bold">86%</span>
                          </div>
                          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: "86%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-14 animate-bounce-light">
              <ArrowDown className="text-primary h-8 w-8" />
            </div>
          </div>
        </section>
        
        {/* Analyzer Section */}
        <section id="analyzer" className="py-20 relative">
          <div className="circle-blur bg-secondary/20 top-20 right-20"></div>
          
          <div className="container px-4 mx-auto relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Upload & Analyze</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Upload an image of any fruit or vegetable to get detailed analysis on quality, 
                moisture content, size, and current market price.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto mb-8 rounded-xl shadow-xl overflow-hidden border border-primary/10">
              <UploadSection 
                onImageSelected={handleImageSelected} 
                onUrlSubmit={handleUrlSubmit}
                isLoading={isAnalyzing}
              />
            </div>
            
            {previewUrl && !result && !isAnalyzing && (
              <div className="flex justify-center mt-8 animate-fade-in">
                <Button size="lg" className="rounded-full text-base px-10 py-6 shadow-lg shadow-primary/20" onClick={handleAnalyze}>
                  <Sparkles className="mr-2 h-5 w-5" />
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
        <section className="py-20 bg-gradient-to-br from-muted/50 via-background to-background">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Leaf className="mr-1 h-4 w-4" />
                <span>Key Features</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Smart Analysis for Fresh Produce</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our cutting-edge AI technology provides comprehensive analysis for fruits and vegetables.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-primary/5 transform hover:-translate-y-1 duration-300">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M19 12.9A7 7 0 1 1 12 6a7 7 0 0 1 7 6.9z"/>
                    <path d="M12 8v4l3 3"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-time Analysis</h3>
                <p className="text-muted-foreground">
                  Get instant quality assessment, moisture content, and size estimation within seconds.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-primary/5 transform hover:-translate-y-1 duration-300">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M6 16.326A3.147 3.147 0 0 1 9 15a3 3 0 0 1 3 3c0 2-3 3-3 3"/>
                    <path d="M12 13a3 3 0 0 1 3-3 3 3 0 0 1 3 3c0 2-3 3-3 3"/>
                    <path d="m9 10-2 1h8"/>
                    <path d="M12 7v4"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Market Price Integration</h3>
                <p className="text-muted-foreground">
                  Access current market prices from major retailers, updated regularly.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-primary/5 transform hover:-translate-y-1 duration-300">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M20 16.7a3 3 0 0 1-5.6 1.4"/>
                    <path d="M14 17H4a2 2 0 0 1-2-2v-1a4 4 0 0 1 4-4h8q.57 0 1.1.17"/>
                    <path d="M12 4L4.3 7.8c-.4.2-.7.5-.9.9L2 11"/>
                    <path d="M14.42 6A3 3 0 0 1 19 8v4"/>
                    <path d="M22 12l-5.5 2.5c-.5.232-.753.45-.89.77L14 19"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Quality Insights</h3>
                <p className="text-muted-foreground">
                  Detailed observations about appearance, texture, color, and freshness.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
