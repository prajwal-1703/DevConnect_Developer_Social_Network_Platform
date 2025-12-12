# DevConnect - Developer Social Network Platform

A complete social platform for developers to connect, share projects, collaborate, and communicate in real-time.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [System Requirements](#system-requirements)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Features](#features)
- [Troubleshooting](#troubleshooting)
- [Documentation](#documentation)
- [Contributing](#contributing)

## 🎯 Project Overview

DevConnect is a full-stack web application that enables developers to:
- Create and manage user profiles
- Share posts and projects
- Follow other developers
- Send real-time messages
- Like and comment on content
- Receive notifications
- Collaborate and network

**Current Status**: ✅ **Fully Functional (41/41 API Endpoints Connected)**

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v14+)
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Real-time**: Socket.IO
- **File Upload**: Multer

### Frontend
- **Framework**: React 18+
- **Language**: TypeScript
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **State Management**: Context API
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Custom + shadcn/ui

### Additional Tools
- **API Testing**: Postman (collection included)
- **Version Control**: Git
- **Package Manager**: npm/yarn

## 📦 System Requirements

### Minimum Requirements
- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher
- **MongoDB**: v4.4 or higher
- **RAM**: 2GB minimum
- **Disk Space**: 1GB minimum

### Recommended
- **Node.js**: v16.0.0 or higher
- **MongoDB**: v5.0 or higher
- **RAM**: 4GB or higher
- **OS**: Windows 10+, macOS 10.15+, or Ubuntu 18.04+

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
# Using git
git clone https://github.com/yourusername/devconnect.git
cd devconnect
```

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Create .env file (see Environment Configuration section)
# Copy the content from .env.example or create new file
```

### Step 3: Setup Frontend

```bash
# Navigate to frontend directory (in new terminal)
cd frontend

# Install dependencies
npm install

# Create .env file (see Environment Configuration section)
```

### Step 4: Start MongoDB

```bash
# If MongoDB is installed locally
mongod

# Or use MongoDB Atlas (cloud database)
# Connection string will be in your .env file
```

## ⚙️ Environment Configuration

### Backend Environment Setup

Create a file named `.env` in the `Backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://DevConnect:DevConnect%40108@localhost:27017/devconnectDB?authSource=admin

# JWT Configuration
JWT_SECRET=yourSuperSecretKey
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_IMAGE_TYPES=jpg,jpeg,png,gif,webp

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Redis Configuration (Optional)
REDIS_URL=redis://localhost:6379

# API Documentation
API_VERSION=1.0.0
API_PREFIX=/api
```

### Frontend Environment Setup

Create a file named `.env` in the `frontend` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000

# Application Configuration
VITE_APP_NAME=DevConnect
VITE_APP_VERSION=1.0.0

# Debug Mode (optional)
VITE_DEBUG=false

# Feature Flags
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_REAL_TIME_MESSAGING=true
VITE_ENABLE_IMAGE_UPLOAD=true
```

### MongoDB Setup

MongoDB can be set up in multiple ways depending on your preference and operating system. Choose the method that best fits your workflow.

#### **Option 1: Local MongoDB Installation**

##### Windows

1. **Download MongoDB Community Edition**
   - Visit https://www.mongodb.com/try/download/community
   - Select Windows
   - Download the MSI installer

2. **Install MongoDB**
   - Run the downloaded MSI file
   - Follow the installation wizard
   - Choose "Install MongoDB as a Service" (recommended)
   - Installation path: `C:\Program Files\MongoDB\Server\7.0`

3. **Start MongoDB Service**
   ```bash
   # MongoDB starts automatically as a service
   # To verify it's running:
   net start MongoDB
   
   # To check status:
   sc query MongoDB
   ```

4. **Verify Installation**
   ```bash
   # Open command prompt and run:
   mongosh
   # Should connect to MongoDB shell
   ```

5. **Stop MongoDB (if needed)**
   ```bash
   net stop MongoDB
   ```

##### macOS

1. **Install using Homebrew (Recommended)**
   ```bash
   # Install Homebrew if not already installed
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   
   # Tap MongoDB formula
   brew tap mongodb/brew
   
   # Install MongoDB Community Edition
   brew install mongodb-community
   ```

2. **Start MongoDB Service**
   ```bash
   # Start MongoDB as a service
   brew services start mongodb-community
   
   # Or run without service:
   mongod --config /usr/local/etc/mongod.conf
   ```

3. **Verify Installation**
   ```bash
   mongosh
   ```

4. **Stop MongoDB (if needed)**
   ```bash
   brew services stop mongodb-community
   ```

##### Linux (Ubuntu/Debian)

1. **Install MongoDB**
   ```bash
   # Import MongoDB GPG key
   wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
   
   # Add MongoDB repository
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   
   # Update package list
   sudo apt-get update
   
   # Install MongoDB
   sudo apt-get install -y mongodb-org
   ```

2. **Start MongoDB Service**
   ```bash
   # Start MongoDB service
   sudo systemctl start mongod
   
   # Enable service to start on boot
   sudo systemctl enable mongod
   
   # Check status
   sudo systemctl status mongod
   ```

3. **Verify Installation**
   ```bash
   mongosh
   ```

4. **Stop MongoDB (if needed)**
   ```bash
   sudo systemctl stop mongod
   ```

---

#### **Option 2: Docker Container (Recommended for Development)**

##### Using Docker with Volume Persistence

1. **Prerequisites**
   - Install Docker: https://www.docker.com/products/docker-desktop
   - Verify installation: `docker --version`

2. **Create MongoDB Volume**
   ```bash
   # Create a named volume for data persistence
   docker volume create mongodb_data
   ```

3. **Run MongoDB Container**
   ```bash
   # Run MongoDB with volume mounting
   docker run -d \
     --name devconnect-mongo \
     -p 27017:27017 \
     -e MONGO_INITDB_ROOT_USERNAME=admin \
     -e MONGO_INITDB_ROOT_PASSWORD=password123 \
     -v mongodb_data:/data/db \
     -v mongodb_config:/data/configdb \
     mongo:7.0
   ```

4. **Verify Container**
   ```bash
   # Check if container is running
   docker ps
   
   # View logs
   docker logs devconnect-mongo
   ```

5. **Connect to MongoDB**
   ```bash
   # Using mongosh
   docker exec -it devconnect-mongo mongosh -u admin -p password123
   ```

6. **Update Backend .env**
   ```env
   MONGO_URI=mongodb://admin:password123@localhost:27017/devconnectDB?authSource=admin
   ```

7. **Stop Container**
   ```bash
   docker stop devconnect-mongo
   ```

8. **Resume Container**
   ```bash
   docker start devconnect-mongo
   ```

9. **Remove Container (data persists in volume)**
   ```bash
   docker rm devconnect-mongo
   ```

##### Using Docker Compose (Recommended for Teams)

Create `docker-compose.yml` in project root:

```yaml
version: '3.9'

services:
  mongodb:
    image: mongo:7.0
    container_name: devconnect-mongo
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
      MONGO_INITDB_DATABASE: devconnectDB
    volumes:
      - mongodb_data:/data/db
      - mongodb_config:/data/configdb
      - ./init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js:ro
    networks:
      - devconnect-network
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  mongodb_data:
    driver: local
  mongodb_config:
    driver: local

networks:
  devconnect-network:
    driver: bridge
```

Start MongoDB with Docker Compose:

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f mongodb

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

##### Docker Network Configuration

Create `init-mongo.js` for automatic setup:

```javascript
// init-mongo.js
db.createUser({
  user: 'devconnect_user',
  pwd: 'devconnect_pass123',
  roles: [
    {
      role: 'readWrite',
      db: 'devconnectDB'
    }
  ]
});

db.devconnectDB.createCollection('users');
db.devconnectDB.createCollection('posts');
db.devconnectDB.createCollection('projects');
```

Update Backend .env for Docker:

```env
# For Docker container communication
MONGO_URI=mongodb://admin:password123@mongodb:27017/devconnectDB?authSource=admin

# For local machine
MONGO_URI=mongodb://admin:password123@localhost:27017/devconnectDB?authSource=admin
```

---

#### **Option 3: MongoDB Atlas (Cloud Database)**

##### Setup Steps

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Click "Sign Up"
   - Create account with email
   - Verify email address

2. **Create a New Project**
   - Click "Create New Project"
   - Name: "DevConnect"
   - Click "Create Project"

3. **Create a Cluster**
   - Click "Build a Database"
   - Choose "M0 Free" tier
   - Select cloud provider (AWS, Google Cloud, or Azure)
   - Select region closest to you
   - Cluster name: "devconnect-cluster"
   - Click "Create"
   - Wait for cluster to initialize (5-10 minutes)

4. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `devconnect_user`
   - Password: (generate or set your own)
   - Select "Built-in Role"
   - Choose "Read and write to any database"
   - Click "Add User"

5. **Setup Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (for development)
   - Click "Confirm"
   - For production: Add specific IPs only

6. **Get Connection String**
   - Go to "Clusters"
   - Click "Connect" button
   - Select "Connect your application"
   - Copy the connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`

7. **Update Backend .env**
   ```env
   MONGO_URI=mongodb+srv://devconnect_user:your_password@devconnect-cluster.mongodb.net/devconnectDB?retryWrites=true&w=majority
   ```

8. **Test Connection**
   ```bash
   # In backend directory
   npm start
   # Should see: ✅ MongoDB Connected
   ```

##### Atlas Features

- ✅ Free tier with 512MB storage
- ✅ Automatic backups
- ✅ Built-in replication
- ✅ Scalable to production
- ✅ No infrastructure management
- ✅ Monitoring and alerts

##### Atlas Limitations

- ❌ Limited to 5GB data (M0 tier)
- ❌ Shared resources
- ❌ Basic monitoring
- ❌ 24-hour backup retention

---

#### **Comparison Table**

| Feature | Local | Docker | Atlas |
|---------|-------|--------|-------|
| **Setup Time** | 10-15 min | 5 min | 10 min |
| **Cost** | Free | Free | Free (M0) |
| **Data Persistence** | Automatic | Volume based | Cloud backup |
| **Scalability** | Manual | Via Docker Compose | Automatic |
| **Backup** | Manual | Manual | Automatic |
| **Monitoring** | No | Limited | Built-in |
| **Production Ready** | Yes | Yes | Yes |
| **Best For** | Learning | Development | Production |

---

#### **Troubleshooting MongoDB Setup**

##### Connection Issues

**Error: "connection refused"**
```bash
# Check if MongoDB is running
# Windows
sc query MongoDB

# macOS
brew services list

# Linux
sudo systemctl status mongod

# Docker
docker ps | grep mongo
```

**Error: "Authentication failed"**
```bash
# Verify connection string
# Check username and password
# Verify database name
# Ensure IP whitelist includes your machine (Atlas)
```

##### Data Issues

**Check MongoDB Version**
```bash
mongosh --version
```

**Connect and Verify**
```bash
# Local connection
mongosh mongodb://localhost:27017

# Docker connection
docker exec -it devconnect-mongo mongosh

# Atlas connection
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/database"
```

**Check Databases**
```bash
# In MongoDB shell
show databases
show collections
db.stats()
```

---

#### **MongoDB Management Commands**

```bash
# Backup Database (Local)
mongodump --uri mongodb://localhost:27017/devconnectDB --out ./backups

# Restore Database
mongorestore --uri mongodb://localhost:27017 ./backups/devconnectDB

# Backup from Atlas
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/devconnectDB"

# Export Collection to JSON
mongoexport --uri mongodb://localhost:27017/devconnectDB --collection users --out users.json

# Import from JSON
mongoimport --uri mongodb://localhost:27017/devconnectDB --collection users --file users.json
```

---

## 📁 Project Structure

```
devconnect/
├── Backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Post.js
│   │   │   ├── Project.js
│   │   │   ├── Comment.js
│   │   │   ├── Message.js
│   │   │   ├── Notification.js
│   │   │   └── ...
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── posts.js
│   │   │   ├── projects.js
│   │   │   ├── comments.js
│   │   │   ├── messages.js
│   │   │   └── ...
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env (not tracked)
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Index.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Feed.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── Messages.tsx
│   │   │   └── NotFound.tsx
│   │   ├── components/
│   │   │   ├── Layout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── CreatePost.tsx
│   │   │   ├── PostCard.tsx
│   │   │   ├── CreateProject.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── postsService.ts
│   │   │   ├── projectsService.ts
│   │   │   ├── messagesService.ts
│   │   │   ├── uploadService.ts
│   │   │   └── index.ts
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   └── MessagingContext.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env (not tracked)
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
├── CONTRIBUTE.md (contribution guidelines)
├── Readme.md
└── DevConnectLocal.postman_collection.json
```

## 🔌 API Integration

### Backend API Endpoints (41 Total)

#### Authentication (4 endpoints)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile/:id` - Update profile

#### Users (6 endpoints)
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/update` - Update user profile
- `POST /api/users/:id/follow` - Follow user
- `POST /api/users/:id/unfollow` - Unfollow user
- `GET /api/users/:id/followers` - Get followers
- `GET /api/users/:id/following` - Get following

#### Posts (7 endpoints)
- `POST /api/posts` - Create post
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/posts/user/:userId` - Get user posts
- `POST /api/posts/:id/like` - Like post
- `POST /api/posts/:id/unlike` - Unlike post

#### Projects (6 endpoints)
- `POST /api/projects` - Create project
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/user/:userId` - Get user projects

#### Comments (4 endpoints)
- `POST /api/comments` - Add comment
- `GET /api/comments/post/:postId` - Get post comments
- `GET /api/comments/project/:projectId` - Get project comments
- `DELETE /api/comments/:id` - Delete comment

#### Likes (4 endpoints)
- `POST /api/likes` - Like item
- `DELETE /api/likes` - Unlike item
- `GET /api/likes/post/:postId` - Get post likes
- `GET /api/likes/project/:projectId` - Get project likes

#### Messages (3 endpoints)
- `POST /api/messages` - Send message
- `GET /api/messages/:conversationId` - Get messages
- `PUT /api/messages/:id/seen` - Mark as seen

#### Conversations (2 endpoints)
- `POST /api/conversations` - Create conversation
- `GET /api/conversations` - Get conversations

#### Notifications (3 endpoints)
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/seen` - Mark as seen
- `DELETE /api/notifications/:id` - Delete notification

#### Upload (2 endpoints)
- `POST /api/upload/image` - Upload image
- `POST /api/upload/avatar` - Upload avatar

### Using Services in Components

```typescript
import { authService, postsService, projectsService } from '../services';

// Example: Fetch posts
const fetchPosts = async () => {
  try {
    const posts = await postsService.getPosts();
    setPosts(posts);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## ✨ Features

### ✅ Completed Features

#### Authentication & Users
- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ User profiles with bio, GitHub, portfolio
- ✅ Follow/unfollow users
- ✅ View followers and following lists

#### Posts
- ✅ Create, read, update, delete posts
- ✅ Image upload with posts
- ✅ Like/unlike posts
- ✅ Comment on posts
- ✅ View user feed
- ✅ Tag system for posts

#### Projects
- ✅ Create, read, update, delete projects
- ✅ Project showcase with images
- ✅ GitHub links and tech stack tags
- ✅ Like/unlike projects
- ✅ Comment on projects

#### Messaging
- ✅ Real-time messaging with Socket.IO
- ✅ Create conversations with other users
- ✅ Message history
- ✅ Online/offline status
- ✅ Message delivery status

#### Notifications (Need to work on )
- ✅ Real-time notifications
- ✅ Mark notifications as seen
- ✅ Delete notifications
- ✅ Notification types (like, comment, follow, message)

#### UI/UX
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark/light theme support
- ✅ Loading states and error handling
- ✅ Toast notifications for user feedback
- ✅ Smooth animations and transitions
- ✅ Protected routes

## 🧪 Testing

### API Testing with Postman

1. Import the collection:
   ```
   File → Import → DevConnectLocal.postman_collection.json
   ```

2. Set environment variable `{{authToken}}` in Postman

3. Test endpoints in the following order:
   - Auth → Register
   - Auth → Login
   - User → getUser
   - Posts → createPost
   - Projects → createProject

### Manual Testing Flow

1. **Register a new account**
   ```
   Visit http://localhost:5173/register
   Fill in username, email, password
   Click Register
   ```

2. **Create a post**
   ```
   Navigate to Feed page
   Click "Create Post"
   Add content and image
   Submit
   ```

3. **Create a project**
   ```
   Navigate to Projects page
   Click "Create Project"
   Fill project details
   Add GitHub link and tags
   Submit
   ```

4. **Test messaging**
   ```
   Navigate to Messages
   Start conversation with another user
   Send messages in real-time
   ```

## 🐛 Troubleshooting

### Common Issues

#### 1. "Cannot connect to MongoDB"
**Solution:**
```bash
# Check if MongoDB is running
mongod

# Verify MONGO_URI in Backend/.env
MONGO_URI=mongodb://localhost:27017/devconnectDB
```

#### 2. "CORS error when API calls fail"
**Solution:**
- Ensure Backend is running on port 5000
- Verify CORS_ORIGIN in Backend/.env matches frontend URL
- Check frontend .env has correct VITE_API_URL

#### 3. "Frontend not connecting to backend"
**Solution:**
```bash
# Check if backend is running
curl http://localhost:5000

# Verify ports:
# Backend: 5000
# Frontend: 5173

# Check .env files are in correct locations
```

#### 4. "Authentication token issues"
**Solution:**
- Clear localStorage: `localStorage.clear()`
- Hard refresh browser: Ctrl+Shift+R
- Check JWT_SECRET in Backend/.env

#### 5. "File upload not working"
**Solution:**
- Check MAX_FILE_SIZE in Backend/.env (default: 5MB)
- Verify ALLOWED_IMAGE_TYPES
- Ensure uploads directory exists

### Debug Mode

Enable debugging:

```bash
# Backend
DEBUG=* npm start

# Frontend
# Set VITE_DEBUG=true in .env
```

Check logs:
- Backend console for server errors
- Browser console (F12) for frontend errors
- Network tab for API request/response details

### Getting Help

1. Check documentation files
2. Review console logs for error messages
3. Test API endpoints with Postman
4. Check MongoDB connection

## 📚 Documentation

### Available Documentation Files

This project includes comprehensive documentation:

**For Setup & Authentication:**
- **AUTHENTICATION_SETUP_GUIDE.md** - Step-by-step authentication setup and testing

**For API Integration:**
- **API_INTEGRATION_GUIDE.md** - How to use API services in components
- **API_INTEGRATION_COMPLETE.md** - Complete API endpoints reference

**For Troubleshooting:**
- **REGISTRATION_TROUBLESHOOTING.md** - Debug registration issues

**For Project Status:**
- **PROJECT_STATUS_REPORT.md** - Current project completion status

**For Contributing:**
- **CONTRIBUTE.md** - Contribution guidelines and workflow

## 🚀 Deployment

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

### Backend Deployment (Heroku)

```bash
# Install Heroku CLI
# Deploy using Heroku dashboard or CLI

# Update frontend VITE_API_URL to production URL
```

### Database Deployment (MongoDB Atlas)

Use MongoDB Atlas for cloud database:
1. Create cluster at https://www.mongodb.com/cloud/atlas
2. Update MONGO_URI with connection string

## 🔐 Security Considerations

### Before Production

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS
- [ ] Configure rate limiting
- [ ] Setup CORS properly for production domains
- [ ] Enable MongoDB authentication
- [ ] Setup file upload validation
- [ ] Configure Content Security Policy headers

### Security Features Implemented

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ CORS protection
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ File upload validation
- ✅ Input sanitization

## 📝 Scripts

### Backend Scripts

```bash
npm start          # Start development server
npm run dev        # Start with nodemon (auto-reload)
npm test           # Run tests
npm run lint       # Run linter
```

### Frontend Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run linter
npm run type-check # Check TypeScript types
```

## 🤝 Contributing

We welcome contributions from developers of all skill levels! To contribute:

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch
4. **Make** your changes
5. **Test** your changes
6. **Commit** your changes
7. **Push** to your fork
8. **Open** a Pull Request

For detailed contribution guidelines, see **[CONTRIBUTE.md](./CONTRIBUTE.md)**

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👥 Authors

- **Prjwal Athare** - Initial work

## 🙏 Acknowledgments

- MongoDB for database
- Express.js for backend framework
- React for frontend library
- Vite for build tool
- Socket.IO for real-time communication
- All open source contributors

## 📞 Support

- Email: atharep1703@gmail.com

---

**Last Updated**: September 2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready

Happy coding! 🎉
