const express = require('express');
const app = express();

const port = 3001;

app.get('/', function (req, res) {
  res.send('Express server is running on this port.')
});

app.get('/testEndpoint', function (req, res) {
  res.json({data: 'Success!'})
});

app.listen(port, function () {
  console.log(`listening on ${port}`);
})
