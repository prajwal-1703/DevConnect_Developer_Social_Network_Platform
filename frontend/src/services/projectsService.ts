import { api } from './api';

export interface Project {
  id: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  title: string;
  description: string;
  images?: string[];
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  likesCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  title: string;
  description: string;
  imageUrl?: string;
  githubLink?: string;
  tags: string[];
  status?: 'planning' | 'in-progress' | 'completed' | 'on-hold';
}

export const projectsService = {
  // Map backend project shape to frontend `Project` interface
  mapBackendProject(backendProject: any): Project {
    return {
      id: backendProject._id || backendProject.id,
      authorId: backendProject.userId?._id || backendProject.userId,
      author: {
        id: backendProject.userId?._id || backendProject.userId,
        username: backendProject.userId?.username || backendProject.userId?.name || 'Unknown',
        avatar: backendProject.userId?.profilePicUrl || backendProject.userId?.avatar || undefined,
      },
      title: backendProject.title || '',
      description: backendProject.description || '',
      images: backendProject.imageUrl ? [backendProject.imageUrl] : backendProject.images || [],
      techStack: (backendProject.tags || []).map((t: any) => (t?.name ? t.name : String(t))),
      githubUrl: backendProject.githubLink || backendProject.githubUrl || undefined,
      liveUrl: backendProject.liveUrl || undefined,
      status: backendProject.status || 'planning',
      likesCount: Number(backendProject.likesCount || 0),
      isLiked: !!backendProject.isLiked,
      createdAt: backendProject.createdAt || backendProject.created_at || new Date().toISOString(),
      updatedAt: backendProject.updatedAt || backendProject.updated_at || new Date().toISOString(),
    };
  },

  async getProjects(): Promise<Project[]> {
    const response = await api.get('/projects');
    const data = response.data || [];
    return data.map((p: any) => (projectsService as any).mapBackendProject(p));
  },

  async getProject(projectId: string): Promise<Project> {
    const response = await api.get(`/projects/${projectId}`);
    return (projectsService as any).mapBackendProject(response.data);
  },

  async getUserProjects(userId: string): Promise<Project[]> {
    const response = await api.get(`/projects/user/${userId}`);
    const data = response.data || [];
    return data.map((p: any) => (projectsService as any).mapBackendProject(p));
  },

  async createProject(projectData: CreateProjectData): Promise<Project> {
    const response = await api.post('/projects', {
      title: projectData.title,
      description: projectData.description,
      githubLink: projectData.githubLink,
      imageUrl: projectData.imageUrl,
      tags: projectData.tags,
      status: projectData.status,
    });
    return (projectsService as any).mapBackendProject(response.data);
  },

  async updateProject(projectId: string, projectData: Partial<CreateProjectData>): Promise<Project> {
    const response = await api.put(`/projects/${projectId}`, {
      title: projectData.title,
      description: projectData.description,
      githubLink: projectData.githubLink,
      imageUrl: projectData.imageUrl,
      tags: projectData.tags,
      status: projectData.status,
    });
    return (projectsService as any).mapBackendProject(response.data);
  },

  async deleteProject(projectId: string): Promise<void> {
    await api.delete(`/projects/${projectId}`);
  },

  async getComments(projectId: string): Promise<Comment[]> {
    const response = await api.get(`/comments/project/${projectId}`);
    return response.data;
  },

  async addComment(projectId: string, content: string): Promise<Comment> {
    const response = await api.post('/comments', { 
      projectId, 
      text: content 
    });
    return response.data;
  },
};