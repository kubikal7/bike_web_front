import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../Styles/NetworkDetails.css';
import Layout from "../Components/Layout";

const NetworkDetails = () => {
  const { id } = useParams();
const [stations, setStations] = useState([]);
const [city, setCity] = useState('');
const [searchTerm, setSearchTerm] = useState('');
const token = localStorage.getItem('token');

useEffect(() => {
  fetch(`https://api.citybik.es/v2/networks/${id}`)
    .then(res => res.json())
    .then(data => {
      setStations(data.network.stations);
      setCity(data.network.location.city);
    })
    .catch(err => console.error("Error:", err));
}, [id]);

const saveToFavorites = (stationId, networkId) => {
  if (!token) {
    alert("Nie jesteś zalogowany!");
    return;
  }

  const requestBody = {
    stationId: stationId,
    networkId: networkId,
    token: token
  };

  fetch('http://localhost:8080/favspots/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("Stacja została dodana do ulubionych!");
      } else {
        alert("Błąd podczas zapisywania stacji.");
      }
    })
    .catch(err => {
      console.error("Błąd:", err);
      alert("Wystąpił problem z zapisem.");
    });
};

const filteredStations = stations.filter(station =>
  station.name.toLowerCase().includes(searchTerm.toLowerCase())
);

return (
  <Layout>
    <div className="details-container">
      <h1>Stacje rowerowe - {city}</h1>

      <input
        type="text"
        placeholder="Szukaj stacji..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bike-search-input"
      />

      <div className="stations-grid">
        {filteredStations.map(station => (
          <div key={station.id} className="station-card">
            <h2>{station.name}</h2>
            <p>🚲 Dostępne rowery: {station.free_bikes}</p>
            <p>🅿️ Wolne miejsca: {station.empty_slots}</p>
            <a 
              href={`https://www.google.com/maps?q=${station.latitude},${station.longitude}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="map-link"
            >
              Zobacz na mapie 📍
            </a>
            <button
              onClick={() => saveToFavorites(station.id, id)}
              className="favorite-button"
            >
              ❤️ Zapisz
            </button>
          </div>
        ))}
      </div>
    </div>
  </Layout>
);

};

export default NetworkDetails;