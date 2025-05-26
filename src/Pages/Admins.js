import React, { useState } from "react";
import axios from "axios";
import LayoutAdmin from "../Components/LayoutAdmin";
import "../Styles/User.css";

function Admins() {
  const [adminData, setAdminData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token") || "";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAdmin = async () => {
    if (!token) {
      alert("Musisz być zalogowany jako administrator.");
      return;
    }

    if (!adminData.email || !adminData.password || !adminData.name || !adminData.surname) {
      setError("Wszystkie pola są wymagane.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/register",
        {
          ...adminData,
          role: "admin",
        },
        {
          headers: { Authorization: token },
        }
      );

      setSuccessMessage("Administrator dodany pomyślnie.");
      setError("");
      setAdminData({
        name: "",
        surname: "",
        email: "",
        password: "",
        role: "admin",
      });
    } catch (err) {
      console.error("Błąd dodawania administratora:", err);
      if (err.response?.status === 409) {
        setError("Użytkownik o tym e-mailu już istnieje.");
      } else if (err.response?.status === 401) {
        setError("Brak uprawnień do dodawania administratorów.");
      } else {
        setError("Wystąpił błąd podczas rejestracji administratora.");
      }
      setSuccessMessage("");
    }
  };

  return (
    <LayoutAdmin>
      <div className="user-info-container">
        <h1>Dodaj administratora</h1>
        <label>
          Imię:
          <input
            type="text"
            name="name"
            value={adminData.name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Nazwisko:
          <input
            type="text"
            name="surname"
            value={adminData.surname}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={adminData.email}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Hasło:
          <input
            type="password"
            name="password"
            value={adminData.password}
            onChange={handleInputChange}
          />
        </label>
        <button onClick={handleAddAdmin}>Dodaj administratora</button>

        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </LayoutAdmin>
  );
}

export default Admins;
