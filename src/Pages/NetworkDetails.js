import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../Styles/NetworkDetails.css';
import '../Styles/Main.css'
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
  const [errorLogin, setErrorLogin] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bikeResponse = await axios.get(`https://api.citybik.es/v2/networks/${id}`);

        if (!bikeResponse.data?.network?.stations || !Array.isArray(bikeResponse.data.network.stations)) {
          throw new Error("Nieprawidłowe dane z API CityBik.es");
        }

        setStations(bikeResponse.data.network.stations);
        setCity(bikeResponse.data.network.location.city);

        if (token) {
          const favPlacesResponse = await axios.get('http://localhost:8080/user/get-all-fav-places', {
            headers: {
              'Authorization': token,
            }
          });

          const favPlaces = favPlacesResponse.data;
          const filteredFavs = favPlaces.filter(place => place.name === id);
          setFilteredFavStations(filteredFavs);
        }

      } catch (err) {
        console.error("Error:", err);
        setError("Nie udało się załadować danych. Sprawdź połączenie lub spróbuj ponownie.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  const saveToFavorites = async (stationId, networkId) => {
    if (!token) {
      setErrorLogin("Nie jesteś zalogowany!");
      return;
    }

    const requestBody = {
      spotId: stationId,
      name: networkId
    };

    try {
      await axios.post('http://localhost:8080/add-fav-place', requestBody, {
        headers: { 'Authorization': token },
      });

      setFilteredFavStations(prevFavs => [
        ...prevFavs,
        { spotId: stationId, name: networkId }
      ]);
    } catch (error) {
      setError("Błąd podczas zapisywania ulubionej stacji.");
    }
  };

  const deleteFromFavorites = async (stationId, networkId) => {
    if (!token) {
      setErrorLogin("Nie jesteś zalogowany!");
      return;
    }

    const requestBody = {
      spotId: stationId,
      name: networkId
    };

    try {
      await axios.delete('http://localhost:8080/del-fav-place', {
        headers: { 'Authorization': token },
        data: requestBody,
      });

      setFilteredFavStations(prevFavs =>
        prevFavs.filter(fav => fav.spotId !== stationId || fav.name !== networkId)
      );
    } catch (error) {
      setError("Błąd podczas usuwania ulubionej stacji.");
    }
  };

  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="details-container">
        <h1>Stacje rowerowe - {city}</h1>
        {successMessage && <p style={{ color: "green", textAlign: "center" }}>{successMessage}</p>}
        {errorLogin && <p style={{ color: "red", textAlign: "center" }}>{errorLogin}</p>}
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
                  style={{ backgroundColor: '#ccc', cursor: 'pointer' }}
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
