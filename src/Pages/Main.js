import React, { useEffect, useState } from 'react';
import Layout from '../Components/Layout';
import "../Styles/Main.css";
import { Link } from 'react-router-dom';

function Main() {
  const [cityList, setCityList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://api.citybik.es/v2/networks")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Błąd HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!data.networks || !Array.isArray(data.networks)) {
          throw new Error("Niepoprawny format danych: brak 'networks'");
        }

        const cityIdPairs = data.networks
          .filter(net =>
            net.location &&
            typeof net.location.city === 'string' &&
            typeof net.id === 'string'
          )
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
        setLoading(false);
      })
      .catch((err) => {
        console.error("Błąd podczas pobierania danych:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredCities = cityList.filter(({ city }) =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <p>Ładowanie danych...</p>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <p className="bike-error">Błąd: {error}</p>
      </Layout>
    );
  }

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
          {filteredCities.length > 0 ? (
            filteredCities.map(({ city, id }) => (
              <Link
                key={id}
                to={`/network/${id}`}
                rel="noopener noreferrer"
                className="bike-card"
              >
                <h2 className="bike-city">{city}</h2>
              </Link>
            ))
          ) : (
            <p className="bike-empty">Brak wyników dla: <strong>{searchTerm}</strong></p>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Main;
