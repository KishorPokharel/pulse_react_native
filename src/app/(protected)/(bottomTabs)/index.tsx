import FullscreenLoader from "@/src/components/fullscreenLoader";
import PostCard from "@/src/components/postCard";
import { useAuth } from "@/src/context/AuthContext";
import { useTheme } from "@/src/context/ThemeContext";
import { useFollowingFeed } from "@/src/hooks/feed";
import { usePostLikeUnlike } from "@/src/hooks/posts";
import { useRouter } from "expo-router";
import { FlatList, View } from "react-native";

export default function Screen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { likedPostIds } = useAuth();

  const {
    data: feedData,
    isLoading,
    isRefetching,
    refetch,
  } = useFollowingFeed();

  const likeUnlikeMutation = usePostLikeUnlike();

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
        keyExtractor={(post) => post.id + ""}
      />
    </View>
  );
}
