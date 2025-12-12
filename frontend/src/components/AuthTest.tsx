import React, { useState } from 'react';
import { authService } from '../services';

const AuthTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  });

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testRegistration = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('Testing user registration...');
      const { user, token } = await authService.register(formData);
      addResult(`✅ Registration successful! User: ${user.username}, Token: ${token.substring(0, 20)}...`);
      
      // Store token
      localStorage.setItem('devconnect-token', token);
      addResult('✅ Token stored in localStorage');
      
    } catch (error: any) {
      addResult(`❌ Registration failed: ${error.response?.data?.msg || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testLogin = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('Testing user login...');
      const { user, token } = await authService.login(formData.email, formData.password);
      addResult(`✅ Login successful! User: ${user.username}, Token: ${token.substring(0, 20)}...`);
      
      // Store token
      localStorage.setItem('devconnect-token', token);
      addResult('✅ Token stored in localStorage');
      
    } catch (error: any) {
      addResult(`❌ Login failed: ${error.response?.data?.msg || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testCurrentUser = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('Testing get current user...');
      const user = await authService.getCurrentUser();
      addResult(`✅ Current user retrieved: ${user.username} (${user.email})`);
      
    } catch (error: any) {
      addResult(`❌ Get current user failed: ${error.response?.data?.msg || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearToken = () => {
    localStorage.removeItem('devconnect-token');
    addResult('✅ Token cleared from localStorage');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Authentication Test</h2>
      <p className="text-gray-600 mb-4">
        Test the authentication flow between your React frontend and Node.js backend.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-semibold mb-2">Test Data</h3>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-semibold mb-2">Test Actions</h3>
          <div className="space-y-2">
            <button
              onClick={testRegistration}
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
            >
              Test Registration
            </button>
            <button
              onClick={testLogin}
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
            >
              Test Login
            </button>
            <button
              onClick={testCurrentUser}
              disabled={isLoading}
              className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
            >
              Test Get Current User
            </button>
            <button
              onClick={clearToken}
              className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Clear Token
            </button>
          </div>
        </div>
      </div>

      {testResults.length > 0 && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Test Results:</h3>
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 rounded">
        <h3 className="font-semibold mb-2">Backend Status:</h3>
        <p className="text-sm text-gray-600">
          Make sure your backend server is running on <code>http://localhost:5000</code>
        </p>
        <p className="text-sm text-gray-600">
          Check browser console for detailed error messages if tests fail.
        </p>
      </div>
    </div>
  );
};

export default AuthTest;
