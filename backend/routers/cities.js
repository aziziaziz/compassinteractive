import express from 'express';
import mongoCon from '../modules/mongo.js';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const app = express.Router();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());

const cities = new mongoCon('cinteractive', 'cities');

const defaultCities = require('../files/cities.json');

// app.get('/default', insertDefault);
async function insertDefault() {
  let mongo = await cities.getCollection();
  let insert = await mongo.insertMany(defaultCities);

  if (insert.insertedCount > 0) {
    // res.status(200).send(`Successfully inserted ${insert.insertedCount} default cities in db!`);
    return true;
  } else {
    // res.status(503).send('There was an error occurred while inserting your default cities. Please try again.');
    return false;
  }
}

app.get('/', getAllCities);
async function getAllCities(req, res) {
  let cityColl = await cities.getCollection();
  let totalCount = await cityColl.countDocuments();

  if (totalCount == 0) {
    await insertDefault();
    totalCount = await cityColl.countDocuments();
  }

  let search = req.query.search;
  let sort = req.query.order[0];
  
  let columns = [ 'city', 'state', 'country', 'latlong' ];
  let sortKey = columns[parseInt(sort['column'])];
  let sortObj = {};
  sortObj[sortKey] = sort['dir'] == 'asc' ? 1 : -1;

  let searchResult = cityColl.find({ city: { $regex: `^${search.value}`, $options: 'i' } });

  let result = searchResult.sort(sortObj).limit(parseInt(req.query.length)).skip(parseInt(req.query.start));
  let resultJson = await result.toArray();
  resultJson.forEach(r => delete r['_id']);
  res.status(200).send({
    draw: req.query.draw,
    recordsFiltered: await searchResult.count(),
    recordsTotal: parseInt(totalCount),
    result: resultJson
  });
}

app.post('/Add', insertCity);
async function insertCity(req, res) {
  let body = req.body;
  let mongo = await cities.getCollection();
  let added = await mongo.insertOne(body);

  if (added.insertedCount > 0) {
    res.status(200).send(true);
  } else {
    res.status(400).send(false);
  }
}

export default app;