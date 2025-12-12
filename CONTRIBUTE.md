# Contributing to DevConnect

Thank you for your interest in contributing to DevConnect! We welcome contributions from developers of all experience levels. This guide will help you get started.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Setting Up Locally](#setting-up-locally)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## 🤝 Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read our Code of Conduct before participating:

- Be respectful and inclusive
- Welcome people of all backgrounds and experience levels
- Assume good intentions
- Focus on what is best for the community
- Show empathy toward other community members

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Git** - For version control
- **Node.js** (v14+) - JavaScript runtime
- **npm** (v6+) - Package manager
- **MongoDB** (local or Atlas account) - Database
- **Code Editor** - VS Code recommended
- **Git Knowledge** - Basic git commands

### Fork & Clone

1. **Fork the Repository**
   - Go to https://github.com/yourusername/devconnect
   - Click the "Fork" button in the top-right corner
   - This creates your own copy of the repository

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/devconnect.git
   cd devconnect
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/original/devconnect.git
   git remote -v  # Verify both origin and upstream are set
   ```

## 💻 Setting Up Locally

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd Backend
npm install

# In another terminal, install frontend dependencies
cd frontend
npm install
```

### Step 2: Configure Environment Variables

**Backend (.env)**
```bash
cd Backend
cp .env.example .env  # If available, or create manually
```

Edit `Backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/devconnectDB
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:5173
```

**Frontend (.env)**
```bash
cd frontend
cp .env.example .env  # If available, or create manually
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_DEBUG=true
```

### Step 3: Start MongoDB

**Option 1: Local MongoDB**
```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Option 2: MongoDB Atlas**
- Create a cluster at https://www.mongodb.com/cloud/atlas
- Get connection string and update `MONGO_URI` in `Backend/.env`

### Step 4: Start Development Servers

**Terminal 1 - Backend**
```bash
cd Backend
npm start
# Should see: Server running on http://localhost:5000
```

**Terminal 2 - Frontend**
```bash
cd frontend
npm run dev
# Should see: http://localhost:5173
```

### Step 5: Verify Setup

1. Open browser to `http://localhost:5173`
2. Try registering a new account
3. Create a post and project
4. Test the messaging feature

If everything works, you're ready to start developing!

## 🔄 Development Workflow

### Create a Feature Branch

```bash
# Make sure you're on the latest main
git checkout main
git pull upstream main

# Create a new branch for your feature
git checkout -b feature/amazing-feature

# Or for bug fixes
git checkout -b fix/bug-description
```

### Branch Naming Conventions

- **Features**: `feature/descriptive-name`
- **Bug Fixes**: `fix/bug-description`
- **Documentation**: `docs/description`
- **Tests**: `test/description`
- **Refactoring**: `refactor/description`

### Make Your Changes

1. **Edit Files**
   - Keep changes focused and manageable
   - Make one logical change per commit

2. **Test Your Changes**
   - Run the dev server
   - Test the feature manually
   - Check for console errors

3. **Commit Your Work**
   ```bash
   git add .
   git commit -m "Add: description of changes"
   ```

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process, dependencies

**Examples:**
```
feat: Add user follow functionality
fix: Resolve CORS error in message API
docs: Update authentication guide
refactor: Simplify post creation logic
```

### Keep Your Branch Updated

```bash
# Fetch latest changes from upstream
git fetch upstream

# Rebase your branch onto main
git rebase upstream/main

# If conflicts occur, resolve them manually
# Then continue rebasing
git rebase --continue
```

## 📝 Coding Standards

### Backend (Node.js/Express)

**Code Style:**
- Use ES6+ syntax
- Prefer `const` over `let` and `var`
- Use arrow functions where appropriate
- Add meaningful variable names

**Example:**
```javascript
// Good
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Bad
const get_user = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) res.status(500).send(err);
    else res.send(user);
  });
};
```

**Structure:**
```
Backend/src/
├── controllers/   # Business logic
├── routes/        # API routes
├── models/        # Database schemas
├── middleware/    # Custom middleware
├── config/        # Configuration files
└── utils/         # Helper functions
```

### Frontend (React/TypeScript)

**Code Style:**
- Use TypeScript for type safety
- Use functional components with hooks
- Use meaningful component names
- Keep components small and focused

**Example:**
```typescript
// Good
interface UserProps {
  userId: string;
  onFollow?: () => void;
}

const UserCard: React.FC<UserProps> = ({ userId, onFollow }) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  return (
    <div className="user-card">
      {/* JSX here */}
    </div>
  );
};

// Bad
const user_card = (props) => {
  let user = null;
  // Logic mixed with JSX
  return <div>{/* JSX here */}</div>;
};
```

**Structure:**
```
frontend/src/
├── pages/        # Page components
├── components/   # Reusable components
├── services/     # API services
├── context/      # Context providers
├── hooks/        # Custom hooks
├── types/        # TypeScript types
└── styles/       # Global styles
```

### Naming Conventions

**Backend:**
- Files: `camelCase.js`
- Functions: `camelCase()`
- Constants: `UPPER_SNAKE_CASE`
- Classes: `PascalCase`

**Frontend:**
- Files: `PascalCase.tsx` (components)
- Files: `camelCase.ts` (services)
- Components: `PascalCase`
- Hooks: `useCamelCase`
- Constants: `UPPER_SNAKE_CASE`

### Documentation

**Add JSDoc Comments:**
```javascript
/**
 * Create a new post
 * @param {Object} postData - The post data
 * @param {string} postData.content - Post content
 * @param {string} postData.userId - User ID
 * @returns {Promise<Object>} Created post
 */
const createPost = async (postData) => {
  // Implementation
};
```

## 🧪 Testing

### Before Submitting

1. **Manual Testing**
   ```bash
   # Test your feature manually
   # Check for console errors
   # Verify in multiple browsers
   # Test on mobile (if applicable)
   ```

2. **API Testing**
   ```bash
   # Use Postman to test new/modified endpoints
   # Import DevConnectLocal.postman_collection.json
   # Run tests for your changes
   ```

3. **Code Quality**
   ```bash
   # Backend
   cd Backend
   npm run lint

   # Frontend
   cd frontend
   npm run lint
   npm run type-check
   ```

### Testing Checklist

- [ ] Feature works as expected
- [ ] No console errors or warnings
- [ ] Code follows style guidelines
- [ ] TypeScript types are correct
- [ ] API endpoints return expected data
- [ ] Database queries are optimized
- [ ] No hardcoded values
- [ ] Comments are clear and helpful
- [ ] Commit messages are descriptive

## 📤 Submitting Changes

### Push Your Changes

```bash
# Push your feature branch
git push origin feature/amazing-feature

# First time pushing a new branch?
git push -u origin feature/amazing-feature
```

### Create a Pull Request

1. **Go to GitHub**
   - Navigate to your forked repository
   - Click "Compare & pull request"
   - Or go to "Pull requests" tab and click "New pull request"

2. **Fill Out PR Details**
   ```markdown
   ## Description
   Brief description of what this PR does

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update

   ## Related Issues
   Closes #123

   ## Testing
   - [ ] Tested on local machine
   - [ ] No console errors
   - [ ] API endpoints working

   ## Screenshots (if applicable)
   Add screenshots of the feature

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Comments added for complex logic
   - [ ] No breaking changes
   ```

3. **Submit PR**
   - Click "Create pull request"
   - Provide clear title and description
   - Link related issues

## ✅ Pull Request Process

### What Reviewers Look For

- **Code Quality**: Clear, readable, well-commented code
- **Functionality**: Feature works as described
- **Testing**: Changes are tested
- **Documentation**: Documentation is updated
- **No Breaking Changes**: API compatibility maintained
- **Performance**: No significant performance impact

### After Submission

1. **Wait for Review**
   - Reviewers will provide feedback
   - Be open to suggestions
   - Respond to comments

2. **Address Feedback**
   ```bash
   # Make requested changes
   git add .
   git commit -m "refactor: Address review feedback"
   git push origin feature/amazing-feature
   ```

3. **PR Approved & Merged**
   - Your code is merged into main
   - Delete your feature branch

## 🐛 Reporting Issues

### Before Creating an Issue

1. Check existing issues (open and closed)
2. Read the troubleshooting guide
3. Verify the issue in the latest version

### Creating a Good Issue

**Use this template:**
```markdown
## Description
Clear description of the issue

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: Windows 10
- Node version: v16.0.0
- Browser: Chrome 91

## Screenshots
If applicable, add screenshots

## Additional Context
Any other information
```

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature request
- `documentation` - Documentation improvement
- `good first issue` - Good for beginners
- `help wanted` - Extra attention needed

## 📚 Additional Resources

### Documentation
- Read the main [README.md](./Readme.md)
- Check [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)
- Review [AUTHENTICATION_SETUP_GUIDE.md](./AUTHENTICATION_SETUP_GUIDE.md)

### Learning Resources
- [Git Documentation](https://git-scm.com/doc)
- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)

### Tools
- [VS Code](https://code.visualstudio.com/)
- [Postman](https://www.postman.com/)
- [Git Bash](https://gitforwindows.org/)
- [Homebrew](https://brew.sh/) (macOS)

## ❓ FAQ

### Q: How do I sync my fork with upstream?
```bash
git fetch upstream
git rebase upstream/main
git push origin main
```

### Q: I accidentally committed to main, what do I do?
```bash
git reset HEAD~1  # Undo last commit
git stash         # Stash changes
git checkout -b feature/branch
git stash pop     # Apply changes to new branch
```

### Q: How do I update my local repository?
```bash
git fetch upstream
git pull upstream main
```

### Q: Can I work on multiple features?
Yes! Create separate branches for each feature:
```bash
git checkout -b feature/feature-1
# Work on feature 1

git checkout -b feature/feature-2
# Work on feature 2
```

## 🎉 Recognition

Contributors who submit pull requests will be:
- Added to the contributors list
- Mentioned in release notes
- Recognized in the project README

## 📞 Need Help?
- Email: atharep1703@gmail.com
---

**Thank you for contributing to DevConnect! We appreciate your efforts to make this project better.** 🚀

Happy coding! 💻
