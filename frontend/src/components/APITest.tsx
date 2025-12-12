import React, { useState } from 'react';
import { authService, postsService, projectsService } from '../services';

const APITest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testAPI = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      // Test auth endpoints
      addResult('Testing auth endpoints...');
      
      // Test posts endpoints
      addResult('Testing posts endpoints...');
      try {
        const posts = await postsService.getPosts(1, 5);
        addResult(`✅ Posts API working - Found ${posts.posts.length} posts`);
      } catch (error: any) {
        addResult(`❌ Posts API error: ${error.response?.data?.msg || error.message}`);
      }

      // Test projects endpoints
      addResult('Testing projects endpoints...');
      try {
        const projects = await projectsService.getProjects(1, 5);
        addResult(`✅ Projects API working - Found ${projects.projects.length} projects`);
      } catch (error: any) {
        addResult(`❌ Projects API error: ${error.response?.data?.msg || error.message}`);
      }

      addResult('API test completed!');
    } catch (error: any) {
      addResult(`❌ General error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">API Connection Test</h2>
      <p className="text-gray-600 mb-4">
        This component tests the connection between your React frontend and Node.js backend.
      </p>
      
      <button
        onClick={testAPI}
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded mb-4"
      >
        {isLoading ? 'Testing...' : 'Test API Connection'}
      </button>

      {testResults.length > 0 && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Test Results:</h3>
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-2">Backend Status:</h3>
        <p className="text-sm text-gray-600">
          Make sure your backend server is running on <code>http://localhost:5000</code>
        </p>
        <p className="text-sm text-gray-600">
          You can start it with: <code>cd Backend && npm start</code>
        </p>
      </div>
    </div>
  );
};

export default APITest;
