import axios from 'axios';

export const checkAdminStatus = async (token) => {
  try {
    const response = await axios.get('http://localhost:8080/auth/isadmin', {
      headers: { Authorization: token },
    });
    return response.data === true;
  } catch (error) {
    return false;
  }
};