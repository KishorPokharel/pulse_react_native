import { apiClient } from "./client";

export const apiGetFeed = async (token: string) => {
  const data = await apiClient.get("/feed");
  return data;
};

export const apiCreatePost = async (body: unknown) => {
  const data = await apiClient.post("/posts", body);
  return data;
}