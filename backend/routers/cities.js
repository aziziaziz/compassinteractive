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

app.get('/', getAllCities);
async function getAllCities(req, res) {
  let cityColl = await cities.getCollection();
  let page = req.query.page;
  let totalCount = await cityColl.countDocuments();
  let totalPages = Math.ceil(totalCount / 10);

  let search = req.query.search;
  let sort = req.query.order[0];

  if (page > totalPages) {
    res.status(400).send(`Max page is ${totalPages}`);
    return;
  }
  
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

export default app;