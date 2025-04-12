import { useEffect } from 'react';
import React, {useState} from 'react';
import Layout from '../Components/Layout';
import "../Styles/Main.css"
import { Link } from 'react-router-dom';

function Main() {
      
    const [cityList, setCityList] = useState([]);

    useEffect(() => {
      fetch("https://api.citybik.es/v2/networks")
        .then((response) => response.json())
        .then((data) => {
          // Tworzymy listę par {city, id}
          const cityIdPairs = data.networks
            .filter(net => net.location.city) // odrzuca puste city
            .map(net => ({ city: net.location.city, id: net.id }));
  
          // Tworzymy mapę, żeby wyeliminować duplikaty — jeśli city już jest, pomijamy
          const uniqueCityMap = new Map();
          cityIdPairs.forEach(({ city, id }) => {
            if (!uniqueCityMap.has(city)) {
              uniqueCityMap.set(city, id);
            }
          });
  
          // Zamieniamy z powrotem do tablicy, sortujemy po city
          const uniqueCityList = Array.from(uniqueCityMap.entries())
            .map(([city, id]) => ({ city, id }))
            .sort((a, b) => a.city.localeCompare(b.city));
  
          setCityList(uniqueCityList);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <Layout>
            <div className="bike-container">
                <h1 className="bike-title">Lista Miast - Sieci Rowerowe</h1>
                <div className="bike-grid">
                    {cityList.map(({ city, id }) => (
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