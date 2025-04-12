import axios from 'axios';

/**
 * Funkcja sprawdzająca, czy użytkownik jest administratorem.
 * @param {string} token - Token użytkownika do autoryzacji.
 * @returns {Promise<boolean>} - Zwraca true, jeśli użytkownik jest administratorem, w przeciwnym razie false.
 */
export const checkAdminStatus = async (token) => {
  try {
    const response = await axios.get('http://localhost:8080/auth/isadmin', {
      headers: {
        'Authorization': token,
      },
    });

    if (response.status === 200) {
      return true; // Administrator
    } else {
      return false; // Niedozwolony dostęp
    }
  } catch (error) {
    // Jeśli wystąpił błąd, zwracamy false (brak dostępu lub błąd połączenia)
    return false;
  }
};