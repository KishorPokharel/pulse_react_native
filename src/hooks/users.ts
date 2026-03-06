import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGetUserPosts } from "../http/posts";
import {
  apiFollowUser,
  apiGetUserFollowers,
  apiGetUserFollowing,
  apiGetUserProfile,
  apiUnfollowUser,
} from "../http/users";

export function useUserProfile(userId: number) {
  return useQuery({
    queryKey: ["users", userId],
    queryFn: () => apiGetUserProfile(userId),
  });
}

export function useUserPosts(userId: number) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["users", userId, "posts"],
    queryFn: async () => {
      const data = await apiGetUserPosts(userId);
      const postIds = data.results.map((post) => {
        queryClient.setQueryData(["posts", post.id], post);
        return post.id;
      });
      return postIds;
    },
  });
}

export function useFollowers(userId: number) {
  return useQuery({
    queryKey: ["users", userId, "followers"],
    queryFn: () => apiGetUserFollowers(userId),
  });
}

export function useFollowing(userId: number) {
  return useQuery({
    queryKey: ["users", userId, "following"],
    queryFn: () => apiGetUserFollowing(userId),
  });
}

export function useFollowUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiFollowUser,
    onSuccess: (data, userId) => {
      queryClient.invalidateQueries({ queryKey: ["users", userId] });
    },
    onError: () => {
      alert("Failed to follow");
    },
  });
}

export function useUnfollowUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiUnfollowUser,
    onSuccess: (data, userId) => {
      queryClient.invalidateQueries({ queryKey: ["users", userId] });
    },
    onError: () => {
      alert("Failed to unfollow");
    },
  });
}
