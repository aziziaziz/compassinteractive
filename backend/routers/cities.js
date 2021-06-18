import express from 'express';
import mongoCon from '../modules/mongo.js';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const app = express.Router();
const cities = new mongoCon('cinteractive', 'cities');

const defaultCities = require('../files/cities.json');

app.get('/default', insertDefault);
async function insertDefault(req, res) {
  let mongo = await cities.getCollection();
  let insert = await mongo.insertMany(defaultCities);

  if (insert.insertedCount > 0) {
    res.status(200).send(`Successfully inserted ${insert.insertedCount} default cities in db!`);
  } else {
    res.status(503).send('There was an error occurred while inserting your default cities. Please try again.');
  }
}

app.get('/:city', getCities);
async function getCities(req, res) {
  let city = req.params.city;
  let result = await (await cities.getCollection()).find({ city: { $regex: `^${city}`, $options: 'i' } });
  res.status(200).send(await result.toArray());
}

export default app;