import { User } from "../context/AuthContext";
import { apiClient } from "./client";

type LoginBody = {
  email: string;
  password: string;
};

export const loginUser = async (body: LoginBody) => {
  const data = await apiClient.post<{ token: string }>("/login", body);
  return data;
};

export const apiRegisterUser = async (body: unknown) => {
  const data = await apiClient.post("/register", body);
  return data;
};

export const getUser = async () => {
  const data = await apiClient.get<User>("/me");
  return data;
};

export const apiSearchUsers = async (name: string) => {
  const params = new URLSearchParams({
    search: name,
  });
  const data = await apiClient.get<{
    results: { id: number; name: string; bio: string }[];
  }>(`/users?${params}`);
  return data;
};
