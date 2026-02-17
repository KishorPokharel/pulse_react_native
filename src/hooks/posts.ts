import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { useAuth } from "../context/AuthContext";
import {
  apiCreateReply,
  apiGetPostChildren,
  apiGetSinglePost,
  apiLikeUnlikePost,
  FeedResponse,
  PostRepliesResponse,
  PostResponse,
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
  const { user } = useAuth();
  const authUser = user!;

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiCreateReply,
    onSuccess: (data, variables) => {
      // Update replies
      queryClient.setQueryData<PostRepliesResponse>(
        ["posts", variables.parentPostId, "children"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            results: [
              {
                ...data,
                author: { id: authUser.id, name: authUser.name },
                likesCount: 0,
                repliesCount: 0,
              },
              ...old.results,
            ],
          };
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

      // Update in feed
      queryClient.setQueryData<FeedResponse>(["feed", "following"], (old) => {
        if (!old) return old;
        return {
          ...old,
          results: old.results.map((post) =>
            post.id === variables.parentPostId
              ? {
                  ...post,
                  repliesCount: post.repliesCount + 1,
                }
              : post,
          ),
        };
      });

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
    mutationFn: ({ postId }: { postId: number; parentPostId?: number }) => {
      return apiLikeUnlikePost(postId);
    },
    onSuccess: (data, variables) => {
      if (data.liked) {
        setLikedPostIds([...likedPostIds, data.postId]);
      } else {
        setLikedPostIds((prev) => prev.filter((id) => id !== data.postId));
      }

      // Update in feed
      queryClient.setQueryData<FeedResponse>(["feed", "following"], (old) => {
        if (!old) return old;
        return {
          ...old,
          results: old.results.map((post) =>
            post.id === data.postId
              ? {
                  ...post,
                  likesCount: data.liked
                    ? post.likesCount + 1
                    : post.likesCount - 1,
                }
              : post,
          ),
        };
      });

      // Update single post
      queryClient.setQueryData<PostResponse>(["posts", data.postId], (old) => {
        if (!old) return old;
        return {
          ...old,
          likesCount: data.liked ? old.likesCount + 1 : old.likesCount - 1,
        };
      });

      // Update replies view
      if (variables.parentPostId) {
        queryClient.setQueryData<PostRepliesResponse>(
          ["posts", variables.parentPostId, "children"],
          (old) => {
            console.log(old);
            if (!old) return old;
            return {
              ...old,
              results: old.results.map((post) =>
                post.id === data.postId
                  ? {
                      ...post,
                      likesCount: data.liked
                        ? post.likesCount + 1
                        : post.likesCount - 1,
                    }
                  : post,
              ),
            };
          },
        );
      }
    },
    onError: () => {
      Alert.alert("Something went wrong.");
    },
  });
}
