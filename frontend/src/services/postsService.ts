import { api } from './api';

export interface Post {
  _id: string;
  content: string;
  createdAt: string;
  imageUrl?: string;
  codeSnippet?: string;
  codeLanguage?: string;
  author: {
    _id: string;
    username: string;
    name?: string;
    avatar?: string;
    isFollowed: boolean;
  };
  likesCount: number;
  commentsCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
}

export interface CreatePostData {
  content: string;
  image?: File;
  tags?: string[];
  codeSnippet?: {
    code: string;
    language?: string;
  };
}

export const postsService = {
  async getPosts(page: number = 1, limit: number = 20): Promise<Post[]> {
    const response = await api.get(`/posts?page=${page}&limit=${limit}`);
    // Backend returns { posts, page, pageSize, total }
    return response.data.posts;
  },

  async getPost(postId: string): Promise<Post> {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },

  async getUserPosts(userId: string): Promise<Post[]> {
    const response = await api.get(`/posts/user/${userId}`);
    return response.data;
  },

  async createPost(postData: CreatePostData): Promise<Post> {
    const formData = new FormData();
    formData.append('content', postData.content);
    if (postData.image) {
      formData.append('image', postData.image);
    }
    if (postData.tags) {
      formData.append('tags', JSON.stringify(postData.tags));
    }
    if (postData.codeSnippet?.code) {
      formData.append('codeSnippet', postData.codeSnippet.code);
      if (postData.codeSnippet.language) {
        formData.append('codeLanguage', postData.codeSnippet.language);
      }
    }
    
    const response = await api.post('/posts', formData);
    return response.data;
  },

  async deletePost(postId: string): Promise<void> {
    await api.delete(`/posts/${postId}`);
  },

  async likePost(postId: string): Promise<void> {
    await api.post(`/posts/${postId}/like`);
  },

  async unlikePost(postId: string): Promise<void> {
    await api.post(`/posts/${postId}/unlike`);
  },

  async getComments(postId: string): Promise<Comment[]> {
    const response = await api.get(`/comments/post/${postId}`);
    return response.data;
  },

  async addComment(postId: string, content: string): Promise<Comment> {
    const response = await api.post('/comments', { 
      postId, 
      text: content 
    });
    return response.data;
  },

  async deleteComment(commentId: string): Promise<void> {
    await api.delete(`/comments/${commentId}`);
  },
};