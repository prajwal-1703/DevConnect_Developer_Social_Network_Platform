import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import type { CreateProjectData } from '@/services/projectsService';
import { uploadService } from '@/services/uploadService';

interface CreateProjectProps {
  onCreateProject: (projectData: CreateProjectData) => Promise<void>;
}

const commonTechStack = [
  'React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js',
  'Node.js', 'Express', 'FastAPI', 'Django', 'Flask', 'Spring Boot',
  'TypeScript', 'JavaScript', 'Python', 'Java', 'C#', 'Go', 'Rust',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Vercel', 'Netlify',
  'Tailwind CSS', 'Material-UI', 'Bootstrap', 'Styled Components',
  'Jest', 'Cypress', 'Playwright', 'Vitest'
];

export const CreateProject: React.FC<CreateProjectProps> = ({ onCreateProject }) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<CreateProjectData>({
    title: '',
    description: '',
    techStack: [],
    githubUrl: '',
    liveUrl: '',
    status: 'planning',
  });
  
  const [techInput, setTechInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (field: keyof CreateProjectData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTech = (tech: string) => {
    const trimmedTech = tech.trim();
    if (trimmedTech && !formData.techStack.includes(trimmedTech)) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, trimmedTech]
      }));
    }
    setTechInput('');
  };

  const removeTech = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter(t => t !== tech)
    }));
  };

  const handleTechInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTech(techInput);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in the title and description',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl: string | undefined = undefined;
      if (selectedImage) {
        const res = await uploadService.uploadImage(selectedImage);
        imageUrl = res.imageUrl;
      }

      await onCreateProject({
        title: formData.title.trim(),
        description: formData.description.trim(),
        githubLink: formData.githubUrl?.trim() || undefined,
        imageUrl,
        tags: formData.techStack,
        status: formData.status,
      });
      
      toast({
        title: 'Project created!',
        description: 'Your project has been shared with the community',
      });
    } catch (error) {
      toast({
        title: 'Failed to create project',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-2xl">Create New Project</DialogTitle>
        <DialogDescription>
          Share your project with the DevConnect community
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Project Title *</Label>
          <Input
            id="title"
            placeholder="My Awesome Project"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe your project, its features, and what makes it special..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="min-h-[120px] resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Tech Stack */}
        <div className="space-y-3">
          <Label>Tech Stack</Label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Add technology (e.g., React, Node.js)"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleTechInputKeyDown}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addTech(techInput)}
                disabled={!techInput.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Common Tech Stack */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Quick add:</p>
              <div className="flex flex-wrap gap-1">
                {commonTechStack.slice(0, 12).map((tech) => (
                  <Button
                    key={tech}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addTech(tech)}
                    disabled={formData.techStack.includes(tech)}
                    className="h-7 text-xs"
                  >
                    {tech}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Selected Tech Stack */}
            {formData.techStack.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.techStack.map((tech) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {tech}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTech(tech)}
                        className="h-4 w-4 p-0 hover:bg-destructive/20"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Label>Project Image</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
          />
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
              Upload Image
            </Button>
            {selectedImage && (
              <span className="text-sm text-muted-foreground truncate max-w-[240px]">
                {selectedImage.name}
              </span>
            )}
          </div>
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input
              id="githubUrl"
              placeholder="https://github.com/username/repo"
              value={formData.githubUrl}
              onChange={(e) => handleInputChange('githubUrl', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="liveUrl">Live Demo URL</Label>
            <Input
              id="liveUrl"
              placeholder="https://myproject.com"
              value={formData.liveUrl}
              onChange={(e) => handleInputChange('liveUrl', e.target.value)}
            />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>Project Status</Label>
          <Select value={formData.status} onValueChange={(value: any) => handleInputChange('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
          className="w-full bg-gradient-primary hover:opacity-90"
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
          {isSubmitting ? 'Creating...' : 'Create Project'}
        </Button>
      </form>
    </div>
  );
};