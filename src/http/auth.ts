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

export const getMe = async () => {
  const data = await apiClient.get<{
    id: number;
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    likedPostIds: number[];
  }>("/me");
  return data;
};
