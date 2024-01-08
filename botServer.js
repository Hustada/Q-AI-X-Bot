const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 5000; // The port your backend server is running on

// Apply CORS middleware to allow requests from your React development server
// You can tighten the security in production or further restrict it in development if needed
app.use(cors({
  origin: 'http://localhost:3000' // React development server URL
}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Logs endpoint to return logs from the bot.log file
app.get('/logs', (req, res) => {
  const logFilePath = path.join(__dirname, 'logs', 'bot.log'); // Correct path to the log file

  fs.readFile(logFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading log file:', err);
      res.status(500).json({ error: 'Error reading log file' });
      return;
    }
    
    const logs = data.split('\n')
                     .filter(line => line)
                     .map(line => {
                       try {
                         return JSON.parse(line);
                       } catch (e) {
                         console.error('Error parsing line:', line, e);
                         return null;
                       }
                     })
                     .filter(entry => entry !== null);
    
    res.json(logs);
  });
});

// Catch-all handler for any other client-side routes not handled above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
