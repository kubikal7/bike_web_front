import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../Components/Layout";
import "../Styles/NetworkDetails.css";

const FavSpots = () => {
    const [favStations, setFavStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) {
        alert("Nie jesteś zalogowany!");
        return;
      }

      try {
        const favResponse = await axios.get("http://localhost:8080/user/get-all-fav-places", {
          headers: { Authorization: token },
        });

        const favPlaces = favResponse.data;

        const stationData = [];

        const networksByName = favPlaces.reduce((acc, fav) => {
          if (!acc[fav.name]) acc[fav.name] = [];
          acc[fav.name].push(fav.spotId);
          return acc;
        }, {});

        for (const [networkName, spotIds] of Object.entries(networksByName)) {
          const res = await axios.get(`https://api.citybik.es/v2/networks/${networkName}`);
          const stations = res.data.network.stations;
          const city = res.data.network.location.city;

          spotIds.forEach((spotId) => {
            const station = stations.find((s) => s.id === spotId);
            if (station) {
              station.networkName = networkName;
              station.city = city;
              stationData.push(station);
            }
          });
        }

        setFavStations(stationData);
      } catch (error) {
        console.error("Błąd podczas pobierania ulubionych stacji:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const deleteFromFavorites = async (stationId, networkId) => {
    if (!token) {
      alert("Nie jesteś zalogowany!");
      return;
    }

    const requestBody = {
      spotId: stationId,
      name: networkId,
    };

    try {
      await axios.delete("http://localhost:8080/del-fav-place", {
        headers: {
          Authorization: token,
        },
        data: requestBody,
      });

      setFavStations((prev) =>
        prev.filter((s) => !(s.id === stationId && s.networkName === networkId))
      );
    } catch (error) {
      setError("Wystąpił błąd przy usuwaniu z ulubionych.");
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="details-container">
        <h1>Zapisane stacje rowerowe</h1>
        {successMessage && <p style={{ color: "green", textAlign: "center" }}>{successMessage}</p>}
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {loading ? (
          <p>Ładowanie ulubionych stacji...</p>
        ) : favStations.length === 0 ? (
          <p>Brak zapisanych stacji.</p>
        ) : (
          <div className="stations-grid">
            {favStations.map((station) => (
              <div key={station.id} className="station-card">
                <h2>{station.name}</h2>
                <p>📍 Miasto: {station.city}</p>
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
                  onClick={() => deleteFromFavorites(station.id, station.networkName)}
                  className="favorite-button saved"
                  style={{ backgroundColor: "#ccc", cursor: "pointer" }}
                >
                  Usuń
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FavSpots;
