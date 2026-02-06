import { apiClient } from "./client";

export const apiGetFeed = async <T>() => {
  const data = await apiClient.get<T>("/feed");
  return data;
};

export const apiCreatePost = async <T>(body: unknown) => {
  const data = await apiClient.post<T>("/posts", body);
  return data;
};
