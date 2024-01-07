const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 5000; // Feel free to change the port number

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/logs', (req, res) => {
  fs.readFile('bot.log', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading log file:', err);
      res.status(500).send('Error reading log file');
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
