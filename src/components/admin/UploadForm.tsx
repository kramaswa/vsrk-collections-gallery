
import React, { useState } from 'react';
import { useMedia } from '@/contexts/MediaContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Image, Video } from 'lucide-react';

const UploadForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);
  const [fileType, setFileType] = useState<'image' | 'video'>('image');
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const { addMediaItem } = useMedia();
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFeatured(false);
    setFileType('image');
    setFile(null);
    setThumbnailFile(null);
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
    
    try {
      // In a real application, you would upload these files to a server/storage service
      // For this demo, we'll create object URLs from the files
      const fileUrl = URL.createObjectURL(file);
      let thumbnailUrl = '';
      
      if (fileType === 'video' && thumbnailFile) {
        thumbnailUrl = URL.createObjectURL(thumbnailFile);
      }
      
      // Add the new media item
      addMediaItem({
        type: fileType,
        url: fileUrl,
        thumbnail: thumbnailUrl,
        title,
        description,
        featured,
      });
      
      toast({
        title: "Success",
        description: "Media uploaded successfully",
      });
      
      resetForm();
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your media",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="font-serif text-2xl font-semibold mb-6">Upload New Media</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="file-type">Media Type</Label>
          <div className="flex space-x-4">
            <Button
              type="button"
              variant={fileType === 'image' ? 'default' : 'outline'}
              onClick={() => setFileType('image')}
              className={fileType === 'image' ? 'bg-vsrk-gold text-black hover:bg-vsrk-gold/90' : ''}
            >
              <Image className="mr-2 h-4 w-4" />
              Image
            </Button>
            <Button
              type="button"
              variant={fileType === 'video' ? 'default' : 'outline'}
              onClick={() => setFileType('video')}
              className={fileType === 'video' ? 'bg-vsrk-gold text-black hover:bg-vsrk-gold/90' : ''}
            >
              <Video className="mr-2 h-4 w-4" />
              Video
            </Button>
          </div>
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
            />
            <Button 
              type="button" 
              variant="outline"
              onClick={() => document.getElementById('file')?.click()}
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
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={() => document.getElementById('thumbnail')?.click()}
              >
                Select Thumbnail
              </Button>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter a title"
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
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="featured"
            checked={featured}
            onCheckedChange={setFeatured}
          />
          <Label htmlFor="featured">Feature on homepage</Label>
        </div>
        
        <Button 
          type="submit"
          className="w-full bg-vsrk-gold hover:bg-vsrk-dark text-black hover:text-white font-medium"
          disabled={isUploading || !file || (fileType === 'video' && !thumbnailFile)}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </form>
    </div>
  );
};

export default UploadForm;
