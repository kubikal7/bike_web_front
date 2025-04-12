import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../Components/Layout';
import "../Styles/Login.css"

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    role: 'user',
  });

  const token = localStorage.getItem('token');
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8080/auth/register',
        formData,
        {
          headers: {
            'Authorization': token || '', 
          },
        }
      );

      if (response.status === 200) {
        alert('Rejestracja zakończona sukcesem!');
      }
    } catch (error) {
      setError('Błąd rejestracji: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  /*const handleClick = async (e) => {
    console.log(formData);
  }*/

  return (
    <Layout>
      <div className="form-container">
      <h2>Rejestracja</h2>
      {error && <p>{error}</p>}
      <form>
        <label>
          Imię:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Nazwisko:
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Hasło:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <button type="button" onClick={handleClick}>
          Zarejestruj się
        </button>
      </form>
    </div>
    </Layout>
  );
}

export default Register;