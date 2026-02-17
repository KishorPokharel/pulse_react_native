import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import {
  apiCreateReply,
  apiGetPostChildren,
  apiGetSinglePost,
} from "../http/posts";

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

export function useCreateReply(options?: {
  onSuccess?: () => void;
  onError?: () => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiCreateReply,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["posts", variables.parentPostId],
      });
      options?.onSuccess?.();
    },
    onError: () => {
      Alert.alert("Failed to create reply.");
      options?.onError?.();
    },
  });
}
