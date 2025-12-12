import { api } from './api';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  profilePicUrl?: string;
  bio?: string;
  location?: string;
  github?: string;
  website?: string;
  skills?: string[];
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
  createdAt?: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  bio?: string;
  location?: string;
  github?: string;
  website?: string;
  skills?: string[];
  profilePic?: File;
}

export interface FollowData {
  followers: User[];
  following: User[];
}

export const userService = {
  async getUserProfile(userId: string): Promise<User> {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  async updateProfile(userData: UpdateUserData): Promise<User> {
    const formData = new FormData();
    if (userData.username !== undefined) formData.append('username', userData.username);
    if (userData.email !== undefined) formData.append('email', userData.email);
    if (userData.bio !== undefined) formData.append('bio', userData.bio);
    if (userData.location !== undefined) formData.append('location', userData.location);
    if (userData.github !== undefined) formData.append('github', userData.github);
    if (userData.website !== undefined) formData.append('website', userData.website);
    if (userData.skills !== undefined) formData.append('skills', JSON.stringify(userData.skills));
    if (userData.profilePic) formData.append('profilePic', userData.profilePic);

    const response = await api.put('/users/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

    validateAuthToken() {
      const token = localStorage.getItem('devconnect-token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      return token;
    },

  async followUser(userId: string): Promise<{ success: boolean; following: boolean }> {
      this.validateAuthToken();
    const response = await api.post(`/users/${userId}/follow`);
    return response.data;
  },

  async unfollowUser(userId: string): Promise<{ success: boolean; following: boolean }> {
      this.validateAuthToken();
    const response = await api.post(`/users/${userId}/unfollow`);
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

  async getFollowData(userId: string): Promise<FollowData> {
    const [followers, following] = await Promise.all([
      this.getFollowers(userId),
      this.getFollowing(userId),
    ]);
    return { followers, following };
  },

  async search(q: string, page: number = 1, limit: number = 12) {
    const response = await api.get(`/users/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`);
    return response.data;
  },
};
