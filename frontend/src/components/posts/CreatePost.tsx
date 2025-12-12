import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Code, Send, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { CreatePostData } from '@/services/postsService';
import { uploadService } from '@/services/uploadService';

interface CreatePostProps {
  onCreatePost: (postData: CreatePostData) => Promise<void>;
}

const codeLanguages = [
  'javascript', 'typescript', 'python', 'java', 'cpp', 'c', 'csharp',
  'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'html', 'css', 'sql'
];

export const CreatePost: React.FC<CreatePostProps> = ({ onCreatePost }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [content, setContent] = useState('');
  const [showCodeSnippet, setShowCodeSnippet] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState({
    language: 'javascript',
    code: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() && !selectedImage && !(showCodeSnippet && codeSnippet.code.trim())) {
      toast({
        title: 'Nothing to post',
        description: 'Add text, an image, or a code snippet.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const postData: CreatePostData = {
        content: content.trim(),
      };

      if (showCodeSnippet && codeSnippet.code.trim()) {
        postData.codeSnippet = {
          language: codeSnippet.language,
          code: codeSnippet.code.trim(),
        };
      }

      if (selectedImage) {
        postData.image = selectedImage;
      }

      await onCreatePost(postData);
      
      // Reset form
      setContent('');
      setCodeSnippet({ language: 'javascript', code: '' });
      setShowCodeSnippet(false);
      setSelectedImage(null);
      
      toast({
        title: 'Post created!',
        description: 'Your post has been shared with the community',
      });
    } catch (error) {
      toast({
        title: 'Failed to create post',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-panel/50 border-primary/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} alt={user?.username} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm">
                {user?.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-lg">Share something with the community</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="What's on your mind? Share your thoughts, ask questions, or start a discussion..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none border-primary/20 focus:border-primary/40 transition-colors"
            />

            <AnimatePresence>
              {showCodeSnippet && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 border border-border rounded-lg p-4 bg-muted/30"
                >
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Code Snippet</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCodeSnippet(false)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Select value={codeSnippet.language} onValueChange={(value) => 
                    setCodeSnippet(prev => ({ ...prev, language: value }))
                  }>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {codeLanguages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Textarea
                    placeholder="Paste your code here..."
                    value={codeSnippet.code}
                    onChange={(e) => setCodeSnippet(prev => ({ ...prev, code: e.target.value }))}
                    className="font-mono text-sm min-h-[100px] bg-background"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCodeSnippet(!showCodeSnippet)}
                  className={showCodeSnippet ? 'bg-primary/10 text-primary' : ''}
                >
                  <Code className="h-4 w-4 mr-1" />
                  Code
                </Button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image className="h-4 w-4 mr-1" />
                  Image
                </Button>
                {selectedImage && (
                  <Badge variant="secondary" className="ml-1 max-w-[160px] truncate">
                    {selectedImage.name}
                  </Badge>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={(isSubmitting) || (!content.trim() && !selectedImage && !(showCodeSnippet && codeSnippet.code.trim()))}
                className="bg-gradient-primary hover:opacity-90"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="h-4 w-4 mr-2"
                  >
                    <Send className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                {isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};