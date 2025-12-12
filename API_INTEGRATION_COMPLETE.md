# API Integration Complete - DevConnect Frontend & Backend

## Overview
This document outlines the complete API integration between the DevConnect frontend (React/TypeScript) and backend (Node.js/Express) using Axios for HTTP requests.

## Backend API Structure

### Base URL
- **Development**: `http://localhost:5000`
- **API Prefix**: `/api`

### Available Endpoints

#### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Get current user
- `PUT /profile/:id` - Update user profile

#### Users (`/api/users`)
- `GET /:id` - Get user profile
- `PUT /update` - Update user profile (with file upload)
- `POST /:id/follow` - Follow user
- `POST /:id/unfollow` - Unfollow user
- `GET /:id/followers` - Get user followers
- `GET /:id/following` - Get user following

#### Posts (`/api/posts`)
- `GET /` - Get all posts
- `POST /` - Create post (with optional image upload)
- `GET /:id` - Get specific post
- `DELETE /:id` - Delete post
- `GET /user/:userId` - Get user's posts
- `POST /:id/like` - Like post
- `POST /:id/unlike` - Unlike post

#### Projects (`/api/projects`)
- `GET /` - Get all projects
- `POST /` - Create project
- `GET /:id` - Get specific project
- `PUT /:id` - Update project
- `DELETE /:id` - Delete project
- `GET /user/:userId` - Get user's projects

#### Comments (`/api/comments`)
- `POST /` - Create comment
- `DELETE /:id` - Delete comment

#### Likes (`/api/likes`)
- `POST /` - Create like
- `DELETE /` - Remove like

#### Notifications (`/api/notifications`)
- `GET /` - Get user notifications
- `PUT /:id/seen` - Mark notification as seen
- `DELETE /:id` - Delete notification

#### Messages (`/api/messages`)
- `POST /` - Send message
- `GET /:conversationId` - Get conversation messages
- `PUT /:id/seen` - Mark message as seen

#### Conversations (`/api/conversations`)
- `GET /` - Get user conversations
- `POST /` - Create conversation

#### Upload (`/api/upload`)
- `POST /image` - Upload image file

## Frontend API Integration

### Axios Configuration
Located in `frontend/src/services/api.ts`:

```typescript
export const api = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}/api`,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Authentication Handling
- **Token Storage**: JWT tokens stored in localStorage as `devconnect-token`
- **Request Interceptor**: Automatically adds Bearer token to requests
- **Response Interceptor**: Handles 401 errors by clearing token and redirecting to login

### Service Files

#### 1. Authentication Service (`authService.ts`)
```typescript
- login(email, password)
- register(userData)
- getCurrentUser()
- logout()
- updateUser(userData)
- followUser(userId)
- unfollowUser(userId)
- getUserProfile(userId)
- getFollowers(userId)
- getFollowing(userId)
```

#### 2. Posts Service (`postsService.ts`)
```typescript
- getPosts()
- getPost(postId)
- getUserPosts(userId)
- createPost(postData)
- deletePost(postId)
- likePost(postId)
- unlikePost(postId)
```

#### 3. Projects Service (`projectsService.ts`)
```typescript
- getProjects()
- getProject(projectId)
- getUserProjects(userId)
- createProject(projectData)
- updateProject(projectId, projectData)
- deleteProject(projectId)
```

#### 4. User Service (`userService.ts`)
```typescript
- getUserProfile(userId)
- updateProfile(userData)
- followUser(userId)
- unfollowUser(userId)
- getFollowers(userId)
- getFollowing(userId)
```

#### 5. Comments Service (`commentsService.ts`)
```typescript
- getPostComments(postId)
- getProjectComments(projectId)
- createComment(commentData)
- deleteComment(commentId)
```

#### 6. Likes Service (`likesService.ts`)
```typescript
- likePost(postId)
- likeProject(projectId)
- unlikePost(postId)
- unlikeProject(projectId)
```

#### 7. Messages Service (`messagesService.ts`)
```typescript
- getConversations()
- createConversation(conversationData)
- getMessages(conversationId)
- sendMessage(conversationId, content)
- markMessageAsSeen(messageId)
```

#### 8. Notifications Service (`notificationsService.ts`)
```typescript
- getNotifications()
- markAsSeen(notificationId)
- deleteNotification(notificationId)
```

