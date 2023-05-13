import './loading.css'

import React, { useState, useEffect } from 'react';

export default function DisplayWeather(props) {
  const cityValue = props.inptLocation;
  const key = '34bc9f0e13f7fdd3adac28b4f182d8ad';
  const [weather, setWeather] = useState('');
  const [weatherForecast, setWeatherForecast] = useState('');
  const [loading, setLoading] = useState(true);

  const getWeather = async () => {
    const { latitude, longitude } = await currentLocation();
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?${
        cityValue ? 'q=' + cityValue : 'lat=' + latitude + '&lon=' + longitude
      }&appid=${key}&units=metric&lang=KR`,
    );
    const result = await response.json();
    setWeather(result);
  };

  const getWeatherForecast = async () => {
    const { latitude, longitude } = await currentLocation();
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?${
        cityValue ? 'q=' + cityValue : 'lat=' + latitude + '&lon=' + longitude
      }&appid=${key}&units=metric&lang=KR`,
    );
    const result = await response.json();

    const oneDay = 1000 * 60 * 60 * 24;
    const offset = 9 * 60 * 60 * 1000;
    const today = new Date().getTime() + offset;
    const DesiredTime = ' 18:00:00';
    const oneDaysLater = new Date(today + oneDay).toISOString().slice(0, 10) + DesiredTime;
    const twoDaysLater = new Date(today + oneDay * 2).toISOString().slice(0, 10) + DesiredTime;
    const threeDaysLater = new Date(today + oneDay * 3).toISOString().slice(0, 10) + DesiredTime;

    const data = result.list.filter(item => {
      return item.dt_txt === oneDaysLater || item.dt_txt === twoDaysLater || item.dt_txt === threeDaysLater;
    });

    console.log(data);
    setWeatherForecast(data);
  };

  async function processWith() {
    await Promise.all([getWeather(), getWeatherForecast()])
      .then(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
        console.log(weatherForecast);
      })
      .catch(error => {
        props.turnBack()
      });
  }

  function currentLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          resolve({ latitude, longitude });
        },
        error => {
          reject('error');
        },
      );
    });
  }

  useEffect(() => {
    processWith();
  }, []);

  // name, weather[0].icon, weather[0].description, weather.main.temp, weather.main.temp_max, weather.main.temp_min

  // weather[0].icon, dt_txt, weather[0].description, main.temp

  return (
    <>
      {loading ? (
        <div className="loading">Loading&#8230;</div>
      ) : (
        <div onClick={props.turnBack}>
          <div className="today-weather">
            <h1>Now</h1>
            <h1>{weather.name}</h1>
            <h2>
              <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt="" />
            </h2>
            <h2>{weather.weather[0].description}</h2>
            <h2>{weather.main.temp}</h2>
            <h3>
              최고: {weather.main.temp_max} | 최저: {weather.main.temp_min}
            </h3>
          </div>
          <div className="feature-weathers">
          {weatherForecast.map((item, index) => {
            return (
              <div className="feature-weather" key={index}>
                <h4>
                <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt="" />
                </h4>
                <h4>{item.dt_txt.slice(5, 10)}</h4>
                <h5>{item.weather[0].description}</h5>
                <h5>{item.main.temp} °C</h5>
              </div>
            );
          })}
          </div>
        </div>
      )}
    </>
  );
}