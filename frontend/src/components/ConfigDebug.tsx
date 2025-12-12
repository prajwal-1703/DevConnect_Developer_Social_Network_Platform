import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { API_CONFIG } from '../config/api';

export const ConfigDebug: React.FC = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Configuration Debug</CardTitle>
        <CardDescription>
          Check API configuration and environment variables
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <strong>API Base URL:</strong> {API_CONFIG.BASE_URL}
          </div>
          <div>
            <strong>Socket URL:</strong> {API_CONFIG.SOCKET_URL}
          </div>
          <div>
            <strong>Timeout:</strong> {API_CONFIG.TIMEOUT}ms
          </div>
          <div>
            <strong>Environment:</strong> {import.meta.env.MODE}
          </div>
          <div>
            <strong>VITE_API_URL:</strong> {import.meta.env.VITE_API_URL || 'Not set'}
          </div>
          <div>
            <strong>VITE_SOCKET_URL:</strong> {import.meta.env.VITE_SOCKET_URL || 'Not set'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
