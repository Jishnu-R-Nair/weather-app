const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

const publicDirectory = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectory));

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'Jishnu',
  });
});

app.get('/help', (req, res) => {
  res.send({ name: 'Jishnu', age: '26' });
});

app.get('/weather', (req, res) => {
  /*if (!req.query.address) return res.json({ error: 'No address is provided' });

  res.json({
    forecast: 'Its snowing',
    location: 'Pala',
    address: req.query.address,
  });*/

  const { address } = req.query;

  geocode(address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.json({ error });
    }
    console.log({ latitude, longitude, location });
    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.json({ error });
      }

      res.json({ location, forecast: forecastData, address });
    });
  });
});

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term',
    });
  }

  res.send({ products: [] });
});

app.get('/help/*', (req, res) => {
  res.render('404', { errorMessage: 'No related help article found' });
});

app.get('*', (req, res) => {
  res.render('404', { errorMessage: 'Some error happened' });
});

app.listen(port, () => {
  console.log(`App is up and running on port ${port}`);
});
