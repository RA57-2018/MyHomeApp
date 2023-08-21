import React, { createContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';

import { usersApi } from '@/services';
import { CurrentUser } from '@/types';

const initialContext: {
  currentUser: CurrentUser;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
} = {
  currentUser: null,
  login: () => Promise.resolve(),
  logout: () => void 0
};

export const UserContext = createContext(initialContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const tokenRef = useRef<string | null>();
  tokenRef.current = localStorage['accessToken'];
  const [loggedIn, setLoggedIn] = useState<boolean>(!!tokenRef.current);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const isTokenFresh = (jwtToken: string): boolean => {
    const decodedToken = window.atob(jwtToken.split('.')[1]);
    return JSON.parse(decodedToken).exp * 1000 > Date.now();
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const initialCurrentUser = storedUser ? JSON.parse(storedUser) : null;
    setCurrentUser(initialCurrentUser);
  }, []);

  useEffect(() => {
    axios.interceptors.request.use(
      async (config) => {
        if (tokenRef.current && config && config.headers) {
          // Refresh token if it has expired
          if (!isTokenFresh(tokenRef.current)) {
            const refreshToken = localStorage['refreshToken'];
            if (!isTokenFresh(refreshToken)) {
              logout();
              return;
            }
            tokenRef.current = null;
            const res = await usersApi.refreshToken(refreshToken);
            localStorage['accessToken'] = tokenRef.current = res.data.access;
          }
          config.headers.Authorization = `Bearer ${tokenRef.current}`;
        }
        return config;
      },
      (err) => Promise.reject(err)
    );
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await usersApi.token(email, password);
      const { access, refresh, user } = res.data.value;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('currentUser', JSON.stringify(user));
      tokenRef.current = access;
      setCurrentUser(user);
      setLoggedIn(true);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    tokenRef.current = null;
    setCurrentUser(null);
    setLoggedIn(false);
  };

  return (
    <UserContext.Provider value={{ currentUser, login, logout }}>
      {(!loggedIn || currentUser) && children}
    </UserContext.Provider>
  );
};