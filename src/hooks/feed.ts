import {
  apiGetFollowingFeed,
  apiGetLikedFeed,
  apiGetSavedFeed,
} from "@/src/http/posts";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useFollowingFeed() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["feed", "following"],
    queryFn: async () => {
      const data = await apiGetFollowingFeed();
      const postIds = data.results.map((post) => {
        queryClient.setQueryData(["posts", post.id], post);
        return post.id;
      });
      return postIds;
    },
  });
}

export function useGlobalFeed() {
  return useQuery({
    queryKey: ["feed", "global"],
    queryFn: apiGetFollowingFeed,
  });
}

export function useSavedFeed() {
  return useQuery({
    queryKey: ["feed", "saved"],
    queryFn: apiGetSavedFeed,
  });
}

export function useLikedFeed() {
  return useQuery({
    queryKey: ["feed", "liked"],
    queryFn: apiGetLikedFeed,
  });
}
