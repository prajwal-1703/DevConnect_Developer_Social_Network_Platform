import React from 'react';
import { APIIntegrationTest } from '../components/APIIntegrationTest';
import { APIDebug } from '../components/APIDebug';
import { ConfigDebug } from '../components/ConfigDebug';
import { NetworkDebug } from '../components/NetworkDebug';

const APITest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="space-y-6">
        <ConfigDebug />
        <NetworkDebug />
        <APIDebug />
        <APIIntegrationTest />
      </div>
    </div>
  );
};

export default APITest;
