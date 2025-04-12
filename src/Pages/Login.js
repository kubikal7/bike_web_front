import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../Components/Layout';
import { useNavigate } from 'react-router-dom';
import "../Styles/Login.css"

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const credentials = {
        email: email,
        password: password,
      };

      const response = await axios.put('http://localhost:8080/auth/login', credentials);

      if (response.status === 200) {
        const token = response.data;
        if (token) {
          localStorage.setItem('token', token);
          navigate('/')
        } else {
          alert('Nie otrzymano tokenu!');
        }
      } else {
        alert('Błąd logowania');
      }
    } catch (error) {
      console.error('Błąd logowania:', error);
      alert('Błąd logowania');
    }
  };

  return (
    <Layout>
      <div className="form-container">
      <h2>Logowanie</h2>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Wprowadź email"
        />
      </div>
      <div>
        <label htmlFor="password">Hasło</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Wprowadź hasło"
        />
      </div>
      <button onClick={handleLogin}>Zaloguj się</button>
    </div>
    </Layout>
  );
}

export default Login;