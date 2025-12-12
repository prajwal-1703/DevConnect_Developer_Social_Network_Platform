import { api } from './api';

export interface Like {
  id: string;
  userId: string;
  postId?: string;
  projectId?: string;
  createdAt: string;
}

export interface CreateLikeData {
  postId?: string;
  projectId?: string;
}

export const likesService = {
  async likePost(postId: string): Promise<void> {
    await api.post('/likes', { postId });
  },

  async likeProject(projectId: string): Promise<void> {
    await api.post('/likes', { projectId, id: projectId, type: 'project' });
  },

  async unlikePost(postId: string): Promise<void> {
    await api.delete('/likes', { data: { postId } });
  },

  async unlikeProject(projectId: string): Promise<void> {
    await api.delete('/likes', { data: { projectId, id: projectId, type: 'project' } });
  },
};
