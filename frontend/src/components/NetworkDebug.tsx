import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { API_CONFIG } from '../config/api';

export const NetworkDebug: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testDirectAPI = async () => {
    setIsLoading(true);
    setResult('Testing direct API call...');
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'directtest',
          email: 'directtest@example.com',
          password: 'directtest123'
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ Direct API call successful: ${JSON.stringify(data, null, 2)}`);
      } else {
        setResult(`❌ Direct API call failed: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (error: any) {
      setResult(`❌ Network error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testCORS = async () => {
    setIsLoading(true);
    setResult('Testing CORS...');
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/test`);
      const data = await response.text();
      setResult(`✅ CORS test successful: ${data}`);
    } catch (error: any) {
      setResult(`❌ CORS test failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Network Debug</CardTitle>
        <CardDescription>
          Test API connection and CORS configuration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div><strong>API Base URL:</strong> {API_CONFIG.BASE_URL}</div>
          <div><strong>Full Registration URL:</strong> {API_CONFIG.BASE_URL}/api/auth/register</div>
          <div><strong>Current Origin:</strong> {window.location.origin}</div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={testDirectAPI} disabled={isLoading}>
            Test Direct API
          </Button>
          <Button onClick={testCORS} disabled={isLoading} variant="outline">
            Test CORS
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
