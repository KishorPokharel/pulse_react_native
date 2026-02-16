import {
  apiGetFollowingFeed,
  apiGetLikedFeed,
  apiGetSavedFeed,
} from "@/src/http/posts";
import { useQuery } from "@tanstack/react-query";

export function useFollowingFeed() {
  return useQuery({
    queryKey: ["feed", "following"],
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
