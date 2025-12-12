import { api } from './api';

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'message';
  message: string;
  isSeen: boolean;
  createdAt: string;
  data?: {
    postId?: string;
    projectId?: string;
    commentId?: string;
    fromUserId?: string;
  };
}

export const notificationsService = {
  async getNotifications(): Promise<Notification[]> {
    const response = await api.get('/notifications');
    return response.data;
  },

  async markAsSeen(notificationId: string): Promise<void> {
    await api.put(`/notifications/${notificationId}/seen`);
  },

  async deleteNotification(notificationId: string): Promise<void> {
    await api.delete(`/notifications/${notificationId}`);
  },
};
