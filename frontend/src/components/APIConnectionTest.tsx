import React, { useState } from 'react';
import { api } from '../services/api';

const APIConnectionTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testAPIConnection = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('Testing API connection...');
      addResult(`Base URL: ${api.defaults.baseURL}`);
      addResult(`Timeout: ${api.defaults.timeout}ms`);
      
      // Test the auth test endpoint
      addResult('Testing /api/auth/test endpoint...');
      const response = await api.get('/auth/test');
      addResult(`✅ Auth test successful! Status: ${response.status}`);
      addResult(`Response: ${response.data}`);
      
    } catch (error: any) {
      addResult(`❌ API connection failed:`);
      addResult(`Error: ${error.message}`);
      addResult(`Status: ${error.response?.status}`);
      addResult(`Response: ${JSON.stringify(error.response?.data)}`);
      addResult(`Config: ${JSON.stringify(error.config)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testRegistration = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('Testing registration with API client...');
      
      const testData = {
        username: 'testuser' + Date.now(),
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      };
      
      addResult(`Sending registration request...`);
      addResult(`Data: ${JSON.stringify(testData)}`);
      
      const response = await api.post('/auth/register', testData);
      
      addResult(`✅ Registration successful!`);
      addResult(`Status: ${response.status}`);
      addResult(`Response: ${JSON.stringify(response.data, null, 2)}`);
      
    } catch (error: any) {
      addResult(`❌ Registration failed:`);
      addResult(`Error: ${error.message}`);
      addResult(`Status: ${error.response?.status}`);
      addResult(`Response: ${JSON.stringify(error.response?.data)}`);
      addResult(`Config: ${JSON.stringify(error.config)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg max-w-2xl">
      <h3 className="text-lg font-bold mb-4">API Connection Test</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={testAPIConnection}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm mr-2"
        >
          Test Connection
        </button>
        
        <button
          onClick={testRegistration}
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm"
        >
          Test Registration
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="bg-gray-100 p-3 rounded text-xs">
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="font-mono whitespace-pre-wrap">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default APIConnectionTest;
