const axios = require('axios');
const amqp = require('amqplib');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
const RABBITMQ_URI = process.env.RABBITMQ_URI || 'amqp://guest:guest@localhost:5672';

async function getAuthToken() {
  console.log('Authenticating...');
  try {
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/login`, {
        email: 'admin@example.com',
        password: '123456'
      });
      return res.data.access_token;
    } catch (error) {
      console.log('Login failed, trying to register...');
      await axios.post(`${BACKEND_URL}/users`, {
        email: 'admin@example.com',
        password: '123456'
      });
      const res = await axios.post(`${BACKEND_URL}/auth/login`, {
        email: 'admin@example.com',
        password: '123456'
      });
      return res.data.access_token;
    }
  } catch (error) {
    console.error('Authentication failed:', error.message);
    return null;
  }
}

async function publishMockMessage() {
  console.log('Publishing mock message to RabbitMQ...');
  try {
    const conn = await amqp.connect(RABBITMQ_URI);
    const ch = await conn.createChannel();
    await ch.assertQueue('weather_data', { durable: true });
    
    const mockData = {
      city: 'Integration Test City',
      temperature: 99.9,
      humidity: 100,
      windSpeed: 50.0,
      condition: 'Test Storm',
      timestamp: Date.now() // Use number as per new DTO
    };
    
    ch.sendToQueue('weather_data', Buffer.from(JSON.stringify(mockData)));
    console.log('Message published.');
    await ch.close();
    await conn.close();
    return true;
  } catch (error) {
    console.error('Failed to publish message:', error.message);
    return false;
  }
}

async function verifyBackendData(token) {
  console.log('Verifying data in Backend...');
  const config = { headers: { Authorization: `Bearer ${token}` } };
  
  for (let i = 0; i < 10; i++) {
    try {
      const res = await axios.get(`${BACKEND_URL}/weather/logs`, config);
      const log = res.data.find(l => l.city === 'Integration Test City' && l.temperature === 99.9);
      if (log) {
        console.log('SUCCESS: Mock data found in backend!');
        return true;
      }
      console.log(`Waiting for data... (${i + 1}/10)`);
      await new Promise(r => setTimeout(r, 2000));
    } catch (error) {
      console.error('Error querying backend:', error.message);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  console.log('FAILURE: Mock data not found after waiting.');
  return false;
}

async function run() {
  const token = await getAuthToken();
  if (!token) process.exit(1);
  
  if (await publishMockMessage()) {
    await new Promise(r => setTimeout(r, 2000));
    if (await verifyBackendData(token)) {
      console.log('Integration Test PASSED');
      process.exit(0);
    } else {
      console.log('Integration Test FAILED');
      process.exit(1);
    }
  } else {
    console.log('Integration Test FAILED (Publishing)');
    process.exit(1);
  }
}

run();
