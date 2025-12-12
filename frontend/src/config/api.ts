// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
  TIMEOUT: 10000, // 10 seconds
};

// Debug: Log the actual API URL being used
console.log('API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

// API Endpoints - Updated to match backend routes
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    UPDATE_PROFILE: '/auth/profile/:id',
  },
  USERS: {
    PROFILE: (id: string) => `/users/${id}`,
    FOLLOW: (id: string) => `/users/${id}/follow`,
    UNFOLLOW: (id: string) => `/users/${id}/unfollow`,
    FOLLOWERS: (id: string) => `/users/${id}/followers`,
    FOLLOWING: (id: string) => `/users/${id}/following`,
    UPDATE: '/users/update',
  },
  POSTS: {
    LIST: '/posts',
    CREATE: '/posts',
    GET: (id: string) => `/posts/${id}`,
    DELETE: (id: string) => `/posts/${id}`,
    LIKE: (id: string) => `/posts/${id}/like`,
    UNLIKE: (id: string) => `/posts/${id}/unlike`,
    USER_POSTS: (userId: string) => `/posts/user/${userId}`,
  },
  PROJECTS: {
    LIST: '/projects',
    CREATE: '/projects',
    GET: (id: string) => `/projects/${id}`,
    UPDATE: (id: string) => `/projects/${id}`,
    DELETE: (id: string) => `/projects/${id}`,
    USER_PROJECTS: (userId: string) => `/projects/user/${userId}`,
  },
  COMMENTS: {
    LIST: '/comments',
    CREATE: '/comments',
    DELETE: (id: string) => `/comments/${id}`,
  },
  LIKES: {
    CREATE: '/likes',
    DELETE: '/likes',
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_SEEN: (id: string) => `/notifications/${id}/seen`,
    DELETE: (id: string) => `/notifications/${id}`,
  },
  MESSAGES: {
    CONVERSATIONS: '/conversations',
    CREATE_CONVERSATION: '/conversations',
    MESSAGES: (conversationId: string) => `/messages/${conversationId}`,
    SEND: '/messages',
    MARK_SEEN: (id: string) => `/messages/${id}/seen`,
  },
  UPLOAD: {
    IMAGE: '/upload/image',
  },
};
