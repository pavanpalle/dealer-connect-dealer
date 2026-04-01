import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Dealer } from '../types';
import { DEALERS } from '../data/mockData';

interface AuthContextType {
  dealer: Dealer | null;
  login: (dealerId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  dealer: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [dealer, setDealer] = useState<Dealer | null>(null);

  const login = (dealerId: string) => {
    const d = DEALERS[dealerId];
    if (d) setDealer(d);
  };

  const logout = () => setDealer(null);

  return (
    <AuthContext.Provider value={{ dealer, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
