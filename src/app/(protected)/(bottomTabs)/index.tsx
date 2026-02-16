import FullscreenLoader from "@/src/components/fullscreenLoader";
import PostCard from "@/src/components/postCard";
import { useAuth } from "@/src/context/AuthContext";
import { useTheme } from "@/src/context/ThemeContext";
import { useFollowingFeed } from "@/src/hooks/feed";
import { apiLikeUnlikePost, Feed } from "@/src/http/posts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { FlatList, View } from "react-native";

type Post = {
  author: {
    id: number;
    name: string;
  };
  id: number;
  content: string;
  createdAt: string;
  liked: boolean;
};

export default function Screen() {
  const router = useRouter();
  const { theme } = useTheme();

  const { likedPostIds, setLikedPostIds } = useAuth();

  const {
    data: feedData,
    isLoading,
    isRefetching,
    refetch,
  } = useFollowingFeed();

  const queryClient = useQueryClient();
  const tapLikeMutation = useMutation({
    mutationFn: apiLikeUnlikePost,
    onSuccess: (data) => {
      if (data.liked) {
        setLikedPostIds([...likedPostIds, data.postId]);
      } else {
        setLikedPostIds((prev) => prev.filter((id) => id !== data.postId));
      }
      queryClient.setQueryData<Feed>(["feed"], (old) => {
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
    },
    onError: () => {
      alert("Something went wrong");
    },
  });

  const handleLikeTap = (postId: number) => {
    tapLikeMutation.mutate(postId);
  };

  if (isLoading) {
    return <FullscreenLoader />;
  }

  const feed = feedData?.results || [];
  return (
    <View
      style={{ flex: 1, paddingInline: 16, backgroundColor: theme.background }}
    >
      <FlatList
        showsVerticalScrollIndicator={false}
        refreshing={isRefetching}
        onRefresh={refetch}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: "#e9e9e97c" }} />
        )}
        data={feed}
        renderItem={({ item: post }) => (
          <View
            style={{
              paddingBlock: 12,
            }}
          >
            <PostCard
              post={{
                id: post.id,
                author: {
                  id: post.author.id,
                  name: post.author.name,
                },
                content: post.content,
                createdAt: post.createdAt,
                isLiked: likedPostIds.includes(post.id),
                numberOfLikes: post.likesCount,
                numberOfComments: post.repliesCount,
              }}
              onLikeTap={() => handleLikeTap(post.id)}
              onShowMore={() => {
                router.push({
                  pathname: "/post/[postId]",
                  params: { postId: post.id },
                });
              }}
              onProfileClick={() => {
                router.push({
                  pathname: "/user/[userId]",
                  params: { userId: post.author.id },
                });
              }}
            />
          </View>
        )}
        keyExtractor={(post) => post.id + ""}
      />
    </View>
  );
}
