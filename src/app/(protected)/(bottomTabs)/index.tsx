import FullscreenLoader from "@/src/components/fullscreenLoader";
import PostCard from "@/src/components/postCard";
import { useAuth } from "@/src/context/AuthContext";
import { useTheme } from "@/src/context/ThemeContext";
import { useFollowingFeed } from "@/src/hooks/feed";
import { usePostLikeUnlike } from "@/src/hooks/posts";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

export default function Screen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { likedPostIds } = useAuth();

  const queryClient = useQueryClient();
  const {
    data,
    isLoading,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFollowingFeed();

  const handleRefresh = async () => {
    await queryClient.resetQueries({
      queryKey: ["feed", "following"],
    });
  };

  const likeUnlikeMutation = usePostLikeUnlike();

  if (isLoading) {
    return <FullscreenLoader />;
  }

  const feed = data?.pages.flatMap((page) => page.results) ?? [];

  if (feed.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        }}
      >
        <Text style={{ color: theme.text }}>Nothing to see here yet.</Text>
      </View>
    );
  }

  return (
    <View
      style={{ flex: 1, paddingInline: 16, backgroundColor: theme.background }}
    >
      <FlatList
        showsVerticalScrollIndicator={false}
        refreshing={isRefetching}
        onRefresh={handleRefresh}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
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
                parentPostId: null,
                content: post.content,
                createdAt: post.createdAt,
                isLiked: likedPostIds.includes(post.id),
                numberOfLikes: post.likesCount,
                numberOfComments: post.repliesCount,
              }}
              likeBtnDisabled={
                likeUnlikeMutation.isPending &&
                likeUnlikeMutation.variables.postId === post.id
              }
              onLikeTap={() => likeUnlikeMutation.mutate({ postId: post.id })}
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
        ListFooterComponent={
          isFetchingNextPage ? (
            <View
              style={{
                paddingVertical: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" />
            </View>
          ) : null
        }
        keyExtractor={(post) => post.id + ""}
      />
    </View>
  );
}
