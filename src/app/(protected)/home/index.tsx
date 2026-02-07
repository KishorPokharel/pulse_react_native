import Avatar from "@/src/components/avatar";
import FullscreenLoader from "@/src/components/fullscreenLoader";
import { apiGetFeed } from "@/src/http/posts";
import { formatDate } from "@/src/utils";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert, FlatList, Pressable, Text, View } from "react-native";

type Post = {
  author: {
    id: number;
    name: string;
  };
  id: number;
  content: string;
  createdAt: string;
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
    <View style={{ flex: 1, paddingInline: 16, paddingBlockStart: 32 }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        refreshing={isRefetching}
        onRefresh={refetch}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: "#b3b3b3" }} />
        )}
        data={feed}
        renderItem={({ item: post }) => (
          <View
            style={{
              paddingBlock: 16,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Pressable
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                onPress={() => {
                  Alert.alert("No page right now.");
                }}
              >
                <Avatar name={post.author.name} />
                <Text style={{ fontSize: 16 }}>{post.author.name}</Text>
              </Pressable>
              <Text style={{ fontSize: 12 }}>
                {" • "}
                {formatDate(post.createdAt)}
              </Text>
            </View>

            <Pressable
              onPress={() => {
                router.push({ pathname: "/home/[postId]", params: { postId: post.id } });
              }}
            >
              <Text style={{ fontSize: 18, marginBlockStart: 10 }}>
                {post.content.length > 250 ? "..." : post.content}
              </Text>
            </Pressable>

            <View
              style={{
                flexDirection: "row",
                gap: 12,
                paddingBlockStart: 10,
              }}
            >
              <Text>200 Likes</Text>
              <Text>300 Comments</Text>
            </View>
          </View>
        )}
        keyExtractor={(post) => post.id + ""}
      />
    </View>
  );
}