#### 9. Upload Service (`uploadService.ts`)
```typescript
- uploadImage(imageFile)
```

## File Upload Handling

### Posts with Images
```typescript
const formData = new FormData();
formData.append('content', postData.content);
if (postData.image) {
  formData.append('image', postData.image);
}
```

### User Profile Updates
```typescript
const formData = new FormData();
if (userData.profilePic) {
  formData.append('profilePic', userData.profilePic);
}
```

## Error Handling

### Global Error Interceptor
- **401 Unauthorized**: Automatically clears token and redirects to login
- **Network Errors**: Properly handled with user-friendly messages
- **Validation Errors**: Backend validation errors displayed to user

### Service-Level Error Handling
Each service method includes try-catch blocks for proper error handling:

```typescript
try {
  const response = await api.get('/endpoint');
  return response.data;
} catch (error: any) {
  throw new Error(error.response?.data?.msg || error.message);
}
```

## Testing

### API Integration Test
Access the API test page at `/api-test` to verify all connections:

- **Authentication Tests**: Login, register, get current user
- **Posts Tests**: Create, read, update, delete posts
- **Projects Tests**: Create, read, update, delete projects
- **User Tests**: Profile management, follow/unfollow
- **Messaging Tests**: Conversations and messages
- **Notifications Tests**: Get and manage notifications

## Environment Configuration

### Frontend Environment Variables
Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### Backend Environment Variables
Create `Backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devconnect
JWT_SECRET=your_jwt_secret_here
```

## Usage Examples

### 1. User Authentication
```typescript
import { authService } from '../services';

// Login
const { user, token } = await authService.login(email, password);

// Register
const { user, token } = await authService.register({ username, email, password });

// Get current user
const user = await authService.getCurrentUser();
```

### 2. Posts Management
```typescript
import { postsService } from '../services';

// Get all posts
const posts = await postsService.getPosts();

// Create post
const newPost = await postsService.createPost({
  content: 'Hello world!',
  tags: ['react', 'typescript']
});

// Like post
await postsService.likePost(postId);
```

### 3. Projects Management
```typescript
import { projectsService } from '../services';

// Get all projects
const projects = await projectsService.getProjects();

// Create project
const newProject = await projectsService.createProject({
  title: 'My Project',
  description: 'Project description',
  tags: ['react', 'nodejs'],
  githubLink: 'https://github.com/user/repo'
});
```

### 4. File Uploads
```typescript
import { uploadService } from '../services';

// Upload image
const { imageUrl } = await uploadService.uploadImage(imageFile);
```

## Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **CORS Configuration**: Properly configured for frontend origin
3. **Request Interceptors**: Automatic token attachment
4. **Response Interceptors**: Automatic token refresh and error handling
5. **File Upload Security**: Proper file type validation

## Performance Optimizations

1. **Request Timeout**: 10-second timeout for all requests
2. **Error Boundaries**: Proper error handling in React components
3. **Loading States**: User feedback during API calls
4. **Caching**: React Query for data caching and synchronization

## Next Steps

1. **Real-time Features**: Implement Socket.io for real-time messaging
2. **Image Optimization**: Add image compression and resizing
3. **Pagination**: Implement pagination for posts and projects
4. **Search**: Add search functionality for posts and users
5. **Push Notifications**: Implement push notifications for mobile

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for frontend URL
2. **Token Issues**: Check localStorage for token and ensure it's not expired
3. **File Upload Issues**: Verify multipart/form-data headers
4. **Network Errors**: Check if backend server is running on correct port

### Debug Tools

1. **API Test Page**: Visit `/api-test` to test all endpoints
2. **Browser DevTools**: Check Network tab for request/response details
3. **Console Logs**: Check browser console for error messages
4. **Backend Logs**: Check server console for error messages

## Conclusion

The API integration is now complete with:
- ✅ All backend endpoints connected
- ✅ Proper authentication handling
- ✅ File upload support
- ✅ Error handling and user feedback
- ✅ TypeScript interfaces for type safety
- ✅ Comprehensive testing tools
- ✅ Documentation and examples

The frontend is now fully integrated with the backend API using Axios, providing a robust foundation for the DevConnect application.
