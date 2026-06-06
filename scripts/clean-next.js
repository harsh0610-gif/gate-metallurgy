const fs = require('fs');
const path = require('path');

const nextDir = path.join(__dirname, '..', '.next');

if (fs.existsSync(nextDir)) {
  console.log('Cleaning Next.js cache directory...');
  try {
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log('Cache cleaned successfully.');
  } catch (error) {
    console.warn('Warning: Could not fully clean .next directory:', error.message);
  }
}
