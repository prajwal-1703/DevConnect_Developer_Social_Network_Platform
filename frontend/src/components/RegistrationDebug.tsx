import React, { useState } from 'react';
import { authService } from '../services/authService';

const RegistrationDebug: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testRegistration = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('Testing registration with authService...');
      
      const testData = {
        username: 'testuser' + Date.now(),
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      };
      
      addResult(`Attempting registration with: ${testData.email}`);
      
      const { user, token } = await authService.register(testData);
      
      addResult(`✅ Registration successful!`);
      addResult(`User ID: ${user.id}`);
      addResult(`Username: ${user.username}`);
      addResult(`Email: ${user.email}`);
      addResult(`Token: ${token.substring(0, 20)}...`);
      
    } catch (error: any) {
      addResult(`❌ Registration failed:`);
      addResult(`Error message: ${error.message}`);
      addResult(`Error response: ${JSON.stringify(error.response?.data)}`);
      addResult(`Error status: ${error.response?.status}`);
      addResult(`Error config: ${JSON.stringify(error.config)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testDirectAPI = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('Testing direct API call...');
      
      const testData = {
        username: 'testuser' + Date.now(),
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      };
      
      addResult(`Making direct fetch request to: http://localhost:5000/api/auth/register`);
      
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });
      
      addResult(`Response status: ${response.status}`);
      addResult(`Response headers: ${JSON.stringify([...response.headers.entries()])}`);
      
      const data = await response.json();
      addResult(`Response data: ${JSON.stringify(data, null, 2)}`);
      
      if (response.ok) {
        addResult(`✅ Direct API call successful!`);
      } else {
        addResult(`❌ Direct API call failed!`);
      }
      
    } catch (error: any) {
      addResult(`❌ Direct API call error:`);
      addResult(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Registration Debug Tool</h2>
      <p className="text-gray-600 mb-4">
        This tool will help debug the registration process step by step.
      </p>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testRegistration}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded mr-4"
        >
          {isLoading ? 'Testing...' : 'Test with authService'}
        </button>
        
        <button
          onClick={testDirectAPI}
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
        >
          {isLoading ? 'Testing...' : 'Test Direct API Call'}
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Debug Results:</h3>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono whitespace-pre-wrap">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 rounded">
        <h3 className="font-semibold mb-2">Check These:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Backend server running on http://localhost:5000</li>
          <li>• Frontend running on http://localhost:5173</li>
          <li>• No CORS errors in browser console</li>
          <li>• Network tab shows the request being made</li>
          <li>• Check browser console for any JavaScript errors</li>
        </ul>
      </div>
    </div>
  );
};

export default RegistrationDebug;
