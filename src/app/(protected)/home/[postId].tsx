import Button from "@/src/components/button";
import FullscreenLoader from "@/src/components/fullscreenLoader";
import PostCard from "@/src/components/postCard";
import TextArea from "@/src/components/textarea";
import {
  apiCreateReply,
  apiGetPostChildren,
  apiGetSinglePost,
} from "@/src/http/posts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";

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
  const [reply, setReply] = useState("");

  const queryClient = useQueryClient();

  const {
    data,
    isLoading: isPostLoading,
    isError,
  } = useQuery<Post>({
    queryKey: ["posts", id],
    queryFn: () => apiGetSinglePost(id),
  });

  const createReplyMutation = useMutation({
    mutationFn: apiCreateReply,
    onSuccess: () => {
      Alert.alert("Done.");
      queryClient.invalidateQueries({ queryKey: ["posts", id, "children"] });
      setReply("");
    },
    onError: () => {
      Alert.alert("Could not reply");
    },
  });

  if (isPostLoading) {
    return <FullscreenLoader />;
  }

  const handlePostReply = () => {
    if (reply.trim() === "") {
      return;
    }
    createReplyMutation.mutate({ content: reply.trim(), parentPostId: id });
  };

  const post = data!;
  return (
    <>
      <View
        style={{
          flex: 1,
          // backgroundColor: "red",
          padding: 16,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <PostCard
            post={{
              name: "Kishor Pokharel",
              content: post.content,
              createdAt: post.createdAt,
              isLiked: false,
              numberOfLikes: 12,
              numberOfComments: 12,
            }}
          />
          <View
            style={{ height: 1, backgroundColor: "#b3b3b3", marginBlock: 12 }}
          />

          <PostRepliesView postId={post.id} />
        </ScrollView>
      </View>

      <View style={{ padding: 16, flexDirection: "column", gap: 10 }}>
        <View>
          <TextArea
            onFocus={(e) => {
              // console.log(e)
            }}
            value={reply}
            onChangeText={setReply}
            height={72}
            placeholder="Reply..."
          />
        </View>
        {reply.trim() === "" ? null : (
          <Button
            label="Reply"
            disabled={reply.trim() === "" || createReplyMutation.isPending}
            loading={createReplyMutation.isPending}
            onPress={() => handlePostReply()}
          ></Button>
        )}
      </View>
    </>
  );
}

type PostRepliesViewProps = {
  postId: number;
};

function PostRepliesView({ postId }: PostRepliesViewProps) {
  const router = useRouter();

  const { data, isLoading } = useQuery<{ results: Post[] }>({
    queryKey: ["posts", postId, "children"],
    queryFn: () => apiGetPostChildren(postId),
  });

  if (isLoading) {
    return (
      <View
        style={{
          paddingBlock: 20,
        }}
      >
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  const posts = data?.results!;
  return (
    <View style={{ gap: 18 }}>
      {/* <Text>{JSON.stringify(posts)}</Text> */}
      {posts.map((post) => {
        return (
          <PostCard
            key={post.id}
            post={{
              // id: post.id,
              content: post.content,
              createdAt: post.createdAt,
              isLiked: false,
              name: "Kishor",
              numberOfLikes: 0,
              numberOfComments: 0,
            }}
            onShowMore={() => {
              router.push({
                pathname: "/home/[postId]",
                params: {
                  postId: post.id,
                },
              });
            }}
          />
        );
      })}
    </View>
  );
}
