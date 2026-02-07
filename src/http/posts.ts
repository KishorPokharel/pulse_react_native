import { apiClient } from "./client";

export const apiGetFeed = async <T>() => {
  const data = await apiClient.get<T>("/feed");
  return data;
};

export const apiCreatePost = async (body: { content: string }) => {
  const data = await apiClient.post("/posts", body);
  return data;
};

export const apiGetSinglePost = async <T>(id: number) => {
  const data = await apiClient.get<T>("/posts/" + id);
  return data;
};

export const apiGetPostChildren = async (id: number) => {
  const data = await apiClient.get(`/posts/${id}/children`);
  return data;
};
