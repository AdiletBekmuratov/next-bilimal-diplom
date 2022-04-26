import React, { useEffect, useState } from "react";
import CurrentWeatherComponent from "./CurrentWeatherComponent";
import ErrorMessageComponent from "./ErrorMessageComponent";

function WeatherComponent() {
  let [error, setError] = useState(false);
  let [currentWeather, setCurrentWeather] = useState({
    temp: "1",
    feels_like: "-1",
    description: "снег",
    icon: "50d",
    name: "Нур-Султан, KZ",
    lat: 51.169392,
    lon: 71.449074,
  });

  let [url, setUrl] = useState(
    `https://api.openweathermap.org/data/2.5/weather?lat=${currentWeather.lat}&lon=${currentWeather.lon}&appid=${process.env.NEXT_PUBLIC_WEATHER_API}&units=metric&lang=ru`
  );

  useEffect(() => {
    const getWeather = async () => {
      try {
        let res = await fetch(url);
        res = await res.json();
        let { description, icon } = res.weather[0];
        let { temp, feels_like } = res.main;
        setCurrentWeather({
          temp,
          feels_like,
          description,
          icon,
          name: `${res.name}, ${res.sys.country}`,
          lat: res.coord.lat,
          lon: res.coord.lon,
        });
      } catch (e) {
        setError(true);
      }
    };
    getWeather();
  }, [url]);

  return (
    <div className="text-white">
      {error && <ErrorMessageComponent />}

      <div className="font-sans md:w-128 max-w-lg rounded-lg overflow-hidden bg-blue-600 shadow-md hover:shadow-lg transition-all">
        <CurrentWeatherComponent weather={currentWeather} />
      </div>
    </div>
  );
}

export default WeatherComponent;
