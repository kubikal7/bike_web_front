import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../Styles/NetworkDetails.css';
import Layout from "../Components/Layout";
import axios from "axios";

const NetworkDetails = () => {
  const { id } = useParams();
  const [stations, setStations] = useState([]);
  const [city, setCity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const token = localStorage.getItem('token');
  const [filteredFavStations, setFilteredFavStations] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

useEffect(() => {
  const fetchData = async () => {
    try {
      const bikeResponse = await axios.get(`https://api.citybik.es/v2/networks/${id}`);
      setStations(bikeResponse.data.network.stations);
      setCity(bikeResponse.data.network.location.city);

      if(token){
        const favPlacesResponse = await axios.get('http://localhost:8080/user/get-all-fav-places',
        {
          headers: {
            'Authorization': token,
          }
        });

        const favPlaces = favPlacesResponse.data;
        const filteredFavs = favPlaces.filter(place => place.name === id);
        setFilteredFavStations(filteredFavs);
      }


    } catch (error) {
      console.error("Error:", error);
    }
  };

  fetchData();
}, [id]);

const saveToFavorites = async (stationId, networkId) => {
  if (!token) {
    setError("Nie jesteś zalogowany!");
    return;
  }

  const requestBody = {
    spotId: stationId,
    name: networkId
  };

  try {
    const response = await axios.post('http://localhost:8080/add-fav-place',
      requestBody,
      {
      headers: {
        'Authorization': token,
      },
    });

  } catch (error) {
    setError("Error!");
    return false;
  }
  setFilteredFavStations(prevFavs => [
    ...prevFavs,
    { spotId: stationId, name: networkId }  // Dodajemy nową stację do ulubionych
  ]);
};

const deleteFromFavorites = async (stationId, networkId) => {
  if (!token) {
    setError("Nie jesteś zalogowany!");
    return;
  }

  const requestBody = {
    spotId: stationId,
    name: networkId
  };

  try {
    const response = await axios.delete('http://localhost:8080/del-fav-place',
      {
      headers: {
        'Authorization': token,
      },
      data: requestBody,
    });

  } catch (error) {
    setError("Error!");
    return false;
  }
  setFilteredFavStations(prevFavs => 
    prevFavs.filter(fav => fav.spotId !== stationId || fav.name !== networkId)
  );
};

const filteredStations = stations.filter(station =>
  station.name.toLowerCase().includes(searchTerm.toLowerCase())
);

return (
  <Layout>
    <div className="details-container">
      <h1>Stacje rowerowe - {city}</h1>
      {successMessage && <p style={{ color: "green", textAlign: "center" }}>{successMessage}</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
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
            {filteredFavStations.some(fav => fav.spotId === station.id) ? (
          <button
            onClick={() => deleteFromFavorites(station.id, id)}
            className="favorite-button saved"
            style={{
              backgroundColor: '#ccc',
              cursor: 'pointer'
            }}
          >
            ✅ Zapisane
          </button>
          ) : (
            <button
              onClick={() => saveToFavorites(station.id, id)}
              className="favorite-button"
            >
              ❤️ Zapisz
            </button>
          )}
          </div>
        ))}
      </div>
    </div>
  </Layout>
);

};

export default NetworkDetails;