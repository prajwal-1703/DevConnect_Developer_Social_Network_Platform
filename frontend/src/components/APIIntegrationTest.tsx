import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { 
  authService, 
  postsService, 
  projectsService, 
  userService, 
  notificationsService, 
  messagesService,
  commentsService,
  likesService,
  uploadService
} from '../services';

interface TestResult {
  service: string;
  method: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  data?: any;
}

export const APIIntegrationTest: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (service: string, method: string, status: 'success' | 'error' | 'pending', message: string, data?: any) => {
    setResults(prev => [...prev, { service, method, status, message, data }]);
  };

  const runAuthTests = async () => {
    addResult('Auth', 'Test Connection', 'pending', 'Testing authentication endpoints...');
    
    try {
      // Test auth endpoints
      const testUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword123'
      };

      // Test registration
      try {
        const registerResult = await authService.register(testUser);
        addResult('Auth', 'Register', 'success', 'Registration successful', registerResult);
      } catch (error: any) {
        addResult('Auth', 'Register', 'error', `Registration failed: ${error.response?.data?.msg || error.message}`);
      }

      // Test login
      try {
        const loginResult = await authService.login(testUser.email, testUser.password);
        addResult('Auth', 'Login', 'success', 'Login successful', loginResult);
      } catch (error: any) {
        addResult('Auth', 'Login', 'error', `Login failed: ${error.response?.data?.msg || error.message}`);
      }

      // Test get current user
      try {
        const currentUser = await authService.getCurrentUser();
        addResult('Auth', 'Get Current User', 'success', 'Current user retrieved', currentUser);
      } catch (error: any) {
        addResult('Auth', 'Get Current User', 'error', `Get current user failed: ${error.response?.data?.msg || error.message}`);
      }

    } catch (error: any) {
      addResult('Auth', 'Test Connection', 'error', `Auth test failed: ${error.message}`);
    }
  };

  const runPostsTests = async () => {
    addResult('Posts', 'Test Connection', 'pending', 'Testing posts endpoints...');
    
    try {
      // Test get posts
      try {
        const posts = await postsService.getPosts();
        addResult('Posts', 'Get Posts', 'success', `Retrieved ${posts.length} posts`, posts);
      } catch (error: any) {
        addResult('Posts', 'Get Posts', 'error', `Get posts failed: ${error.response?.data?.msg || error.message}`);
      }

      // Test create post
      try {
        const newPost = await postsService.createPost({
          content: 'Test post from API integration test',
          tags: ['test', 'api']
        });
        addResult('Posts', 'Create Post', 'success', 'Post created successfully', newPost);
      } catch (error: any) {
        addResult('Posts', 'Create Post', 'error', `Create post failed: ${error.response?.data?.msg || error.message}`);
      }

    } catch (error: any) {
      addResult('Posts', 'Test Connection', 'error', `Posts test failed: ${error.message}`);
    }
  };

  const runProjectsTests = async () => {
    addResult('Projects', 'Test Connection', 'pending', 'Testing projects endpoints...');
    
    try {
      // Test get projects
      try {
        const projects = await projectsService.getProjects();
        addResult('Projects', 'Get Projects', 'success', `Retrieved ${projects.length} projects`, projects);
      } catch (error: any) {
        addResult('Projects', 'Get Projects', 'error', `Get projects failed: ${error.response?.data?.msg || error.message}`);
      }

      // Test create project
      try {
        const newProject = await projectsService.createProject({
          title: 'Test Project',
          description: 'Test project from API integration test',
          tags: ['test', 'api', 'react']
        });
        addResult('Projects', 'Create Project', 'success', 'Project created successfully', newProject);
      } catch (error: any) {
        addResult('Projects', 'Create Project', 'error', `Create project failed: ${error.response?.data?.msg || error.message}`);
      }

    } catch (error: any) {
      addResult('Projects', 'Test Connection', 'error', `Projects test failed: ${error.message}`);
    }
  };

  const runUserTests = async () => {
    addResult('Users', 'Test Connection', 'pending', 'Testing user endpoints...');
    
    try {
      // Test get notifications
      try {
        const notifications = await notificationsService.getNotifications();
        addResult('Users', 'Get Notifications', 'success', `Retrieved ${notifications.length} notifications`, notifications);
      } catch (error: any) {
        addResult('Users', 'Get Notifications', 'error', `Get notifications failed: ${error.response?.data?.msg || error.message}`);
      }

    } catch (error: any) {
      addResult('Users', 'Test Connection', 'error', `User test failed: ${error.message}`);
    }
  };

  const runMessagingTests = async () => {
    addResult('Messaging', 'Test Connection', 'pending', 'Testing messaging endpoints...');
    
    try {
      // Test get conversations
      try {
        const conversations = await messagesService.getConversations();
        addResult('Messaging', 'Get Conversations', 'success', `Retrieved ${conversations.length} conversations`, conversations);
      } catch (error: any) {
        addResult('Messaging', 'Get Conversations', 'error', `Get conversations failed: ${error.response?.data?.msg || error.message}`);
      }

    } catch (error: any) {
      addResult('Messaging', 'Test Connection', 'error', `Messaging test failed: ${error.message}`);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);
    
    await runAuthTests();
    await runPostsTests();
    await runProjectsTests();
    await runUserTests();
    await runMessagingTests();
    
    setIsRunning(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Integration Test</CardTitle>
          <CardDescription>
            Test all backend API connections to ensure proper integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Button>
            <Button 
              onClick={clearResults} 
              variant="outline"
              disabled={isRunning}
            >
              Clear Results
            </Button>
          </div>
          
          <div className="space-y-2">
            {results.map((result, index) => (
              <Alert key={index} className={result.status === 'error' ? 'border-red-500' : result.status === 'success' ? 'border-green-500' : 'border-yellow-500'}>
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {result.service} - {result.method}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      result.status === 'success' ? 'bg-green-100 text-green-800' :
                      result.status === 'error' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {result.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{result.message}</p>
                  {result.data && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-gray-600">View Data</summary>
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
