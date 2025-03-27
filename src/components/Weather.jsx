import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import Swal from 'sweetalert2'
import searchIcon from '../assets/search.png'
import clearIcon from '../assets/clear.png'
import cloudIcon from '../assets/cloud.png'
import drizzleIcon from '../assets/drizzle.png'
import humidityIcon from '../assets/humidity.png'
import rainIcon from '../assets/rain.png'
import snowIcon from '../assets/snow.png'
import windIcon from '../assets/wind.png'

const Weather = () => {

    const inputRef = useRef()
    const [weatherData, setWeatherData] = useState(null);

    const allIcons = {
        "01d": clearIcon,
        "01n": clearIcon,
        "02d": cloudIcon,
        "02n": cloudIcon,
        "03d": cloudIcon,
        "03n": cloudIcon,
        "04d": drizzleIcon,
        "04n": drizzleIcon,
        "09d": rainIcon,
        "09n": rainIcon,
        "10d": rainIcon,
        "10n": rainIcon,
        "13d": snowIcon,
        "13n": snowIcon,
    }

    const search = async (city) => {
        if (city === "")
        {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please, Enter City Name",
            });
            return;
        }
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`;
            
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok)
            {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "City Not Found",
                });
                return;
            }

            console.log(data);
            const icon = allIcons[data.weather[0].icon] || clearIcon;
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                country: data.sys.country,
                icon: icon
            });
        } catch (error) {
            setWeatherData(false);
            console.log(`Error al obtener el clima: ${error}`);
        }
    }

    useEffect(() => {
        search("Buenos Aires");
    }, []);

    return (
        <div className='weather'>
            <div className="search-bar">
                <input ref={inputRef} type="text" placeholder='Search' />
                <img src={searchIcon} alt="Search icon" onClick={() => search(inputRef.current.value)} />
            </div>

            {weatherData ? (
                <>
                    <img src={weatherData.icon} alt="Weather Image" className='weather-icon' />
                    <p className='temperature'>{weatherData.temperature}°C</p>
                    <p className='location'>{weatherData.location}, {weatherData.country}</p>
                    <div className="weather-data">
                        <div className="col">
                            <img src={humidityIcon} alt="Humidity Icon" />
                            <div>
                                <p>{weatherData.humidity} %</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className="col">
                            <img src={windIcon} alt="Wind Icon" />
                            <div>
                                <p>{weatherData.windSpeed} Km/h</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <></>
            )}
        </div>
    );
}

export default Weather