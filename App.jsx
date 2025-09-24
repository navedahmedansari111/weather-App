import React,{ useEffect, useState } from 'react'
import "./index.css";
import axios from 'axios';
import { CloudRain, Droplet, GlassWater, Search, Sun, Wind } from "lucide-react"

  // search
  const popularCities = [
  "Mumbai","Delhi","Bangalore","Hyderabad","Chennai","Kolkata","Pune","Ratlam",
  "Ahmedabad","Jaipur","Lucknow","Chandigarh","Surat","Nagpur","Bhopal",
  "Indore","Visakhapatnam","Varanasi","Patna","Ranchi","Guwahati",
  "Coimbatore","Thiruvananthapuram","Vijayawada","Mysore","Nashik",
  "Kanpur","Raipur","Jodhpur","Amritsar","Dehradun"
];

const App = () => {
  const [suggestions, setSuggestions] = useState([]);
  // weather api
  const [city, setCity] = useState('')
  const [weatherData, setWeatherData] = useState(null);
  // import api .env
  const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
  // icon display acording weather
  // arro function (main) me hamara discription jaega 

  // user jo bhi city search krega vo suggestion dene lagega
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setCity(value);
    if(value.length > 0) {
      const matches = popularCities.filter((c) => 
      c.toLowerCase().startsWith(value.toLowerCase())   //lower case q ki user kuch bhi type kr sakte h 
    ).slice(0,8)
    setSuggestions(matches);  //jo bhi hamare suggestion aayenge
    } else {
      setSuggestions([]);      //kuch nhi aya to empty
    }
  }

  // city name fetch onmain screen
  const getWeatherData = async (cityName = city) => {
    const selectedCity = popularCities.find(
      (c) => c.toLowerCase() === cityName.toLowerCase()
    );
    if(!selectedCity) {
      alert("please select a valid city from suggestions");
      return;
    }

    try {

      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${apiKey}`
      );
      setWeatherData(response.data);
      setCity('');
      setSuggestions([]);
    } catch(error) {
      console.error('Error fetching weather data:', error);
    }
    // jo response aya h use set kr dege
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion);
    getWeatherData(suggestion);
  }

  // .env file src folder k bahar honi chahiye

  const getWeatherIcon = (main) => {
    switch (main) {
      case "Clear":
        return <Sun size={80} strokeWidth={1.5}/>
      case "Clouds":
        return <CloudRain size={80} strokeWidth={1.5}/>
      case "Rain":
      case "Drizzle":
        return <CloudRain size={80} strokeWidth={1.5}/>
      case "Snow":
        return <CloudRain className='rotate-45' size={80} strokeWidth={1.5}/>
      case "Thunderstorm":
        return <CloudRain   className='animate-pulse' size={80} strokeWidth={1.5}/>
      case "Mist":
      case "Fog":
        return <Wind size={80} strokeWidth={1.5}/>
      default:
        return <CloudRain size={80} strokeWidth={1.5}/>;
    }
  };
   useEffect(() => {
    getWeatherData("Mumbai");
  }, []);

  
  return (
    
    <div className='relative flex justify-center items-center px-4 min-h-screen bg-weather-gradient'>
      <div className='max-w-5xl w-full shadow-2xl p-8 bg-weather-gradient backdrop-blur-sm rounded-2xl space-y-6 border-white/20'>
      {/* header */}
      <div className='flex flex-col md:flex-row just-between items-center gap-110 relative'>
        <h1 className='font-bold text-4xl text-white tracking-wide'>
          WeatherNow
        </h1>
        <div className='w-full md:w-auto relative'>
          <div className='flex items-center space-x-3'>
            <input type="text"
            placeholder='Enter a city'
            value={city}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    getWeatherData();
                  }
                }}
                className="px-4 py-2 w-full bg-white/20 placeholder-white text-white border border-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300"/>
            <button className='p-3 cursor-pointer' onClick={() => getWeatherData()}>
              <Search size={28} className='text-white'/>
            </button>
          </div>
          {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white text-black mt-2 rounded-xl overflow-hidden shadow-md max-h-48 overflow-y-auto">
                {suggestions.map((s, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(s)}
                    className="px-4 py-2 hover:bg-purple-100 cursor-pointer"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
        </div>
      </div>
      {/* weather display */}
      {/* icons acording weather */}
      {weatherData && (
          <>
            {/* Temperature Section */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-weather-gradient backdrop-blur-sm rounded-xl p-6 shadow-xl space-y-4 md:space-y-0">
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-start justify-center md:justify-start space-x-2">
                  <h2 className="text-7xl md:text-8xl text-white font-bold">
                    {Math.round(weatherData.main.temp - 273.15)}
                  </h2>
                  <span className="text-3xl md:text-5xl text-white">°C</span>
                </div>
                <h3 className="text-white text-xl md:text-2xl font-medium">{`${weatherData.name} , ${weatherData.sys.country}`}</h3>
                <h4 className="text-white text-lg md:text-xl capitalize">
                  {weatherData.weather[0].description}
                </h4>
              </div>
              <div className="text-white">
                {getWeatherIcon(weatherData.weather[0].main)}
              </div>
            </div>

            {/* Info Boxes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
              <WeatherBox icon={<Droplet size={32} />} title="Humidity" value={`${weatherData.main.humidity}%`} />
              <WeatherBox icon={<GlassWater size={32} />} title="Pressure" 
              value={`${weatherData.main.pressure} hPa`} />
              <WeatherBox icon={<Wind size={32} />} title="Wind Speed" value={`${weatherData.wind.speed} km/h`} />
              <WeatherBox icon={<Sun size={32} />} title="Feels Like" value={`${Math.round(weatherData.main.feels_like - 273.15)} °C`}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// cards-center 
const WeatherBox = ({ icon, title, value }) => {
  return (
    
    <div className='backdrop-blur-sm rounded-2xl p-4 shadow-xl flex flex-col items-center space-y-2 boder border-white/20 hover:scale-105 transition-transform'>
      <div className='text-white'>{icon}</div>
      <h3 className='text-lg font-semibold'>{title}</h3>
      <p className='text-xl font-bold'>{value}</p>
    </div>
  );
};

export default App;