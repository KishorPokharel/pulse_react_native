import { useQuery } from "@tanstack/react-query";
import { apiGetUserFollowers, apiGetUserFollowing } from "../http/users";

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
