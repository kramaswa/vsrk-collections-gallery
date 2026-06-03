
import React, { useState } from 'react';
import { useMedia } from '@/contexts/MediaContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Image, Video, AlertCircle, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useCategories } from '@/hooks/useCategories';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const UploadForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);
  const [fileType, setFileType] = useState<'image' | 'video'>('image');
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('uncategorized');
  
  const { addMediaItem } = useMedia();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { toast } = useToast();
  
  const validateFile = (file: File, type: 'image' | 'video' | 'thumbnail'): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds 50MB limit. Please choose a smaller file.`);
      return false;
    }
    
    if (type === 'image' && !file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return false;
    }
    
    if (type === 'video' && !file.type.startsWith('video/')) {
      setError('Please select a valid video file.');
      return false;
    }
    
    if (type === 'thumbnail' && !file.type.startsWith('image/')) {
      setError('Please select a valid image for the thumbnail.');
      return false;
    }
    
    setError(null);
    return true;
  };
  
  const resizeImageForAPI = (file: File): Promise<{ base64: string; mimeType: string }> =>
    new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const maxSize = 1024;
        let { width, height } = img;
        if (width > height && width > maxSize) { height = (height * maxSize) / width; width = maxSize; }
        else if (height > maxSize) { width = (width * maxSize) / height; height = maxSize; }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        resolve({ base64, mimeType: 'image/jpeg' });
      };
      img.src = URL.createObjectURL(file);
    });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!validateFile(selectedFile, fileType)) {
        e.target.value = '';
        setFile(null);
        return;
      }
      setFile(selectedFile);

      if (fileType === 'image') {
        setIsGenerating(true);
        setTitle('Generating...');
        setDescription('Generating...');
        try {
          const { base64, mimeType } = await resizeImageForAPI(selectedFile);
          const res = await fetch('/api/describe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64: base64, mimeType }),
          });
          const data = await res.json();
          if (data.title) setTitle(data.title);
          if (data.description) setDescription(data.description);
        } catch {
          setTitle('');
          setDescription('');
        } finally {
          setIsGenerating(false);
        }
      }
    }
  };
  
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile, 'thumbnail')) {
        setThumbnailFile(selectedFile);
      } else {
        e.target.value = '';
        setThumbnailFile(null);
      }
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFeatured(false);
    setFileType('image');
    setFile(null);
    setThumbnailFile(null);
    setUploadProgress(0);
    setError(null);
    setCategory('uncategorized');
  };
  
  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 200);
    
    return () => clearInterval(interval);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }
    
    if (fileType === 'video' && !thumbnailFile) {
      toast({
        title: "Error",
        description: "Please select a thumbnail for the video",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    const stopProgress = simulateProgress();
    
    try {
      const success = await addMediaItem(
        {
          title,
          description,
          media_url: '',  // Will be set by addMediaItem function
          thumbnail_url: null,  // Will be set by addMediaItem function
          type: fileType,
          featured,
          category, // Add the category field
        },
        file,
        fileType === 'video' ? thumbnailFile : undefined
      );
      
      if (success) {
        resetForm();
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      stopProgress();
      setUploadProgress(100);
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 500);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="font-serif text-2xl font-semibold mb-6">Upload New Media</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="file-type">Media Type</Label>
          <div className="flex space-x-4">
            <Button
              type="button"
              variant={fileType === 'image' ? 'default' : 'outline'}
              onClick={() => setFileType('image')}
              className={fileType === 'image' ? 'bg-vsrk-gold text-black hover:bg-vsrk-gold/90' : ''}
              disabled={isUploading}
            >
              <Image className="mr-2 h-4 w-4" />
              Image
            </Button>
            <Button
              type="button"
              variant={fileType === 'video' ? 'default' : 'outline'}
              onClick={() => setFileType('video')}
              className={fileType === 'video' ? 'bg-vsrk-gold text-black hover:bg-vsrk-gold/90' : ''}
              disabled={isUploading}
            >
              <Video className="mr-2 h-4 w-4" />
              Video
            </Button>
          </div>
        </div>
        
        {/* Category dropdown */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={category}
            onValueChange={setCategory}
            disabled={isUploading || categoriesLoading}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.display_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="file">Upload {fileType === 'image' ? 'Image' : 'Video'}</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-2">
              {file 
                ? `Selected: ${file.name}`
                : `Click to select a ${fileType} file or drag and drop`}
            </p>
            <Input
              id="file"
              type="file"
              accept={fileType === 'image' ? "image/*" : "video/*"}
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
            <Button 
              type="button" 
              variant="outline"
              onClick={() => document.getElementById('file')?.click()}
              disabled={isUploading}
            >
              Select File
            </Button>
          </div>
        </div>
        
        {fileType === 'video' && (
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Upload Thumbnail (required for videos)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
              <Image className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">
                {thumbnailFile 
                  ? `Selected: ${thumbnailFile.name}`
                  : "Click to select a thumbnail image or drag and drop"}
              </p>
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
                disabled={isUploading}
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={() => document.getElementById('thumbnail')?.click()}
                disabled={isUploading}
              >
                Select Thumbnail
              </Button>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="title" className="flex items-center gap-2">
            Title
            {isGenerating && <span className="text-xs text-vsrk-gold flex items-center gap-1"><Sparkles className="h-3 w-3" /> AI generating...</span>}
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter a title"
            disabled={isUploading || isGenerating}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description"
            rows={3}
            disabled={isUploading || isGenerating}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="featured"
            checked={featured}
            onCheckedChange={setFeatured}
            disabled={isUploading}
          />
          <Label htmlFor="featured">Feature on homepage</Label>
        </div>
        
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}
        
        <Button 
          type="submit"
          className="w-full bg-vsrk-gold hover:bg-vsrk-dark text-black hover:text-white font-medium"
          disabled={isUploading || isGenerating || !file || (fileType === 'video' && !thumbnailFile)}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </form>
    </div>
  );
};

export default UploadForm;
