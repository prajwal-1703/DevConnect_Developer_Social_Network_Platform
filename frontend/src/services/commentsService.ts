import { api } from './api';

export interface Comment {
  id: string;
  postId?: string;
  projectId?: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  text: string;
  createdAt: string;
}

export interface CreateCommentData {
  postId?: string;
  projectId?: string;
  text: string;
}

export const commentsService = {
  async getPostComments(postId: string): Promise<Comment[]> {
    const response = await api.get(`/comments/post/${postId}`);
    return response.data;
  },

  async getProjectComments(projectId: string): Promise<Comment[]> {
    const response = await api.get(`/comments/project/${projectId}`);
    return response.data;
  },

  async createComment(commentData: CreateCommentData): Promise<Comment> {
    const response = await api.post('/comments', commentData);
    return response.data;
  },

  async deleteComment(commentId: string): Promise<void> {
    await api.delete(`/comments/${commentId}`);
  },
};
