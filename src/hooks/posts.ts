import { useQuery } from "@tanstack/react-query";
import { apiGetPostChildren, apiGetSinglePost } from "../http/posts";

export function usePost(postId: number) {
  return useQuery({
    queryKey: ["posts", postId],
    queryFn: () => apiGetSinglePost(postId),
  });
}

export function usePostReplies(postId: number) {
  return useQuery({
    queryKey: ["posts", postId, "children"],
    queryFn: () => apiGetPostChildren(postId),
  });
}
