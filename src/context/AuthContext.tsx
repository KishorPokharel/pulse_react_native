import * as SecureStore from "expo-secure-store";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { getMe, loginUser } from "../http/auth";
import { apiClient } from "../http/client";

export type User = {
  id: number;
  name: string;
  bio: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  user: User | null;
  likedPostIds: number[];
  login: (input: { email: string; password: string }) => void;
  logout: () => void;
  setLikedPostIds: React.Dispatch<React.SetStateAction<number[]>>;
  setUpdatedUser: (user: { name: string; bio: string }) => void;
};

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isAuthLoading: false,
  user: null,
  likedPostIds: [],
  login: () => {},
  logout: () => {},
  setLikedPostIds: () => {},
  setUpdatedUser: (user: { name: string; bio: string }) => {},
});

const TOKEN_KEY = "PULSE_AUTH_TOKEN_KEY";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [likedPostIds, setLikedPostIds] = useState<number[]>([]);

  useEffect(() => {
    loadAuthUser();
  }, []);

  const loadAuthUser = async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!token) {
        setIsLoggedIn(false);
        setUser(null);
        apiClient.setToken(null);
        return;
      }
      apiClient.setToken(token);
      apiClient.setUnauthorizedHandler(() => {
        logout();
      });
      const user = await getMe();
      setUser({ ...user });
      setLikedPostIds([...user.likedPostIds]);
      setIsLoggedIn(true);
    } catch (e) {
      console.log(e);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const login = async (input: { email: string; password: string }) => {
    const { token } = await loginUser(input);
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await loadAuthUser();
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await loadAuthUser();
  };

  const setUpdatedUser = (input: { name: string; bio: string }) => {
    if (user) {
      const updatedUser: User = {
        ...user,
        name: input.name,
        bio: input.bio,
      };
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        likedPostIds,
        login,
        logout,
        isAuthLoading,
        setLikedPostIds,
        setUpdatedUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useTheme must be used within AuthProvider");
  }

  return context;
};
