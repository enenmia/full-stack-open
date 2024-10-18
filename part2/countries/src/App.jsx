import { useEffect, useState } from 'react'
import './App.css'
import countriesService from './services/countries'
import weatherService from './services/weather'

const Filter=({newQuery,handleNewQuery})=>{
  return(
    <div>
      find countries: <input value={newQuery} onChange={handleNewQuery}/>
    </div>
  )
}
const CountryDetail=({country})=>{
  const [weather, setWeather] = useState(null);
  useEffect(()=>{
    weatherService.getWeatherByCityName(country.capital)
    .then(weatherData => {
      setWeather(weatherData)
      console.log('full weather data',weatherData)
    })
    .catch(error => {
      console.error('Error fetching weather data:', error.response ? error.response.data : error.message);
    });
  },[country.capital])
  return(
    <div >
    <h2>{country.name.common}</h2>
    <p>capital {country.capital}</p>
    <p>area {country.area}</p>
    <h3>languages:</h3>
    <ul>
      {Object.values(country.languages).map(language=>
        <li  key={language}>{language}</li>
      )}
    </ul>
    <img src={country.flags.png}/>
    <h3>Weather in {country.capital}</h3>
    {weather?
    <div>
    <p>temprature {weather.main.temp} Celcius</p>
    <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}/>
    <p>Wind: {weather.wind.speed} m/s</p>
    </div>
    :<p>loading weather...</p>
    }
    
  </div>
  )
}
const Results=({resultsToShow,handleShowCountry,chosenCountry})=>{
  if (resultsToShow.length>10){
    return<p>too many countries, please be more specific</p>
  }
  if(resultsToShow.length===1){
    const onlyCountry=resultsToShow[0]
    return (
      <CountryDetail country={onlyCountry}/>
    )
  }
  return(
    <div>
    {resultsToShow.map(country => (
      <div key={country.name.common}>
        <p>{country.name.common}
        <button onClick={()=>handleShowCountry(country.name.common)}>show</button>
        </p>
        {/* <CountryDetail country={country}/> */}
        {chosenCountry === country.name.common && (
        <CountryDetail country={country}/>
      )}
      </div>
    ))}
  </div>
  )
}
const App=()=> {
  const [countries,setCountries]=useState([])
  const [newQuery, setNewQuery] = useState('')
  const [chosenCountry,setChosenCountry]=useState(null)
  // const apiKey = import.meta.env.VITE_SOME_KEY;
  useEffect(()=>{

   

    countriesService
    .getAll()
    .then(initialCountries=>setCountries(initialCountries))
    .catch(error=>console.log('error getting data:',error))
  },[])
  const handleShowCountry=(countryCommonName)=>{
    setChosenCountry(countryCommonName)
  }
  const handleNewQuery=(e)=>{
    setNewQuery(e.target.value)
  }
  const resultsToShow=newQuery===''
  // ?countries.map(country=>country.name.common)
  // :(countries.filter(country=>country.name.common.toLowerCase().includes(newQuery.toLowerCase()))).map(country=>country.name.common)
  ?countries
  :(countries.filter(country=>country.name.common.toLowerCase().includes(newQuery.toLowerCase())))
  return (
    <div className="align-left">
     <Filter 
     newQuery={newQuery}
     handleNewQuery={handleNewQuery}
     />
     <Results
     resultsToShow={resultsToShow}
     handleShowCountry={handleShowCountry}
     chosenCountry={chosenCountry}
     />
    </div>
  )
}

export default App
