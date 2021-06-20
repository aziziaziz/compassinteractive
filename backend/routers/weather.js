import express from 'express';
import mongoCon from '../modules/mongo.js';
import axios from 'axios';

const weatherColl = new mongoCon('cinteractive', 'weather');

const app = express.Router();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());

app.post('/', getWeatherByLatLng);
async function getWeatherByLatLng(req, res) {
  let dateTimeUnix = parseInt(req.body['time']) / 1000;
  let lati = req.body['latlng'].split(',')[0];
  let long = req.body['latlng'].split(',')[1];

  const weatherQuery = { $and: [
    { location: req.body['latlng'] },
    { datetime: { $lte: dateTimeUnix } }
  ] };
  let mongo = await weatherColl.getCollection();
  let weather = await mongo.find(weatherQuery).sort({ datetime: -1 });
  
  let savedWeather = await weather.toArray();
  console.log(savedWeather.length)

  if (savedWeather.length > 0) {
    console.log('from db');
    let result = savedWeather[0];
    result['datetime'] = formatDate(result['datetime']);
    res.status(200).send(result);
  } else {
    console.log('from live');
    await mongo.insertMany(await getLiveWeather(lati, long));
    weather = await mongo.find(weatherQuery).sort({ datetime: -1 });
    let result = (await weather.toArray())[0];
    result['datetime'] = formatDate(result['datetime']);
    res.status(200).send(result);
  }
}

async function getLiveWeather(lat, lng) {
  let liveData = (await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=current,minutely,daily&units=metric&appid=7b768aaab00c1f87e4651a3deb81d6ab`)).data;
  let hourly = liveData.hourly;
  let result = [];

  hourly.forEach(h => {
    let obj = {
      location: `${lat},${lng}`,
      datetime: h['dt'],
      temp: {
        c: h['temp'],
        f: (h['temp'] * 9 / 5) + 32
      },
      feelslike: {
        c: h['feels_like'],
        f: (h['feels_like'] * 9 / 5) + 32
      },
      visibility: {
        km: h['visibility'] / 1000,
        mp: h['visibility'] / 1609
      },
      windspeed: {
        kmh: h['wind_speed'] * 3.6,
        mph: h['wind_speed'] * 2.237
      },
      description: h['weather'][0]['description'],
      icon: `http://openweathermap.org/img/wn/${h['weather'][0]['icon']}@2x.png` 
    };
    result.push(obj);
  });

  return result;
}

function formatDate(time) {
  let dateObj = new Date(time * 1000);
  let date = dateObj.getDate() < 10 ? `0${dateObj.getDate()}` : dateObj.getDate();
  let mon = (dateObj.getMonth() + 1) < 10 ? `0${dateObj.getMonth() + 1}` : (dateObj.getMonth() + 1);
  let yrs = dateObj.getFullYear();
  let hrs = dateObj.getHours() < 10 ? `0${dateObj.getHours()}` : dateObj.getHours();
  let min = dateObj.getMinutes() < 10 ? `0${dateObj.getMinutes()}`: dateObj.getMinutes();
  return `${yrs}-${mon}-${date} ${hrs}:${min}`;
}

export default app;