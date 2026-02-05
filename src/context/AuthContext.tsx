import * as SecureStore from "expo-secure-store";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

type AuthState = {
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  login: () => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  isAuthLoading: false,
  login: () => {},
  logout: () => {},
});

const sleep = async (ms = 0) => new Promise((res) => setTimeout(res, ms));

const TOKEN_KEY = "PULSE_AUTH_TOKEN_KEY";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      // TODO: check backend with the token
      await sleep(1000);
      if (token === "true") {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const login = async () => {
    await SecureStore.setItemAsync(TOKEN_KEY, "true");
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, isAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
