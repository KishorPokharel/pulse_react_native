import { apiClient } from "./client";

export const apiGetFeed = async <T>() => {
  const data = await apiClient.get<T>("/feed");
  return data;
};

export const apiCreatePost = async (body: { content: string }) => {
  const data = await apiClient.post("/posts", body);
  return data;
};

export const apiCreateReply = async (body: {
  content: string;
  parentPostId: number;
}) => {
  const data = await apiClient.post("/posts", body);
  return data;
};

export const apiGetSinglePost = async <T>(id: number) => {
  const data = await apiClient.get<T>("/posts/" + id);
  return data;
};

export const apiGetPostChildren = async <T>(id: number) => {
  const data = await apiClient.get<T>(`/posts/${id}/children`);
  return data;
};

export const apiLikeUnlikePost = async (postId: number) => {
  const data = await apiClient.post(`/posts/${postId}/like-unlike`);
  return data;
};
