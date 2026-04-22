import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Heart, ExternalLink, Github, MoreHorizontal, Trash2, Eye, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import type { Project } from '@/services/projectsService';

interface ProjectCardProps {
  project: Project;
  viewMode?: 'grid' | 'list';
  onLike?: (projectId: string) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
}

const getStatusColor = (status: Project['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500/10 text-green-700 dark:text-green-400';
    case 'in-progress':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
    case 'planning':
      return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
    case 'on-hold':
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    default:
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
  }
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  viewMode = 'grid', 
  onLike, 
  onEdit,
  onDelete 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  const handleLike = async () => {
    if (!onLike || isPending) return;
    try {
      setIsPending(true);
      await onLike(project.id);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update like status', variant: 'destructive' });
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    try {
      await onDelete(project.id);
      toast({
        title: 'Project deleted',
        description: 'Your project has been deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive',
      });
    }
  };

  const isOwner = user?.id === project.authorId;

  const CardComponent = (
    <Card className="bg-panel/30 border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-soft group">
      <CardHeader className={`${viewMode === 'list' ? 'pb-3' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to={project.author.id ? `/profile/${project.author.id}` : '#'}>
              <Avatar className="h-8 w-8 ring-2 ring-primary/10 hover:ring-primary/20 transition-all">
                <AvatarImage src={project.author.avatar} alt={project.author.username} />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                  {project.author.username[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link 
                to={project.author.id ? `/profile/${project.author.id}` : '#'}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {project.author.username}
              </Link>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(project.status)} variant="secondary">
              {project.status.replace('-', ' ')}
            </Badge>
            
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(project)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <CardTitle className="text-xl group-hover:text-primary transition-colors">
          {project.title}
        </CardTitle>
      </CardHeader>

      <CardContent className={`${viewMode === 'list' ? 'py-3' : 'pb-3'}`}>
        <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1 mb-4">
          {project.techStack.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.techStack.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{project.techStack.length - 4}
            </Badge>
          )}
        </div>

        {/* Project Images */}
        {project.images && project.images.length > 0 && (
          <div className="rounded-lg overflow-hidden mb-4">
            <img
              src={project.images[0]}
              alt={project.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t border-border">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isPending}
              className={`${project.isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'} transition-colors`}
            >
              <Heart className={`h-4 w-4 mr-1 ${project.isLiked ? 'fill-current' : ''}`} />
              {project.likesCount}
            </Button>
            
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            {project.githubUrl && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-muted-foreground hover:text-foreground"
              >
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            )}
            
            {project.liveUrl && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-muted-foreground hover:text-foreground"
              >
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={viewMode === 'list' ? 'w-full' : ''}
    >
      {CardComponent}
    </motion.div>
  );
};