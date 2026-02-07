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
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";

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
  likesCount: number;
  repliesCount: number;
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
          backgroundColor: "white",
          padding: 16,
          paddingBottom: 0,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <PostCard
            post={{
              name: "Kishor Pokharel",
              content: post.content,
              createdAt: post.createdAt,
              isLiked: false,
              numberOfLikes: post.likesCount,
              numberOfComments: post.repliesCount,
            }}
          />
          <View
            style={{ height: 1, backgroundColor: "#e0e0e0", marginBlock: 12 }}
          />

          {/* Reply Box Section */}
          <View
            style={{
              backgroundColor: "white",
            }}
          >
            <View
              style={{
                gap: 16,
              }}
            >
              <TextArea
                onFocus={(e) => {
                  // console.log(e)
                }}
                value={reply}
                onChangeText={setReply}
                height={72}
                placeholder="Reply..."
              />
              <Button
                label="Reply"
                disabled={reply.trim() === "" || createReplyMutation.isPending}
                loading={createReplyMutation.isPending}
                onPress={() => handlePostReply()}
              ></Button>
            </View>
          </View>
          {/* End Reply Section */}
          <View
            style={{ height: 1, backgroundColor: "#e0e0e0", marginBlock: 12 }}
          />
          <PostRepliesView postId={post.id} />
        </ScrollView>
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
    <View style={{ gap: 20 }}>
      <Text style={{ fontSize: 18 }}>Relevant Replies</Text>
      <View>
        {posts.map((post, idx) => {
          return (
            <View key={post.id}>
              <PostCard
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
              {idx === posts.length - 1 ? null : (
                <View
                  style={{
                    height: 1,
                    backgroundColor: "#e0e0e0",
                    marginBlock: 12,
                  }}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
