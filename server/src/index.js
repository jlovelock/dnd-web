import express from 'express';
const app = express();

const port = 3001;

app.get('/', (req, res) => {
  res.send('Express server is running on this port.')
});

app.get('/testEndpoint', (req, res) => {
  res.json({data: 'Success!'})
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
})
