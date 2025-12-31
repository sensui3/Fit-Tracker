import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se já existe um login salvo ao carregar
    const storedAuth = localStorage.getItem('fitTrack_isAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = () => {
    localStorage.setItem('fitTrack_isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('fitTrack_isAuthenticated');
    setIsAuthenticated(false);
  };

  if (loading) {
    return null; // Ou um spinner de loading
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};