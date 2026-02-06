import Avatar from "@/src/components/avatar";
import { useAuth } from "@/src/hooks/useAuth";
import { apiGetFeed } from "@/src/http/posts";
import { useCallback, useEffect, useState } from "react";
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
  const [feed, setFeed] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshingFeed, setRefreshingFeed] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    getFeed();
  }, []);

  const getFeed = async () => {
    try {
      setLoading(true);
      const data = await apiGetFeed<{ results: Post[] }>();
      setFeed(data.results);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedRefresh = useCallback(() => {
    setRefreshingFeed(true);
    getFeed().finally(() => setRefreshingFeed(false));
  }, []);

  return (
    <View style={{ flex: 1, padding: 16, paddingBlockStart: 32 }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        refreshing={refreshingFeed}
        onRefresh={handleFeedRefresh}
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
                {" • "}{" "}
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>

            <Text style={{ fontSize: 18, marginBlockStart: 10 }}>
              {post.content}
            </Text>

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

      {/* {feed.map((post) => {
        return (
          <View
            key={post.id}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "#b3b3b3",
              paddingBlock: 12,
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
                {" • "}{" "}
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>

            <Text style={{ fontSize: 20, marginBlockStart: 10 }}>{post.content}</Text>

            <View
              style={{
                flexDirection: "row",
                gap: 12,
                paddingBlock: 4,
              }}
            >
              <Text>200 Likes</Text>
              <Text>300 Comments</Text>
            </View>
          </View>
        );
      })} */}
    </View>
  );
}
