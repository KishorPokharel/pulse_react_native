import FullscreenLoader from "@/src/components/fullscreenLoader";
import PostCard from "@/src/components/postCard";
import { apiGetFeed } from "@/src/http/posts";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert, FlatList, View } from "react-native";

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

  const { data, isLoading, isRefetching, refetch } = useQuery<{
    results: Post[];
  }>({ queryKey: ["feed"], queryFn: apiGetFeed });

  if (isLoading) {
    return <FullscreenLoader />;
  }

  const feed = data?.results || [];
  return (
    <View style={{ flex: 1, paddingInline: 16, backgroundColor: "white" }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        refreshing={isRefetching}
        onRefresh={refetch}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: "#e0e0e0" }} />
        )}
        data={feed}
        renderItem={({ item: post }) => (
          <View
            style={{
              paddingBlock: 16,
            }}
          >
            <PostCard
              post={{
                name: post.author.name,
                content: post.content,
                createdAt: post.createdAt,
                isLiked: false,
                numberOfLikes: 12,
                numberOfComments: 12,
              }}
              onLikeTap={() => {
                Alert.alert("Not implemented");
              }}
              onShowMore={() => {
                router.push({
                  pathname: "/home/[postId]",
                  params: { postId: post.id },
                });
              }}
              onProfileClick={() => {
                Alert.alert("Not implemented");
              }}
            />
          </View>
        )}
        keyExtractor={(post) => post.id + ""}
      />
    </View>
  );
}
