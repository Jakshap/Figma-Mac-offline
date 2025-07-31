const { spawn, exec } = require('child_process');
const fetch = require('node-fetch');

async function checkServerStatus() {
  try {
    const response = await fetch('http://localhost:3001/api/colors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackId: 'test' })
    });
    return true;
  } catch (error) {
    return false;
  }
}

async function startServer() {
  return new Promise((resolve, reject) => {
    console.log('Starting server...');
    const serverProcess = spawn('node', ['server.js'], {
      detached: true,
      stdio: 'ignore'
    });
    
    serverProcess.unref();
    
    // Wait a moment for server to start
    setTimeout(async () => {
      const isRunning = await checkServerStatus();
      if (isRunning) {
        console.log('Server started successfully');
        resolve(true);
      } else {
        console.log('Failed to start server');
        reject(false);
      }
    }, 2000);
  });
}

async function ensureServerRunning() {
  const isRunning = await checkServerStatus();
  
  if (isRunning) {
    console.log('Server is already running');
    return true;
  } else {
    console.log('Server is not running, starting it...');
    try {
      await startServer();
      return true;
    } catch (error) {
      console.error('Failed to start server:', error);
      return false;
    }
  }
}

module.exports = { ensureServerRunning, checkServerStatus };