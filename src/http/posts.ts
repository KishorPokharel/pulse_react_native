import { apiClient } from "./client";

export type Feed = {
  results: {
    id: number;
    content: string;
    createdAt: string;
    author: {
      id: number;
      name: string;
    };
    likesCount: number;
    repliesCount: number;
  }[];
};

export const apiGetFeed = async () => {
  const data = await apiClient.get<Feed>("/feed");
  return data;
};

export const apiGetFollowingFeed = async () => {
  const data = await apiClient.get<Feed>("/feed/following");
  return data;
};

export const apiGetLikedFeed = async () => {
  const data = await apiClient.get<Feed>("/feed/liked");
  return data;
};

export const apiGetSavedFeed = async () => {
  const data = await apiClient.get<Feed>("/feed/saved");
  return data;
};

export const apiCreatePost = async (body: { content: string }) => {
  const data = await apiClient.post<{
    id: number;
    parentPostId: number;
    content: string;
    createdAt: string;
    userId: number;
  }>("/posts", body);
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

export type UserProfilePost = {
  results: {
    id: number;
    userId: number;
    content: string;
    createdAt: string;
    likesCount: number;
    repliesCount: number;
  }[];
};

export const apiGetUserPosts = async (userId: number) => {
  const data = await apiClient.get<UserProfilePost>(`/users/${userId}/posts`);
  return data;
};

export const apiGetPostChildren = async (id: number) => {
  const data = await apiClient.get<{
    results: {
      id: number;
      content: string;
      parentPostId: number;
      userId: number;
      createdAt: string;
      author: {
        id: number;
        name: string;
      };
      likesCount: number;
      repliesCount: number;
    }[];
  }>(`/posts/${id}/children`);
  return data;
};

export const apiLikeUnlikePost = async (postId: number) => {
  const data = await apiClient.post<{ postId: number; liked: boolean }>(
    `/posts/${postId}/like-unlike`,
  );
  return data;
};
