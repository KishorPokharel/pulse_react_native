import { useAuth } from "@/src/hooks/useAuth";
import { apiGetFeed } from "@/src/http/posts";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

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
  const { user, logout } = useAuth();
  useEffect(() => {
    const getFeed = async (token: string) => {
      const data = await apiGetFeed(token);
      setFeed(data.results);
      console.log(data);
    };
    getFeed(user?.token!);
  }, [user?.token]);

  return (
    <View style={{ flex: 1, paddingBlock: 32, paddingInline: 16 }}>
      {feed.map((post) => {
        return (
          <View key={post.id}>
            <Text style={{ fontSize: 14 }}>{post.author.name}</Text>
            <Text style={{ fontSize: 20 }}>{post.content}</Text>
            <Text style={{ fontSize: 10 }}>{post.createdAt}</Text>
          </View>
        );
      })}
    </View>
  );
}
