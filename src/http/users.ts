import { apiClient } from "./client";

export const apiGetUserProfile = async (userId: number) => {
  const data = await apiClient.get<{
    id: number;
    name: string;
    bio: string;
    email: string;
    createdAt: string;
    followersCount: number;
    followingCount: number;
  }>("/users/" + userId);
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

export const apiFollowUser = async (userId: number) => {
  const data = await apiClient.post(`/users/${userId}/follow`);
  return data;
};

export const apiUnfollowUser = async (userId: number) => {
  const data = await apiClient.post(`/users/${userId}/unfollow`);
  return data;
};
