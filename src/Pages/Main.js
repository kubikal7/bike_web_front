import { useEffect } from 'react';
import React, {useState} from 'react';
import Layout from '../Components/Layout';
import "../Styles/Main.css"
import { Link } from 'react-router-dom';

function Main() {
      
  const [cityList, setCityList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    fetch("https://api.citybik.es/v2/networks")
      .then((response) => response.json())
      .then((data) => {
        const cityIdPairs = data.networks
          .filter(net => net.location.city)
          .map(net => ({ city: net.location.city, id: net.id }));
  
        const uniqueCityMap = new Map();
        cityIdPairs.forEach(({ city, id }) => {
          if (!uniqueCityMap.has(city)) {
            uniqueCityMap.set(city, id);
          }
        });
  
        const uniqueCityList = Array.from(uniqueCityMap.entries())
          .map(([city, id]) => ({ city, id }))
          .sort((a, b) => a.city.localeCompare(b.city));
  
        setCityList(uniqueCityList);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  
  const filteredCities = cityList.filter(({ city }) =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Layout>
      <div className="bike-container">
        <h1 className="bike-title">Lista Miast - Sieci Rowerowe</h1>
  
        <input
          type="text"
          placeholder="Wpisz nazwę miasta..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bike-search-input"
        />
  
        <div className="bike-grid">
          {filteredCities.map(({ city, id }) => (
            <Link
              key={id}
              to={`/network/${id}`}
              rel="noopener noreferrer"
              className="bike-card"
            >
              <h2 className="bike-city">{city}</h2>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
export default Main;