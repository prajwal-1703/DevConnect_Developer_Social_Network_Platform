// Simple API test script
import axios from 'axios';

const testAPI = async () => {
  try {
    console.log('Testing API connection...');
    
    // Test registration
    const registerData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpassword123'
    };
    
    console.log('Attempting registration...');
    const response = await axios.post('http://localhost:5000/api/auth/register', registerData);
    console.log('✅ Registration successful:', response.data);
    
  } catch (error) {
    console.error('❌ API test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.message);
    } else {
      console.error('Error:', error.message);
    }
  }
};

testAPI();
