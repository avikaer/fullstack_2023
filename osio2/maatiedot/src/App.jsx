import { useEffect, useState } from 'react'
import axios from 'axios'
import SearchForm from './components/SearchForm'

function App() {
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState('');
  const [searchCountry, setSearchCountry] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v2/all')
        setCountries(response.data);
      } catch (error) {
        setError(error.message);
      }
    }
    fetchData()
  }, 
  [])

  const handleSearchChange = (event) => {
    setSearchCountry(event.target.value);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchCountry.toLowerCase())

  );

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
     <div>
        <SearchForm
          searchCountry={searchCountry}
          handleSearchChange={handleSearchChange}
        />
      {filteredCountries.length === 0 ? (
        <p>No matches found.</p>
      ) : filteredCountries.length === 1 ? (
        <div>
          <h2>{filteredCountries[0].name}</h2>
          <p>capital {filteredCountries[0].capital}</p>
          <p>area {filteredCountries[0].area}</p>
          <div><h2>languages:</h2>
            <ul>
              {filteredCountries[0].languages.map((language) => (
                <li key={language.name}>{language.name}</li>
              ))}
            </ul>
            </div>
          {filteredCountries.length === 1 && (
            <img
              src={filteredCountries[0].flags[0]}
            />
          )}
        </div>
      ) : filteredCountries.length <= 10 ? (
        <ul>
          {filteredCountries.map((country) => (
            <li key={country.alpha2Code}>{country.name}</li>
          ))}
        </ul>
      ) : (
        <p>Too many matches, specify another filter</p>
      )}
    </div>
  )
}

export default App
