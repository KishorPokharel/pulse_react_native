import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { useAuth } from "../context/AuthContext";
import {
  apiCreateReply,
  apiDeletePost,
  apiGetPostChildren,
  apiGetSinglePost,
  apiLikeUnlikePost,
  PostResponse,
} from "../http/posts";

export function usePost(postId: number) {
  return useQuery({
    queryKey: ["posts", postId],
    queryFn: () => apiGetSinglePost(postId),
    staleTime: Infinity,
  });
}

export function usePostReplies(postId: number) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["posts", postId, "children"],
    queryFn: async () => {
      const data = await apiGetPostChildren(postId);
      const postIds = data.results.map((post) => {
        queryClient.setQueryData(["posts", post.id], post);
        return post.id;
      });
      return postIds;
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId }: { postId: number; parentPostId: number | null }) =>
      apiDeletePost(postId),
    onSuccess: (data, variables) => {
      queryClient.setQueryData<number[]>(["feed", "following"], (old) => {
        if (!old) return old;
        return old.filter((oldId) => oldId != variables.postId);
      });

      if (variables.parentPostId) {
        queryClient.invalidateQueries({
          queryKey: ["posts", variables.parentPostId],
        });
      }
    },
    onError: () => {
      Alert.alert("Failed to delete post.");
    },
  });
}

export function useCreateReply(options?: {
  onSuccess?: () => void;
  onError?: () => void;
}) {
  const { user } = useAuth();
  const authUser = user!;

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiCreateReply,
    onSuccess: (data, variables) => {
      // Add new post
      queryClient.setQueryData(["posts", data.id], data);

      // Update replies
      queryClient.setQueryData<number[]>(
        ["posts", variables.parentPostId, "children"],
        (old) => {
          if (!old) return old;
          return [data.id, ...old];
        },
      );

      // Update replies count
      queryClient.setQueryData<PostResponse>(
        ["posts", variables.parentPostId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            repliesCount: old.repliesCount + 1,
          };
        },
      );

      options?.onSuccess?.();
    },
    onError: () => {
      Alert.alert("Failed to create reply.");
      options?.onError?.();
    },
  });
}

export function usePostLikeUnlike() {
  const queryClient = useQueryClient();
  const { likedPostIds, setLikedPostIds } = useAuth();

  return useMutation({
    mutationFn: ({
      postId,
    }: {
      postId: number;
      parentPostId?: number;
      authorId?: number;
    }) => {
      return apiLikeUnlikePost(postId);
    },
    onSuccess: (data, variables) => {
      if (data.liked) {
        setLikedPostIds([...likedPostIds, data.postId]);
      } else {
        setLikedPostIds((prev) => prev.filter((id) => id !== data.postId));
      }

      // Update post
      queryClient.setQueryData<PostResponse>(["posts", data.postId], (old) => {
        if (!old) return old;
        return {
          ...old,
          likesCount: data.liked ? old.likesCount + 1 : old.likesCount - 1,
        };
      });
    },
    onError: () => {
      Alert.alert("Something went wrong.");
    },
  });
}
