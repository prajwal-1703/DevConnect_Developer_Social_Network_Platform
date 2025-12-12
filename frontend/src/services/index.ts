// Export all services
export { authService } from './authService';
export { postsService } from './postsService';
export { projectsService } from './projectsService';
export { userService } from './userService';
export { notificationsService } from './notificationsService';
export { messagesService } from './messagesService';
export { commentsService } from './commentsService';
export { likesService } from './likesService';
export { uploadService } from './uploadService';

// Export the API client
export { api } from './api';

// Export types
export type { User, AuthResponse } from './authService';
export type { Post, Comment, CreatePostData } from './postsService';
export type { Project, CreateProjectData } from './projectsService';
export type { User as UserType, UpdateUserData, FollowData } from './userService';
export type { Notification } from './notificationsService';
export type { Message, Conversation, CreateConversationData } from './messagesService';
export type { Comment as CommentType, CreateCommentData } from './commentsService';
export type { Like, CreateLikeData } from './likesService';
export type { UploadResponse } from './uploadService';
