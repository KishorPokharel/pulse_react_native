import FullscreenLoader from "@/src/components/fullscreenLoader";
import PostCard from "@/src/components/postCard";
import { useTheme } from "@/src/context/ThemeContext";
import { useFollowingFeed } from "@/src/hooks/feed";
import { usePostLikeUnlike } from "@/src/hooks/posts";
import { FlatList, Text, View } from "react-native";

export default function Screen() {
  const { theme } = useTheme();
  const { data, isLoading, isRefetching, refetch } = useFollowingFeed();

  const likeUnlikeMutation = usePostLikeUnlike();

  if (isLoading) {
    return <FullscreenLoader />;
  }

  const postIds = data || [];
  if (postIds.length === 0) {
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
        onRefresh={refetch}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: "#e9e9e97c" }} />
        )}
        data={postIds}
        renderItem={({ item: postId }) => (
          <View
            style={{
              paddingBlock: 12,
            }}
          >
            <PostCard
              postId={postId}
              likeBtnDisabled={
                likeUnlikeMutation.isPending &&
                likeUnlikeMutation.variables.postId === postId
              }
              onLikeTap={() => likeUnlikeMutation.mutate({ postId: postId })}
            />
          </View>
        )}
        keyExtractor={(postId) => `following-feed-post-${postId}`}
      />
    </View>
  );
}
