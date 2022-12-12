// serving react app in production

const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});

const port = process.env.PRODUCTION_FRONTEND_PORT || 8888;

app.listen(port, () => {
  console.log(`Frontend server listening on port ${port}`);
});
