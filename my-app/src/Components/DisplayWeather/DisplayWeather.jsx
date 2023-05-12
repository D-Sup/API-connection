import React, { useEffect, useState } from 'react';
import './loading.css';

export default function DisplayWeather(props) {
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState();
  const [weatherForecast, setWeatherForecast] = useState();

  const key = '34bc9f0e13f7fdd3adac28b4f182d8ad';
  const cityValue = props.inptLocation;

  // const getWeather =  () => {
  //   const Weather = fetch(
  //       `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${key}&units=metric&lang=KR`
  //     )
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setWeather(data);
  //       setLoading(false);
  //   })
  // };

  const getWeather = async () => {
    const { latitude, longitude } = await currentLocation();
    const json = await (
      await fetch(
        `https://api.openweathermap.org/data/2.5/weather?${
          cityValue ? 'q=' + cityValue : 'lat=' + latitude + '&lon=' + longitude
        }&appid=${key}&units=metric&lang=KR`,
      )
    ).json();
    setWeather(json);
    // setLoading(false);
  };

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

  const getWeatherForecast = async () => {
    const { latitude, longitude } = await currentLocation();
    const json = await (
      await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?${
          cityValue ? 'q=' + cityValue : 'lat=' + latitude + '&lon=' + longitude
        }&cnt=33&appid=${key}&units=metric&lang=KR`,
      )
    ).json();
    console.log(json)
    const oneDay = 1000 * 60 * 60 * 24;
    const offset = 9 * 60 * 60 * 1000;
    const today = new Date().getTime() + offset;
    const DesiredTime = ' 18:00:00';
    const oneDaysLater = new Date(today + oneDay).toISOString().slice(0, 10) + DesiredTime;
    const twoDaysLater = new Date(today + oneDay * 2).toISOString().slice(0, 10) + DesiredTime;
    const threeDaysLater = new Date(today + oneDay * 3).toISOString().slice(0, 10) + DesiredTime;

    const data = json.list.filter(item => {
      return item.dt_txt === oneDaysLater || item.dt_txt === twoDaysLater || item.dt_txt === threeDaysLater;
    });
    setWeatherForecast(data);
    // setLoading(false);
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
        props.turnBack();
      });
  }

  useEffect(() => {
    processWith();
  }, []);

  return (
    <div>
      {loading ? (
        <div>
          <svg className="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
            <circle
              className="path"
              fill="none"
              stroke-width="6"
              stroke-linecap="round"
              cx="33"
              cy="33"
              r="30"
            ></circle>
          </svg>
        </div>
      ) : (
        <div onClick={props.turnBack}>
          <div className="today-weather">
          <h1>Now</h1>
          <h1>📍 {weather.name}</h1>
          <h2>
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt="" />
          </h2>
          <h2>{weather.weather[0].description}</h2> 
          <h2>{weather.main.temp} °C</h2>
          <h3>최고: {weather.main.temp_max} °C | 최저: {weather.main.temp_min} °C</h3>
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
    </div>
  );
}
