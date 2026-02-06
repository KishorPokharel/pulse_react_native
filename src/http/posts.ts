import { apiClient } from "./client";

export const apiGetFeed = async (token: string) => {
  const data = await apiClient.get("/feed");
  return data;
};
