const http = require('http');
const fs = require('fs');

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            data: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            data: body
          });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

// Test the API
async function testAPI() {
  const baseURL = 'http://localhost:3000';
  
  console.log('🧪 Testing Calendar Scheduling API\n');
  
  // 1. Health check
  console.log('1️⃣  Testing health check...');
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/health',
      method: 'GET'
    });
    console.log('✅ Health check:', response.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    console.log('⚠️  Make sure the server is running: npm start');
    return;
  }
  
  console.log('\n2️⃣  Sample calendar upload...');
  console.log('To test calendar upload, use this curl command:');
  console.log(`
curl -X POST http://localhost:3000/api/calendars/upload \\
  -F "calendar=@your-calendar.ics" \\
  -F "teamMemberId=user123" \\
  -F "teamMemberName=John Doe"
  `);
  
  // 3. Test find availability (will work even without calendars uploaded)
  console.log('\n3️⃣  Testing availability search...');
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);
  
  const findPayload = JSON.stringify({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    duration: 60,
    workingHours: {
      startTime: '09:00',
      endTime: '17:00',
      daysOfWeek: [1, 2, 3, 4, 5]
    }
  });
  
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/availability/find',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(findPayload)
      }
    }, findPayload);
    
    if (response.data.error) {
      console.log('ℹ️  No calendars uploaded yet. Upload calendars first to find availability.');
    } else {
      console.log('✅ Found', response.data.freeSlots.length, 'free slots');
      if (response.data.freeSlots.length > 0) {
        console.log('First slot:', response.data.freeSlots[0]);
      }
    }
  } catch (error) {
    console.log('❌ Find availability failed:', error.message);
  }
  
  // 4. Test suggestions
  console.log('\n4️⃣  Testing meeting suggestions...');
  const suggestPayload = JSON.stringify({
    duration: 60,
    numberOfSuggestions: 3,
    preferredTimes: ['10:00', '14:00'],
    daysAhead: 7
  });
  
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/availability/suggest',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(suggestPayload)
      }
    }, suggestPayload);
    
    if (response.data.error) {
      console.log('ℹ️  No calendars uploaded yet. Upload calendars first to get suggestions.');
    } else {
      console.log('✅ Got', response.data.suggestions.length, 'suggestions');
      if (response.data.suggestions.length > 0) {
        console.log('Top suggestion:', response.data.suggestions[0]);
      }
    }
  } catch (error) {
    console.log('❌ Suggestions failed:', error.message);
  }
  
  console.log('\n✨ API Test Complete!\n');
  console.log('📚 Next steps:');
  console.log('1. Export calendars from Google Calendar, Outlook, or Apple Calendar');
  console.log('2. Upload them using the /api/calendars/upload endpoint');
  console.log('3. Find available meeting times across all calendars');
  console.log('\nSee README.md for detailed usage instructions.');
}

// Run tests
testAPI().catch(console.error);
