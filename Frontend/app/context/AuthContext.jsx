import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isRestoring, setIsRestoring] = useState(true);

  // Restore a persisted session on app start.
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem('token'),
          AsyncStorage.getItem('userData'),
        ]);
        if (storedToken) {
          setToken(storedToken);
          setUser(storedUser ? JSON.parse(storedUser) : null);
        }
      } catch (error) {
        console.log('Error restoring session:', error);
      } finally {
        setIsRestoring(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser || null);
    await AsyncStorage.setItem('token', newToken);
    if (newUser) {
      await AsyncStorage.setItem('userData', JSON.stringify(newUser));
    }
    if (newUser?.email || newUser?.emailOrPhone) {
      await AsyncStorage.setItem('lastLoginEmail', newUser.email || newUser.emailOrPhone);
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.multiRemove(['token', 'userData', 'lastLoginEmail']);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isRestoring,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
