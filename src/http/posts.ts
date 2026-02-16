import { apiClient } from "./client";

export type FeedResponse = {
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

export type FollowingFeedResponse = FeedResponse;
export type LikedFeedResponse = FeedResponse;
export type SavedFeedResponse = FeedResponse;

export const apiGetFollowingFeed = async () => {
  const data = await apiClient.get<FollowingFeedResponse>("/feed/following");
  return data;
};

export const apiGetLikedFeed = async () => {
  const data = await apiClient.get<LikedFeedResponse>("/feed/liked");
  return data;
};

export const apiGetSavedFeed = async () => {
  const data = await apiClient.get<SavedFeedResponse>("/feed/saved");
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

type PostResponse = {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    name: string;
  };
  likesCount: number;
  repliesCount: number;
};

export const apiGetSinglePost = async (id: number) => {
  const data = await apiClient.get<PostResponse>("/posts/" + id);
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
