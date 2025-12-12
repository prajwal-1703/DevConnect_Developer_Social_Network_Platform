# Authentication Setup Guide

This guide will help you set up and test the authentication system between your React frontend and Node.js backend.

## 🚀 Quick Setup

### 1. Backend Setup
```bash
cd Backend
npm install
npm start
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Environment Configuration
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## 🔧 Fixed Issues

### 1. **Backend Authentication Controller**
- ✅ Fixed registration to return JWT token
- ✅ Fixed login to return proper user data
- ✅ Added proper error handling
- ✅ Removed password from responses

### 2. **User Model**
- ✅ Updated field names to match frontend interface
- ✅ Added missing fields (location, github, website, avatar, skills)
- ✅ Added follower/following counts

### 3. **API Routes**
- ✅ Fixed all auth middleware imports
- ✅ Fixed upload routes
- ✅ Corrected import paths

### 4. **Frontend Services**
- ✅ Axios client with automatic token management
- ✅ Proper error handling for 401 responses
- ✅ TypeScript interfaces for type safety

## 🧪 Testing Authentication

### Method 1: Use the Test Component
Add this to any component to test authentication:

```typescript
import AuthTest from './components/AuthTest';

// In your component
<AuthTest />
```

### Method 2: Manual Testing
```typescript
import { authService } from './services';

// Test registration
const { user, token } = await authService.register({
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123'
});

// Test login
const { user, token } = await authService.login('test@example.com', 'password123');

// Test get current user
const currentUser = await authService.getCurrentUser();
```

## 🔍 Troubleshooting

### Common Issues and Solutions

#### 1. **"Cannot connect to backend"**
**Solution:**
- Ensure backend is running on `http://localhost:5000`
- Check if MongoDB is running
- Verify `.env` file has correct JWT_SECRET

#### 2. **"CORS error"**
**Solution:**
- Backend CORS is configured for `http://localhost:5173`
- Make sure frontend is running on port 5173
- Check browser console for specific CORS errors

#### 3. **"Invalid credentials" on login**
**Solution:**
- Check if user exists in database
- Verify password hashing is working
- Check JWT_SECRET in backend `.env`

#### 4. **"Token not found" errors**
**Solution:**
- Ensure token is stored in localStorage as 'devconnect-token'
- Check if token is being sent in Authorization header
- Verify token format: `Bearer <token>`

#### 5. **"User not found" errors**
**Solution:**
- Check if user ID in token matches database
- Verify JWT token is valid and not expired
- Check if user was deleted from database

## 📋 Backend API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `GET /api/auth/test` - Test endpoint

### Request/Response Examples

#### Registration
```javascript
// Request
POST /api/auth/register
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}

// Response
{
  "msg": "User registered successfully",
  "user": {
    "id": "user_id",
    "username": "testuser",
    "email": "test@example.com",
    "avatar": null,
    "bio": null,
    "location": null,
    "github": null,
    "website": null,
    "skills": []
  },
  "token": "jwt_token_here"
}
```

#### Login
```javascript
// Request
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}

// Response
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "testuser",
    "email": "test@example.com",
    "avatar": null,
    "bio": null,
    "location": null,
    "github": null,
    "website": null,
    "skills": []
  }
}
```

## 🔐 Security Features

### 1. **Password Hashing**
- Passwords are hashed using bcryptjs
- Salt rounds: 10
- Never store plain text passwords

### 2. **JWT Tokens**
- 7-day expiration
- Signed with JWT_SECRET
- Automatically included in requests

### 3. **Token Management**
- Stored in localStorage
- Automatically added to request headers
- Cleared on 401 errors

### 4. **CORS Protection**
- Configured for specific origin
- Credentials enabled for cookies

## 🚀 Next Steps

1. **Test the authentication flow** using the AuthTest component
2. **Integrate with your login/register forms**
3. **Add protected routes** using the auth context
4. **Implement logout functionality**
5. **Add form validation** for better UX

## 📞 Support

If you're still having issues:

1. **Check browser console** for detailed error messages
2. **Check backend console** for server-side errors
3. **Verify database connection** in backend logs
4. **Test API endpoints** directly with tools like Postman
5. **Check network tab** in browser dev tools

Your authentication system is now fully configured and ready to use! 🎉
