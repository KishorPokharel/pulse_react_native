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

export const getUser = async () => {
  const data = await apiClient.get<User>("/me");
  return data;
};
