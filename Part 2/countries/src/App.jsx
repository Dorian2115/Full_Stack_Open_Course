import { useState, useEffect } from "react";
import axios from "axios";
import countryService from "./services/countries";

const Filter = ({ filter, handleFilter }) => {
  return (
    <div>
      find countries <input value={filter} onChange={handleFilter} />
    </div>
  );
};

const CountryCard = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area} km²</p>
      <p>Languages:</p>
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
    </div>
  );
};

const CountryContainer = ({ countries, filter }) => {
  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  if (filteredCountries.length === 1) {
    console.log(
      "Displaying information for:" + filteredCountries[0].name.common
    );
    return <CountryCard country={filteredCountries[0]} />;
  } else if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }
  return (
    <ul>
      {filteredCountries.map((country) => (
        <li key={country.cca2}>{country.name.common}</li>
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

  return (
    <div>
      <Filter filter={filter} handleFilter={handleFilter} />
      <CountryContainer countries={countries} filter={filter} />
    </div>
  );
};

export default App;
