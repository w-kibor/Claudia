// Test script to verify API is working
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/recipes?page=1&limit=2',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('API Response Status:', res.statusCode);
    console.log('Response Data:');
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Connection error:', error.message);
  process.exit(1);
});

req.end();
