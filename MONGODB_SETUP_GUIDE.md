# MongoDB Setup Guide for DevConnect

Complete guide to set up MongoDB for DevConnect development and production environments.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Windows Installation](#windows-installation)
- [macOS Installation](#macos-installation)
- [Linux Installation](#linux-installation)
- [Docker Setup](#docker-setup)
- [MongoDB Atlas (Cloud)](#mongodb-atlas-cloud)
- [Verification Steps](#verification-steps)
- [Troubleshooting](#troubleshooting)
- [Backup & Restore](#backup--restore)

## 🚀 Quick Start

Choose your preferred method:

1. **Fastest**: Docker with Docker Compose (5 minutes)
2. **Simplest**: MongoDB Atlas (10 minutes)
3. **Local**: Native installation (15 minutes)

## 🪟 Windows Installation

### Method 1: MSI Installer (Recommended)

**Step 1: Download**
```bash
# Visit: https://www.mongodb.com/try/download/community
# Select:
# - Windows
# - MSI format
# - Latest stable version (7.0+)
```

**Step 2: Install**
1. Open downloaded MSI file
2. Click "Next" through wizard
3. Accept license agreement
4. Choose installation location (default: `C:\Program Files\MongoDB\Server\7.0`)
5. **Important**: Check "Install MongoDB as a Service"
6. Choose service name: "MongoDB"
7. Run service as: "Local System"
8. Click "Install"

**Step 3: Verify Installation**
```bash
# Open Command Prompt (as Administrator)
cd "C:\Program Files\MongoDB\Server\7.0\bin"

# Check MongoDB version
mongod --version

# Connect to MongoDB
mongosh
```

**Step 4: Configure**

Create `C:\Program Files\MongoDB\Server\7.0\mongod.cfg`:

```yaml
systemLog:
  destination: file
  path: C:\Program Files\MongoDB\Server\7.0\log\mongod.log
  logAppend: true
storage:
  dbPath: C:\Program Files\MongoDB\Server\7.0\data
net:
  bindIp: 127.0.0.1
  port: 27017
```

**Step 5: Manage Service**

```bash
# Start MongoDB
net start MongoDB

# Stop MongoDB
net stop MongoDB

# Check status
sc query MongoDB

# Restart
net stop MongoDB
net start MongoDB
```

### Method 2: Chocolatey (Easy)

```bash
# Install Chocolatey if not installed
# Visit: https://chocolatey.org/install

# Install MongoDB
choco install mongodb

# Start MongoDB
mongod

# In another terminal
mongosh
```

### Method 3: Windows Terminal Setup

```bash
# Add MongoDB to system PATH
$env:Path += ";C:\Program Files\MongoDB\Server\7.0\bin"

# Verify
mongod --version
```

### Windows Backend .env

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/devconnectDB
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:5173
```

---

## 🍎 macOS Installation

### Method 1: Homebrew (Recommended)

**Step 1: Install Homebrew**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Step 2: Install MongoDB**
```bash
# Tap MongoDB formula
brew tap mongodb/brew

# Install MongoDB Community Edition
brew install mongodb-community

# Verify installation
mongod --version
```

**Step 3: Start Service**
```bash
# Start MongoDB as service
brew services start mongodb-community

# Check status
brew services list

# View logs
log show --predicate 'process == "mongod"' --last 1h
```

**Step 4: Manage Service**
```bash
# Start
brew services start mongodb-community

# Stop
brew services stop mongodb-community

# Restart
brew services restart mongodb-community
```

**Step 5: Connect**
```bash
mongosh
```

### Method 2: Manual Installation

```bash
# Download
wget https://fastdl.mongodb.org/osx/mongodb-macos-arm64-7.0.0.tgz

# Extract
tar -xzf mongodb-macos-arm64-7.0.0.tgz

# Move to /usr/local
sudo mv mongodb-macos-arm64-7.0.0 /usr/local/mongodb

# Create data directory
sudo mkdir -p /usr/local/mongodb/data

# Run MongoDB
/usr/local/mongodb/bin/mongod --dbpath /usr/local/mongodb/data
```

### Method 3: Docker (Alternative)

```bash
# Pull MongoDB image
docker pull mongo:7.0

# Run container
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Connect
docker exec -it mongodb mongosh
```

### macOS Backend .env

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/devconnectDB
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:5173
```

---

## 🐧 Linux Installation (Ubuntu/Debian)

### Method 1: APT Package Manager (Recommended)

**Step 1: Import GPG Key**
```bash
# MongoDB GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Alternative if wget fails
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
```

**Step 2: Add Repository**
```bash
# Ubuntu 20.04 (Focal)
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Ubuntu 22.04 (Jammy)
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
```

**Step 3: Install MongoDB**
```bash
# Update package list
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Verify installation
mongod --version
```

**Step 4: Start Service**
```bash
# Start MongoDB
sudo systemctl start mongod

# Enable on boot
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod

# View logs
sudo tail -f /var/log/mongodb/mongod.log
```

**Step 5: Manage Service**
```bash
# Start
sudo systemctl start mongod

# Stop
sudo systemctl stop mongod

# Restart
sudo systemctl restart mongod

# Status
sudo systemctl status mongod
```

**Step 6: Connect**
```bash
mongosh
```

### Method 2: Manual Installation

```bash
# Download (choose architecture: x86_64 or aarch64)
wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2004-7.0.0.tgz

# Extract
tar -xzf mongodb-linux-x86_64-ubuntu2004-7.0.0.tgz

# Move to /opt
sudo mv mongodb-linux-x86_64-ubuntu2004-7.0.0 /opt/mongodb

# Create data directory
sudo mkdir -p /data/db
sudo chown -R $USER /data/db

# Run MongoDB
/opt/mongodb/bin/mongod --dbpath /data/db
```

### Method 3: Snap Package

```bash
# Install MongoDB snap
sudo snap install mongodb

# Start service
sudo snap services mongodb

# Connect
mongosh
```

### Linux Backend .env

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/devconnectDB
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:5173
```

---

## 🐳 Docker Setup

### Method 1: Basic Docker

**Step 1: Pull Image**
```bash
docker pull mongo:7.0
```

**Step 2: Create Volume**
```bash
docker volume create mongodb_data
docker volume create mongodb_config
```

**Step 3: Run Container**
```bash
docker run -d \
  --name devconnect-mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  -v mongodb_data:/data/db \
  -v mongodb_config:/data/configdb \
  mongo:7.0
```

**Step 4: Verify**
```bash
# Check container
docker ps

# View logs
docker logs devconnect-mongo

# Connect
docker exec -it devconnect-mongo mongosh -u admin -p password123
```

### Method 2: Docker Compose (Recommended)

**Step 1: Create docker-compose.yml**

```yaml
version: '3.9'

services:
  mongodb:
    image: mongo:7.0
    container_name: devconnect-mongo
    restart: unless-stopped
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
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test -u admin -p password123 --quiet
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 40s

volumes:
  mongodb_data:
    driver: local
  mongodb_config:
    driver: local

networks:
  devconnect-network:
    driver: bridge
```

**Step 2: Create init-mongo.js**

```javascript
// init-mongo.js
db.getSiblingDB('devconnectDB').createUser({
  user: 'devconnect_user',
  pwd: 'devconnect_pass123',
  roles: [
    {
      role: 'readWrite',
      db: 'devconnectDB'
    }
  ]
});

// Create collections
db.getSiblingDB('devconnectDB').createCollection('users');
db.getSiblingDB('devconnectDB').createCollection('posts');
db.getSiblingDB('devconnectDB').createCollection('projects');
db.getSiblingDB('devconnectDB').createCollection('comments');
db.getSiblingDB('devconnectDB').createCollection('likes');
db.getSiblingDB('devconnectDB').createCollection('notifications');
db.getSiblingDB('devconnectDB').createCollection('messages');
db.getSiblingDB('devconnectDB').createCollection('conversations');

print('Collections created successfully');
```

**Step 3: Start Services**

```bash
# Start MongoDB
docker-compose up -d

# View logs
docker-compose logs -f mongodb

# Check status
docker-compose ps
```

**Step 4: Stop Services**

```bash
# Stop but keep volumes
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Restart
docker-compose restart
```

### Method 3: Docker Network

```bash
# Create network
docker network create devconnect-network

# Run MongoDB on network
docker run -d \
  --name devconnect-mongo \
  --network devconnect-network \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  -v mongodb_data:/data/db \
  mongo:7.0

# Backend can connect via: mongodb://admin:password123@devconnect-mongo:27017/devconnectDB?authSource=admin
```

### Docker Backend .env

```env
PORT=5000
NODE_ENV=development
# If running on same network
MONGO_URI=mongodb://admin:password123@devconnect-mongo:27017/devconnectDB?authSource=admin
# If running locally
MONGO_URI=mongodb://admin:password123@localhost:27017/devconnectDB?authSource=admin
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:5173
```

### Useful Docker Commands

```bash
# View all MongoDB containers
docker ps -a | grep mongo

# Remove container
docker rm devconnect-mongo

# View container logs
docker logs devconnect-mongo

# Exec into container
docker exec -it devconnect-mongo bash

# Check volume
docker volume inspect mongodb_data

# Remove volume
docker volume rm mongodb_data
```

---

## ☁️ MongoDB Atlas (Cloud)

### Step-by-Step Setup

**Step 1: Create Account**
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Sign Up Free"
3. Use email or Google/GitHub account
4. Verify email

**Step 2: Create Organization**
1. Organization Name: "DevConnect"
2. Click "Continue"

**Step 3: Create Project**
1. Project Name: "DevConnect Development"
2. Click "Create Project"

**Step 4: Create Cluster**
1. Click "Build a Database"
2. Choose "M0 Free" tier
3. Select cloud provider:
   - AWS (recommended)
   - Google Cloud
   - Azure
4. Select region closest to you
5. Cluster name: "devconnect-cluster"
6. Click "Create"
7. Wait 5-10 minutes for initialization

**Step 5: Create Database User**
1. Go to "Security" → "Database Access"
2. Click "Add New Database User"
3. Username: `devconnect_user`
4. Password: (auto-generated or set your own)
5. Built-in role: "Read and write to any database"
6. Click "Add User"

**Step 6: Network Access**
1. Go to "Security" → "Network Access"
2. Click "Add IP Address"
3. For development: "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add specific IPs
5. Click "Confirm"

**Step 7: Get Connection String**
1. Go to "Clusters"
2. Click "Connect"
3. Select "Connect your application"
4. Copy connection string

**Step 8: Update Backend .env**
```env
MONGO_URI=mongodb+srv://devconnect_user:your_password@devconnect-cluster.mongodb.net/devconnectDB?retryWrites=true&w=majority
```

### Atlas Connection String Format

```
mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
```

### Upgrade Atlas Cluster

```bash
# For more storage, upgrade from M0 to M2 (free tier, 50GB)
# Then to M10 (paid, 10GB+ available)

# Steps:
1. Go to Clusters
2. Click cluster name
3. Click "Upgrade"
4. Choose tier
5. Review and confirm
```

### Atlas Backup

MongoDB Atlas automatically backs up data:
- **Frequency**: Every 6 hours
- **Retention**: 35 days
- **Restore**: Point-in-time restore available

---

## ✅ Verification Steps

### Test Local Connection

```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017

# Inside MongoDB shell
show databases
use devconnectDB
db.stats()
db.createCollection('test')
db.test.insertOne({ name: 'test' })
db.test.find()
db.test.deleteMany({})
```

### Test Docker Connection

```bash
# Connect inside container
docker exec -it devconnect-mongo mongosh -u admin -p password123

# Or from host
mongosh "mongodb://admin:password123@localhost:27017"
```

### Test Atlas Connection

```bash
# Replace with your connection string
mongosh "mongodb+srv://devconnect_user:password@cluster.mongodb.net/devconnectDB"
```

### Test Backend Connection

```bash
# Start backend
cd Backend
npm start

# Check for log: ✅ MongoDB Connected
```

---

## 🐛 Troubleshooting

### Connection Issues

**Error: "connection refused"**
```bash
# Check if MongoDB is running
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
# Docker: docker start devconnect-mongo
```

**Error: "authentication failed"**
```bash
# Verify credentials in connection string
# Check if user exists
# Verify database name
# Check IP whitelist (Atlas only)
```

**Error: "no reachable servers"**
```bash
# Check Atlas network access settings
# Add your IP address
# Use 0.0.0.0/0 for development only
```

### Performance Issues

```bash
# Check database size
db.stats()

# Check collection stats
db.collection_name.stats()

# Check indexes
db.collection_name.getIndexes()

# Create index
db.users.createIndex({ email: 1 })
```

### Data Recovery

```bash
# Backup database
mongodump --uri mongodb://localhost:27017/devconnectDB --out ./backup

# Restore database
mongorestore --uri mongodb://localhost:27017 ./backup
```

---

## 📊 Backup & Restore

### Local Backup

```bash
# Backup single database
mongodump --uri mongodb://localhost:27017/devconnectDB --out ./backup

# Backup all databases
mongodump --uri mongodb://localhost:27017 --out ./backup

# Backup with compression
mongodump --uri mongodb://localhost:27017/devconnectDB --archive=devconnectDB.archive --gzip
```

### Local Restore

```bash
# Restore all
mongorestore --uri mongodb://localhost:27017 ./backup

# Restore compressed
mongorestore --uri mongodb://localhost:27017 --archive=devconnectDB.archive --gzip

# Restore and drop existing
mongorestore --drop --uri mongodb://localhost:27017 ./backup
```

### Export/Import JSON

```bash
# Export collection to JSON
mongoexport --uri mongodb://localhost:27017/devconnectDB --collection users --out users.json

# Import from JSON
mongoimport --uri mongodb://localhost:27017/devconnectDB --collection users --file users.json

# Import and drop
mongoimport --drop --uri mongodb://localhost:27017/devconnectDB --collection users --file users.json
```

### Atlas Backup

```bash
# Download backup from Atlas dashboard
# Go to Clusters → Backups
# Select snapshot
# Click "Download"
```

---

## 🎯 Recommendation

| Use Case | Method |
|----------|--------|
| **Learning** | Docker Compose |
| **Development** | Local or Docker |
| **Testing** | Atlas M0 Free |
| **Production** | Atlas M10+ |
| **Team Project** | Docker Compose + Atlas |

---

## 📞 Support

- MongoDB Documentation: https://docs.mongodb.com
- MongoDB Community: https://community.mongodb.com
- Atlas Support: https://www.mongodb.com/support

Happy coding with MongoDB! 🚀
