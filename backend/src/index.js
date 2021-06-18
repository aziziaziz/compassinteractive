import express from 'express';
import cors from 'cors';

import cities from '../routers/cities.js';

const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:8080'
}));

app.get('/', (req, res) => {
  res.status(200).send('Working fine');
});

app.use('/cities', cities);

app.listen(port, () => {
  console.log(`Backend has started and listening at http://localhost:${port}`);
});