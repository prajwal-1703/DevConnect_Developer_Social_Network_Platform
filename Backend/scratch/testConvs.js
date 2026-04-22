import http from 'http';

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/conversations',
  method: 'GET',
  headers: {
    'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZThjY2I1MTA0YTE0MzQ1N2ZmZTc3YiIsImlhdCI6MTc3Njg2ODMwOCwiZXhwIjoxNzc2ODcxOTA4fQ.BjxOfG-hx6LcTMsRgP2YpZYItz78HQ4IGpcjnEQpSDI`
  }
}, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Conversations:', data));
});
req.end();
