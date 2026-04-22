import fs from 'fs';
import path from 'path';

// Just output a small script to query the local API directly to see what it's returning
import http from 'http';

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/conversations',
  method: 'GET',
  headers: {
    // We don't have the token, but we can bypass auth for local script test by simulating a connection
  }
}, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', data));
});
req.end();
