import axios from 'axios';

export const checkAdminStatus = async (token) => {
  try {
    const response = await axios.get('http://localhost:8080/auth/isadmin', {
      headers: {
        'Authorization': token,
      },
    });

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};