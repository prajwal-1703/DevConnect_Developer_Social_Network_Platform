import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const token = jwt.sign({ id: '69e8ccb5104a143457ffe77b' }, process.env.JWT_SECRET, { expiresIn: '1h' });
console.log('Test token:', token);

import http from 'http';

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/messages/69e8d44a104a143457ffe83f', // conversationId from previous logs
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
}, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Messages count:', parsed.length);
      if (parsed.length > 0) {
        console.log('First message:', JSON.stringify(parsed[0], null, 2));
      }
    } catch(e) {
      console.log('Raw response:', data);
    }
  });
});
req.end();
