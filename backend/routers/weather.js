import express from 'express';
import mongoCon from '../modules/mongo.js';
import axios from 'axios';

const weatherColl = new mongoCon('cinteractive', 'weather');

const app = express.Router();

app.get('/:city', getWeatherByCity);
async function getWeatherByCity(req, res) {
  let mongo = await weatherColl.getCollection();
  res.status(200).send(await mongo.find({ city: { $regex: `^${req.params.city}`, $options: 'i' } }).toArray());
}

async function getLiveWeather(req, res) {
  // let mongo = await weatherColl.getCollection();
  // let items = [
  //   { city: 'Klang', weather: 'hot' },
  //   { city: 'Shah Alam', weather: 'cloudy' }
  // ];

  // let insert = await mongo.insertMany(items);
  // res.status(200).send(`Insert ${insert.insertedCount} rows`);
}

export default app;