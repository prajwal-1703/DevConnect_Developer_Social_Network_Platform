# API Integration Guide

This guide explains how to connect your React frontend to your Node.js backend using Axios.

## 🚀 Quick Start

### 1. Backend Setup
Make sure your backend is running:
```bash
cd Backend
npm install
npm start
```
Your backend should be running on `http://localhost:5000`

### 2. Frontend Setup
Your frontend already has Axios installed and configured. The API services are ready to use!

### 3. Environment Configuration
Create a `.env` file in the frontend directory:
```bash
# Copy the example file
cp env.example .env
```

Or create `.env` manually:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## 📁 File Structure

```
frontend/src/
├── services/
│   ├── api.ts                 # Main Axios client
│   ├── authService.ts         # Authentication services
│   ├── postsService.ts        # Posts management
│   ├── projectsService.ts     # Projects management
│   ├── notificationsService.ts # Notifications
│   ├── messagesService.ts     # Messaging
│   ├── index.ts              # Export all services
│   └── README.md             # Detailed documentation
├── config/
│   └── api.ts                # API configuration
└── components/
    └── APITest.tsx           # Test component
```

## 🔧 Usage in Components

### Import Services
```typescript
import { authService, postsService, projectsService } from '../services';
```

### Authentication Example
```typescript
// Login
const handleLogin = async (email: string, password: string) => {
  try {
    const { user, token } = await authService.login(email, password);
    localStorage.setItem('devconnect-token', token);
    // Handle successful login
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Posts Example
```typescript
// Get posts
const fetchPosts = async () => {
  try {
    const { posts, totalPages, currentPage } = await postsService.getPosts(1, 10);
    setPosts(posts);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  }
};
```

### Projects Example
```typescript
// Create project
const createProject = async (projectData) => {
  try {
    const newProject = await projectsService.createProject(projectData);
    setProjects(prev => [newProject, ...prev]);
  } catch (error) {
    console.error('Failed to create project:', error);
  }
};
```

## 🧪 Testing the Connection

1. Add the `APITest` component to your app temporarily:
```typescript
import APITest from './components/APITest';

// In your App.tsx or any component
<APITest />
```

2. Click "Test API Connection" to verify everything works.

## 🔐 Authentication Flow

The API client automatically handles authentication:

1. **Login/Register**: Store token in localStorage
2. **Automatic Token**: All requests include the token in headers
3. **Token Expiry**: Automatic redirect to login on 401 errors

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/update` - Update profile
- `POST /api/users/:id/follow` - Follow user
- `POST /api/users/:id/unfollow` - Unfollow user

### Posts
- `GET /api/posts` - Get posts (paginated)
- `POST /api/posts` - Create post
- `GET /api/posts/:id` - Get single post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like post
- `POST /api/posts/:id/unlike` - Unlike post

### Projects
- `GET /api/projects` - Get projects (paginated)
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/seen` - Mark as seen
- `DELETE /api/notifications/:id` - Delete notification

### Messages
- `GET /api/conversations` - Get conversations
- `POST /api/conversations` - Create conversation
- `GET /api/messages/:conversationId` - Get messages
- `POST /api/messages` - Send message

## 🛠️ Customization

### Adding New Services
1. Create a new service file in `src/services/`
2. Export it from `src/services/index.ts`
3. Add endpoints to `src/config/api.ts`

### Error Handling
All services include proper error handling. You can customize the error handling in the API client interceptors.

### TypeScript Support
All services are fully typed. You can extend the interfaces as needed.

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your backend has CORS configured for `http://localhost:5173`
2. **Connection Refused**: Ensure backend is running on port 5000
3. **Authentication Errors**: Check if token is properly stored in localStorage
4. **TypeScript Errors**: Make sure all imports are correct

### Debug Mode
Enable debug logging by adding to your `.env`:
```env
VITE_DEBUG=true
```

## 📚 Next Steps

1. **Integrate with Components**: Use the services in your React components
2. **Add Error Boundaries**: Implement proper error handling in your UI
3. **Loading States**: Add loading indicators for async operations
4. **Real-time Updates**: Consider adding Socket.IO for real-time features

## 🎯 Best Practices

1. **Always handle errors** in your components
2. **Use loading states** for better UX
3. **Validate data** before sending to API
4. **Use TypeScript** for type safety
5. **Test API connections** before deploying

Your API integration is now complete! 🎉
