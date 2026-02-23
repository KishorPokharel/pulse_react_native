import {
  apiGetFollowingFeed,
  apiGetLikedFeed,
  apiGetSavedFeed,
} from "@/src/http/posts";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export function useFollowingFeed() {
  return useInfiniteQuery({
    queryKey: ["feed", "following"],
    queryFn: ({ pageParam }) => apiGetFollowingFeed(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
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
