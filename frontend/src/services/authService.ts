import { api } from './api';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  github?: string;
  website?: string;
  skills?: string[];
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/auth/login', { email, password });
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('devconnect-token', response.data.token);
    }
    return { user: response.data.user, token: response.data.token };
  },

  async register(userData: { username: string; email: string; password: string }): Promise<AuthResponse> {
    console.log('Registering user with data:', userData);
    console.log('API base URL:', api.defaults.baseURL);
    
    try {
      const response = await api.post('/auth/register', userData);
      console.log('Registration response:', response.data);
      
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('devconnect-token', response.data.token);
      }
      return { user: response.data.user, token: response.data.token };
    } catch (error: any) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('devconnect-token');
  },

  async updateUser(userData: Partial<User> | FormData): Promise<User> {
    if (userData instanceof FormData) {
      const response = await api.put('/users/update', userData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    }
    // Build FormData for multipart to support profilePic and arrays
    const form = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (Array.isArray(value)) {
        form.append(key, JSON.stringify(value));
      } else {
        form.append(key, String(value));
      }
    });
    const response = await api.put('/users/update', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async followUser(userId: string): Promise<void> {
    await api.post(`/users/${userId}/follow`);
  },

  async unfollowUser(userId: string): Promise<void> {
    await api.post(`/users/${userId}/unfollow`);
  },

  async getUserProfile(userId: string): Promise<User> {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  async getFollowers(userId: string): Promise<User[]> {
    const response = await api.get(`/users/${userId}/followers`);
    return response.data;
  },

  async getFollowing(userId: string): Promise<User[]> {
    const response = await api.get(`/users/${userId}/following`);
    return response.data;
  },
};