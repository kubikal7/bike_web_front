import React, { useState } from "react";
import axios from "axios";
import LayoutAdmin from "../Components/LayoutAdmin";
import "../Styles/User.css";

function Users() {
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    surname: "",
    email: "",
  });
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token") || "";

  const handleSearch = async () => {
    if (!token) {
      alert("Musisz być zalogowany.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/user/find-by-email/${email}`,
        {
          headers: { Authorization: token },
        }
      );
      setUserData(response.data);
      setEditData({
        name: response.data.name,
        surname: response.data.surname,
        email: response.data.email,
      });
      setError(null);
    } catch (err) {
      console.error("Błąd pobierania użytkownika:", err);
      setError("Nie znaleziono użytkownika.");
      setUserData(null);
    }
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(
        `http://localhost:8080/user/modify/${userData.id}`,
        editData,
        { headers: { Authorization: token } }
      );
      alert("Zmiany zapisane!");
      setUserData({ ...userData, ...editData });
      setEditMode(false);
    } catch (err) {
      console.error("Błąd zapisu:", err);
      alert("Nie udało się zapisać zmian.");
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm("Czy na pewno chcesz usunąć tego użytkownika?")) return;

    try {
      await axios.delete(`http://localhost:8080/user/delete/${userData.id}`, {
        headers: { Authorization: token },
      });
      alert("Użytkownik usunięty.");
      setUserData(null);
      setEmail("");
    } catch (err) {
      console.error("Błąd usuwania:", err);
      alert("Nie udało się usunąć użytkownika.");
    }
  };

  return (
    <LayoutAdmin>
      <div className="user-info-container">
        <h1>Wyszukaj użytkownika</h1>
        <input
          type="email"
          placeholder="Wprowadź email użytkownika"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSearch}>Szukaj</button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {userData && (
          <>
            <h2>Dane użytkownika</h2>
            {editMode ? (
              <div>
                <label>
                  Imię:
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Nazwisko:
                  <input
                    type="text"
                    name="surname"
                    value={editData.surname}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleInputChange}
                  />
                </label>
                <button onClick={handleSaveChanges}>Zapisz zmiany</button>
                <button onClick={handleEditToggle}>Anuluj</button>
              </div>
            ) : (
              <div>
                <p><strong>Imię:</strong> {userData.name}</p>
                <p><strong>Nazwisko:</strong> {userData.surname}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <button onClick={handleEditToggle}>Edytuj dane</button>
                <button onClick={handleDeleteUser} style={{ marginLeft: "10px", backgroundColor: "#d9534f", color: "white" }}>
                  Usuń użytkownika
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </LayoutAdmin>
  );
}

export default Users;
