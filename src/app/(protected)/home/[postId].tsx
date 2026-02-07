import Avatar from "@/src/components/avatar";
import FullscreenLoader from "@/src/components/fullscreenLoader";
import { apiGetSinglePost } from "@/src/http/posts";
import { formatDate } from "@/src/utils";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";

export default function Screen() {
  const params = useLocalSearchParams<{ postId: string }>();

  return <FullPostView id={+params.postId} />;
}

type FullPostViewProps = {
  id: number;
};

type Post = {
  id: number;
  content: string;
  createdAt: string;
};

export function FullPostView({ id }: FullPostViewProps) {
  const { data, isLoading, isError } = useQuery<Post>({
    queryKey: ["posts", id],
    queryFn: () => apiGetSinglePost(id),
  });

  if (isLoading) {
    return <FullscreenLoader />;
  }

  const post = data!;
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ScrollView>
        <View
          style={{
            padding: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
            }}
          >
            <Avatar name="Kishor" />
            <Text>Kishor Pokharel • {formatDate(post.createdAt)}</Text>
          </View>
          <View
            style={{
              marginBlockStart: 8,
            }}
          >
            <Text>{post.content}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function PostRepliesView() {
  return <View></View>;
}
