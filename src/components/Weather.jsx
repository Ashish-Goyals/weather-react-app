import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import drizzle_icon from '../assets/drizzle.png';
import humidity_icon from '../assets/humidity.png';
import wind_icon from '../assets/wind.png';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const inputRef = useRef();

  const allIcons = useMemo(() => ({
    "01d": clear_icon,
    "02d": cloud_icon,
    "03d": cloud_icon,
    "04d": cloud_icon,
    "09d": rain_icon,
    "10d": rain_icon,
    "11d": rain_icon,
    "13d": snow_icon,
    "50d": drizzle_icon,
    "01n": clear_icon,
    "02n": cloud_icon,
    "03n": cloud_icon,
    "04n": cloud_icon,
    "09n": rain_icon,
    "10n": rain_icon,
    "11n": rain_icon,
    "13n": snow_icon,
    "50n": drizzle_icon
  }), []);

  const search = useCallback(async (city = "Delhi") => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_APP_ID}&units=metric`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.cod === 200) {
        const icon = allIcons[data.weather[0].icon] || clear_icon;
        setWeatherData({
          humidity: data.main.humidity,
          wind: data.wind.speed,
          temp: Math.round(data.main.temp),
          location: data.name,
          icon: icon,
        });
      } else {
        console.warn("City not found:", data.message);
        setWeatherData(null);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }, [allIcons]);

  useEffect(() => {
    search();
  }, [search]);

  return (
    <div className="weather">
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder="Search" />
        <img src={search_icon} alt="Search" onClick={() => search(inputRef.current.value || "Delhi")} />
      </div>

      {weatherData ? (
        <>
          <img src={weatherData.icon} alt="Weather Icon" className="weather-icon" />
          <p className="temperature">{weatherData.temp} °C</p>
          <p className="location">{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="Humidity" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="Wind" />
              <div>
                <p>{weatherData.wind} Km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="loading">Loading weather data...</p>
      )}
    </div>
  );
};

export default Weather;
