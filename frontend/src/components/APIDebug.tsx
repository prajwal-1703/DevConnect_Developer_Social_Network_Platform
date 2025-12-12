import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { authService } from '../services/authService';

export const APIDebug: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testRegistration = async () => {
    setIsLoading(true);
    setResult('Testing registration...');
    
    try {
      const testData = {
        username: 'debuguser',
        email: 'debug@example.com',
        password: 'debugpassword123'
      };
      
      console.log('Attempting registration with:', testData);
      const response = await authService.register(testData);
      console.log('Registration response:', response);
      setResult(`✅ Registration successful: ${JSON.stringify(response, null, 2)}`);
    } catch (error: any) {
      console.error('Registration error:', error);
      setResult(`❌ Registration failed: ${error.response?.data?.msg || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testLogin = async () => {
    setIsLoading(true);
    setResult('Testing login...');
    
    try {
      const response = await authService.login('debug@example.com', 'debugpassword123');
      console.log('Login response:', response);
      setResult(`✅ Login successful: ${JSON.stringify(response, null, 2)}`);
    } catch (error: any) {
      console.error('Login error:', error);
      setResult(`❌ Login failed: ${error.response?.data?.msg || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>API Debug</CardTitle>
        <CardDescription>
          Test API connection and authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testRegistration} disabled={isLoading}>
            Test Registration
          </Button>
          <Button onClick={testLogin} disabled={isLoading} variant="outline">
            Test Login
          </Button>
        </div>
        
        {result && (
          <Alert>
            <AlertDescription>
              <pre className="whitespace-pre-wrap text-sm">{result}</pre>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
