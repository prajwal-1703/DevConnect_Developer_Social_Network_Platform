# API Services Documentation

This directory contains all the API service functions for connecting the React frontend to the Node.js backend using Axios.

## Services Overview

### 1. **api.ts** - Main API Client
- Configured Axios instance with base URL and interceptors
- Automatic token management
- Error handling for authentication failures

### 2. **authService.ts** - Authentication Services
- `login(email, password)` - User login
- `register(userData)` - User registration
- `getCurrentUser()` - Get current user profile
- `updateUser(userData)` - Update user profile
- `followUser(userId)` - Follow a user
- `unfollowUser(userId)` - Unfollow a user
- `getUserProfile(userId)` - Get user profile by ID
- `getFollowers(userId)` - Get user's followers
- `getFollowing(userId)` - Get users that the user follows

### 3. **postsService.ts** - Posts Management
- `getPosts(page, limit)` - Get paginated posts
- `getPost(postId)` - Get single post
- `getUserPosts(userId)` - Get user's posts
- `createPost(postData)` - Create new post
- `deletePost(postId)` - Delete post
- `likePost(postId)` - Like a post
- `unlikePost(postId)` - Unlike a post
- `getComments(postId)` - Get post comments
- `addComment(postId, content)` - Add comment to post
- `deleteComment(commentId)` - Delete comment

### 4. **projectsService.ts** - Projects Management
- `getProjects(page, limit)` - Get paginated projects
- `getProject(projectId)` - Get single project
- `getUserProjects(userId)` - Get user's projects
- `createProject(projectData)` - Create new project
- `updateProject(projectId, projectData)` - Update project
- `deleteProject(projectId)` - Delete project
- `likeProject(projectId)` - Like a project
- `unlikeProject(projectId)` - Unlike a project

### 5. **notificationsService.ts** - Notifications
- `getNotifications()` - Get user notifications
- `markAsSeen(notificationId)` - Mark notification as seen
- `deleteNotification(notificationId)` - Delete notification

### 6. **messagesService.ts** - Messaging
- `getConversations()` - Get user conversations
- `createConversation(conversationData)` - Create new conversation
- `getMessages(conversationId)` - Get conversation messages
- `sendMessage(conversationId, content)` - Send message
- `markMessageAsSeen(messageId)` - Mark message as seen

## Usage Examples

### Authentication
```typescript
import { authService } from './services';

// Login
const { user, token } = await authService.login('user@example.com', 'password');
localStorage.setItem('devconnect-token', token);

// Register
const { user, token } = await authService.register({
  username: 'johndoe',
  email: 'john@example.com',
  password: 'password123'
});
```

### Posts
```typescript
import { postsService } from './services';

// Get posts
const { posts, totalPages, currentPage } = await postsService.getPosts(1, 10);

// Create post
const newPost = await postsService.createPost({
  content: 'Hello world!',
  images: ['image1.jpg'],
  codeSnippet: {
    language: 'javascript',
    code: 'console.log("Hello");'
  }
});
```

### Projects
```typescript
import { projectsService } from './services';

// Get projects
const { projects } = await projectsService.getProjects(1, 12);

// Create project
const newProject = await projectsService.createProject({
  title: 'My Project',
  description: 'A cool project',
  techStack: ['React', 'Node.js'],
  status: 'in-progress'
});
```

## Configuration

The API base URL is configured in `src/config/api.ts`. You can override it using environment variables:

```bash
# .env file
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## Error Handling

All services include proper error handling:
- Authentication errors (401) automatically redirect to login
- Network errors are properly caught and can be handled in components
- TypeScript interfaces ensure type safety

## TypeScript Support

All services are fully typed with TypeScript interfaces for:
- Request parameters
- Response data
- Error objects

This ensures compile-time type checking and better IDE support.
