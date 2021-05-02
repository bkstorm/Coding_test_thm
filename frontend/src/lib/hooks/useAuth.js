import { useState } from 'react';
import jwt from 'jsonwebtoken';
import axios from '../../tools/api';

const useAuth = () => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    return token && jwt.decode(token);
  });

  const login = (email, password) => axios
    .post(`${process.env.REACT_APP_API_URL}/login`, {
      email,
      password,
    })
    .then((response) => {
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
    });

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return {
    user,
    login,
    logout,
  };
};

export default useAuth;
