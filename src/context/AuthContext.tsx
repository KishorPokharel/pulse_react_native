import * as SecureStore from "expo-secure-store";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { getUser, loginUser } from "../http/auth";

type User = {
  id: number;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  token: string;
};

type AuthState = {
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  isAuthLoading: false,
  user: null,
  login: () => {},
  logout: () => {},
});

const TOKEN_KEY = "PULSE_AUTH_TOKEN_KEY";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadAuthUser();
  }, []);

  const loadAuthUser = async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!token) {
        setIsLoggedIn(false);
        setUser(null);
        return;
      }
      const user = await getUser(token);
      setUser({ ...user, token });
      setIsLoggedIn(true);
    } catch (e) {
      console.log(e);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const login = async () => {
    try {
      const { token } = await loginUser({
        email: "kishor@example.com",
        password: "kishor@1234",
      });
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await loadAuthUser();
    } catch (e) {
      console.log(e);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await loadAuthUser();
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, login, logout, isAuthLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
