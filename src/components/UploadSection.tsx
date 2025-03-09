
import React, { useState, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, Camera, X, ChevronRight } from "lucide-react";

interface UploadSectionProps {
  onImageSelected: (file: File) => void;
  onUrlSubmit: (url: string) => void;
  isLoading: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onImageSelected, onUrlSubmit, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }
      handleFile(file);
    }
  }, [toast]);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    onImageSelected(file);
  }, [onImageSelected]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }
      handleFile(file);
    }
  }, [handleFile, toast]);

  const handleUrlSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      toast({
        title: "URL required",
        description: "Please enter an image URL",
        variant: "destructive",
      });
      return;
    }
    
    // Simple URL validation
    if (!imageUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp|bmp|gif)$/i)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL (ending with jpg, png, etc.)",
        variant: "destructive",
      });
      return;
    }
    
    setPreviewUrl(imageUrl);
    onUrlSubmit(imageUrl);
  }, [imageUrl, onUrlSubmit, toast]);

  const resetImage = useCallback(() => {
    setPreviewUrl(null);
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <Card className="w-full max-w-3xl mx-auto neo-card bg-white">
      <CardContent className="p-6">
        <div className="flex mb-6 border-b">
          <button
            className={`py-2 px-4 font-medium text-sm relative ${activeTab === 'upload' ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('upload')}
          >
            <div className="flex items-center gap-2">
              <Upload size={18} />
              <span>Upload Image</span>
            </div>
            {activeTab === 'upload' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm relative ${activeTab === 'url' ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('url')}
          >
            <div className="flex items-center gap-2">
              <Camera size={18} />
              <span>Image URL</span>
            </div>
            {activeTab === 'url' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

        {!previewUrl ? (
          <>
            {activeTab === 'upload' ? (
              <div
                className={`dropzone h-64 flex items-center justify-center ${dragActive ? 'active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isLoading}
                />
                <div className="text-center p-6 animate-fade-in">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <Upload className="text-muted-foreground animate-bounce-light" size={24} />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Upload Your Image</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Drag and drop your image here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports: JPG, PNG, WEBP (Max 5MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center p-6 animate-fade-in">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <Camera className="text-muted-foreground" size={24} />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Enter Image URL</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Paste a direct link to an image from the web
                </p>
                <form onSubmit={handleUrlSubmit} className="w-full max-w-md mt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !imageUrl}>
                      Submit
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </>
        ) : (
          <div className="relative h-64 flex items-center justify-center animate-scale-in">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-64 max-w-full object-contain rounded-lg"
            />
            <button
              onClick={resetImage}
              className="absolute top-2 right-2 p-1 bg-black/40 rounded-full text-white hover:bg-black/60 transition-colors"
              disabled={isLoading}
            >
              <X size={16} />
            </button>
            {!isLoading && (
              <div className="absolute bottom-4 right-4">
                <Button variant="default" onClick={() => {}} className="rounded-full px-4 py-2">
                  <span className="mr-2">Analyze</span>
                  <ChevronRight size={16} />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadSection;
