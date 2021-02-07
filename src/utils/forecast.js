const request = require('request');

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=a1661f443bf437295951d66dbf3aaae2&query=${latitude},${longitude}`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback('Unable to connect to weather service!', undefined);
    } else if (body.error) {
      callback('Unable to find location', undefined);
    } else {
      const {
        current: {
          weather_descriptions,
          temperature,
          feelslike,
          humidity,
          precip,
        },
      } = body;
      callback(
        undefined,
        weather_descriptions[0] +
          ' It is currently ' +
          temperature +
          ` degress out and it feels like ${feelslike} degrees. Humidity is ${humidity}% . There is a ` +
          precip +
          '% chance of rain.'
      );
    }
  });
};

module.exports = forecast;
