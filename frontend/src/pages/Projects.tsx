import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Grid, List, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { CreateProject } from '@/components/projects/CreateProject';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { projectsService } from '@/services/projectsService';
import { likesService } from '@/services/likesService';
import type { Project, CreateProjectData } from '@/services/projectsService';

export default function Projects() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const projectsData = await projectsService.getProjects();
      setProjects(projectsData);
    } catch (error) {
      toast({
        title: 'Failed to load projects',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (projectData: CreateProjectData) => {
    try {
      const newProject = await projectsService.createProject(projectData);
      setProjects(prev => [newProject, ...prev]);
      setShowCreateDialog(false);
    } catch (error) {
      throw error;
    }
  };

  const handleLikeProject = async (projectId: string) => {
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) return;

      // Optimistic update
      setProjects(prev => prev.map(p => (
        p.id === projectId
          ? { ...p, isLiked: !p.isLiked, likesCount: p.isLiked ? Math.max(0, (p.likesCount || 0) - 1) : (p.likesCount || 0) + 1 }
          : p
      )));

      if (project.isLiked) {
        await likesService.unlikeProject(projectId);
      } else {
        await likesService.likeProject(projectId);
      }
    } catch (error) {
      // Revert on failure
      setProjects(prev => prev.map(p => (
        p.id === projectId
          ? { ...p, isLiked: !p.isLiked, likesCount: p.isLiked ? (p.likesCount || 0) + 1 : Math.max(0, (p.likesCount || 0) - 1) }
          : p
      )));
      throw error;
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await projectsService.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (error) {
      throw error;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold"
          >
            Projects
          </motion.h1>
          
          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-border">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Create Project Button */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <CreateProject onCreateProject={handleCreateProject} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Projects Grid/List */}
        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 space-y-4"
          >
            <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No projects yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Share your projects with the community! Click "New Project" to get started.
            </p>
          </motion.div>
        ) : (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-6'
          }`}>
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProjectCard
                  project={project}
                  viewMode={viewMode}
                  onLike={handleLikeProject}
                  onDelete={handleDeleteProject}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}