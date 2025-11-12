import React, { useState, useEffect } from "react";
import "./App.css";

import sun from "./Components/sun.png";
import rain from "./Components/rain.png";
import cloud from "./Components/cloud.png";
import snow from "./Components/snow.png";
import wind from "./Components/wind.png";
import humidity from "./Components/humidity.png";
import searchIcon from "./Components/search.png"; 

function App() {
  const [city, setCity] = useState(""); 
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(false);

  const api_key = "YOUR_API_KEY";
  const defaultCity = "Nellore";

  const checkWeather = async (cityName) => {
    if (!cityName) return;

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${api_key}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === "404") {
        setError(true);
        setWeatherData(null);
        return;
      }

      setError(false);
      setWeatherData(data);
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError(true);
    }
  };

  useEffect(() => {
    checkWeather(defaultCity);
  }, []);

  const getWeatherImage = (main) => {
    switch (main) {
      case "Clouds":
        return cloud;
      case "Clear":
        return sun;
      case "Rain":
        return rain;
      case "Mist":
        return humidity;
      case "Snow":
        return snow;
      default:
        return sun;
    }
  };

  return (
    <div className="container">
      <div className="search-box">
        <input
          type="text"
          className="input-box"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && checkWeather(city)}
        />
        <button id="searchBtn" onClick={() => checkWeather(city)}>
          <img src={searchIcon} alt="search" className="search-icon" />
        </button>
      </div>

      {error && (
        <div className="location-not-found">
          <h1>OOPS...!!</h1>
          <h2>Location not found</h2>
        </div>
      )}

      {weatherData && !error && (
        <div className="weather-body">
          <img
            src={getWeatherImage(weatherData.weather[0].main)}
            alt="weather"
            className="weather-img"
          />

          <h2 className="city-name">{weatherData.name}</h2>

          <div className="weather-details">
            <h2 className="temperature">
              {Math.round(weatherData.main.temp - 273.15)}°C
            </h2>
            <h3 className="description">
              {weatherData.weather[0].description}
            </h3>

            <div className="extra-info">
              <div className="info">
                <img src={humidity} alt="humidity" className="info-icon" />
                <div>
                  <p>Humidity</p>
                  <div id="humidity">{weatherData.main.humidity}%</div>
                </div>
              </div>

              <div className="info">
                <img src={wind} alt="wind" className="info-icon" />
                <div>
                  <p>Wind Speed</p>
                  <span id="wind-speed">{weatherData.wind.speed} Km/H</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;