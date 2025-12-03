const axios = require('axios');

async function cleanTestData() {
  try {
    // Login
    const loginRes = await axios.post('http://localhost:3000/auth/login', {
      email: 'admin@example.com',
      password: '123456'
    });
    
    const token = loginRes.data.access_token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    // Get all logs
    const logsRes = await axios.get('http://localhost:3000/weather/logs', config);
    const logs = logsRes.data;
    
    console.log(`Total logs in database: ${logs.length}`);
    
    // Show recent logs
    const recent = logs.slice(0, 5);
    console.log('\nMost recent logs:');
    recent.forEach((log, i) => {
      console.log(`${i + 1}. ${log.city}: ${log.temperature}°C, ${log.condition}`);
    });
    
    // Find test data
    const testLogs = logs.filter(log => 
      log.city === 'Integration Test City' || 
      log.temperature === 99.9 ||
      log.condition === 'Test Storm'
    );
    
    console.log(`\nFound ${testLogs.length} test data entries`);
    
    if (testLogs.length > 0) {
      console.log('Test data found - these should be removed manually from MongoDB');
      testLogs.forEach(log => {
        console.log(`- ${log.city}: ${log.temperature}°C, ${log.condition}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

cleanTestData();
