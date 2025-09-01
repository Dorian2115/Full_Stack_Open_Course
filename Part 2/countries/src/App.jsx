import { useState, useEffect, use } from "react";
import axios from "axios";
import countryService from "./services/countries";
import weatherService from "./services/weather";

const baseIconUrl = "https://openweathermap.org/img/wn";

const Filter = ({ filter, handleFilter }) => {
  return (
    <div>
      find countries <input value={filter} onChange={handleFilter} />
    </div>
  );
};

const CountryCard = ({ country }) => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    weatherService.weatherReport({ city: country.capital }).then((data) => {
      setWeatherData(data);
    });
  }, [country.capital]);

  const iconUrl = `${baseIconUrl}/${weatherData?.weather[0]?.icon}@2x.png`;
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area} km²</p>
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <p>
        <img
          src={country.flags.png}
          alt={`Flag of ${country.name.common}`}
          style={{ border: "1px solid black" }}
        />
      </p>
      <h3>Weather in {country.capital}</h3>
      <p>Temperature: {(weatherData?.main?.temp - 273.15).toFixed(1)} °C</p>
      <p>
        <img src={iconUrl} alt={`Weather icon for ${country.capital}`} />
      </p>
      <p>Wind: {weatherData?.wind?.speed} m/s</p>
    </div>
  );
};

const CountryContainer = ({ countries, filter, handleShow }) => {
  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  if (filteredCountries.length === 1) {
    console.log(
      "Displaying information for: " + filteredCountries[0].name.common
    );
    return <CountryCard country={filteredCountries[0]} />;
  } else if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }
  return (
    <ul>
      {filteredCountries.map((country) => (
        <li key={country.cca2}>
          {country.name.common}{" "}
          <button onClick={handleShow(country)}>Show</button>
        </li>
      ))}
    </ul>
  );
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    countryService.getAllCountries().then((data) => {
      setCountries(data);
    });
  }, []);

  const handleFilter = (event) => {
    console.log(event.target.value);
    setFilter(event.target.value);
  };

  const handleShow = (country) => () => {
    console.log("Showing details for:", country.name.common);
    setFilter(country.name.common);
  };

  return (
    <div>
      <Filter filter={filter} handleFilter={handleFilter} />
      <CountryContainer
        countries={countries}
        filter={filter}
        handleShow={handleShow}
      />
    </div>
  );
};

export default App;
