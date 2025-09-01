import axios from "axios";

const baseGeoUrl = "http://api.openweathermap.org/geo/1.0/direct?q=";
const baseWeatherUrl = "http://api.openweathermap.org/data/2.5/weather";
const apiKey = import.meta.env.VITE_SOME_KEY;

const weatherReport = ({ city }) => {
  const location = axios
    .get(`${baseGeoUrl}${city}&limit=1&appid=${apiKey}`)
    .then((response) => response.data[0]);
  const request = location.then((loc) => {
    return axios.get(
      `${baseWeatherUrl}?lat=${loc.lat}&lon=${loc.lon}&appid=${apiKey}`
    );
  });
  return request.then((response) => response.data);
};

export default { weatherReport };
