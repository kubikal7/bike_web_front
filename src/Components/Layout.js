import React, { useEffect, useState } from 'react';
import '../Styles/Layout.css'; // Importowanie pliku CSS
import { useNavigate, Link } from 'react-router-dom';
import { checkAdminStatus } from '../Scripts/checkAdmin';

function Layout({ children }) {
    const navigate = useNavigate(); // Hook do nawigacji
  
    // Funkcja do wylogowania (czyszczenie tokenu z localStorage)
    const handleLogout = () => {
      localStorage.removeItem('token'); // Usuwamy token
      navigate('/'); // Programowo przekierowujemy na stronę główną
    };

    // Sprawdzamy, czy token jest zapisany w localStorage
    const token = localStorage.getItem('token');

  const [isAdmin, setIsAdmin] = useState(null);
  useEffect(() => {
    if(!token) return;
    (async () => {
      setIsAdmin(await checkAdminStatus(token) ? true : false);
    })();
  }, [token]);

  return (
    <div className="layout-container">
      <header className="layout-header">
        <h1>Znajdź swój rower</h1>
      </header>
      <nav className="layout-nav">
        <ul>
          <li><Link to="/">Strona główna</Link></li>
          {token && (
            <>
                <li><Link to="/user">Profil</Link></li>
                <li><button onClick={handleLogout}>Wyloguj się</button></li>
            </>
          )}
          {!token && (
            <>
                <li><Link to="/login">Zaloguj się</Link></li>
                <li><Link to="/register">Zarejestruj się</Link></li>
            </>
          )}
          {isAdmin && (
            <li><Link to="/admin">Administrator</Link></li>
          )}
        </ul>
      </nav>
      <main className="layout-main">
        {children}
      </main>
      <footer className="layout-footer">
        <p>© 2025 BikeWeb. Wszystkie prawa zastrzeżone.</p>
      </footer>
    </div>
  );
}

export default Layout;