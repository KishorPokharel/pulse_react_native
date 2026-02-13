import Button from "@/src/components/button";
import FullscreenLoader from "@/src/components/fullscreenLoader";
import PostCard from "@/src/components/postCard";
import TextArea from "@/src/components/textarea";
import { useTheme } from "@/src/context/ThemeContext";
import { useAuth } from "@/src/hooks/useAuth";
import {
  apiCreateReply,
  apiGetPostChildren,
  apiGetSinglePost,
  apiLikeUnlikePost,
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
  userId: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    name: string;
  };
  likesCount: number;
  repliesCount: number;
};

export function FullPostView({ id }: FullPostViewProps) {
  const [reply, setReply] = useState("");

  const { likedPostIds, setLikedPostIds } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { theme } = useTheme();
  const {
    data,
    isLoading: isPostLoading,
    isError,
  } = useQuery<Post>({
    queryKey: ["posts", id],
    queryFn: () => apiGetSinglePost(id),
  });

  const tapLikeMutation = useMutation({
    mutationFn: apiLikeUnlikePost,
    onSuccess: (data) => {
      if (data.liked) {
        setLikedPostIds([...likedPostIds, data.postId]);
      } else {
        setLikedPostIds((prev) => prev.filter((id) => id !== data.postId));
      }
      queryClient.invalidateQueries({ queryKey: ["posts", id] });
    },
    onError: () => {
      alert("Something went wrong");
    },
  });

  const createReplyMutation = useMutation({
    mutationFn: apiCreateReply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", id] });
      queryClient.invalidateQueries({ queryKey: ["posts", id, "children"] });
      setReply("");
    },
    onError: () => {
      Alert.alert("Could not reply");
    },
  });

  const handlePostReply = () => {
    if (reply.trim() === "") {
      return;
    }
    createReplyMutation.mutate({ content: reply.trim(), parentPostId: id });
  };

  if (isPostLoading) {
    return <FullscreenLoader />;
  }

  const post = data!;
  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.background,
          padding: 16,
          paddingBlock: 8,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <PostCard
            post={{
              id: post.id,
              name: post.author.name,
              content: post.content,
              createdAt: post.createdAt,
              isLiked: likedPostIds.includes(post.id),
              numberOfLikes: post.likesCount,
              numberOfComments: post.repliesCount,
            }}
            isPreview={false}
            onLikeTap={() => {
              tapLikeMutation.mutate(post.id);
            }}
            onProfileClick={() => {
              router.push({
                pathname: "/user/[userId]",
                params: { userId: post.userId },
              });
            }}
          />
          <View
            style={{ height: 1, backgroundColor: "#e0e0e0", marginBlock: 12 }}
          />

          {/* Reply Box Section */}
          <View
            style={{
              backgroundColor: theme.background,
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
                placeholderTextColor={theme.text}
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

  const { likedPostIds, setLikedPostIds } = useAuth();

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["posts", postId, "children"],
    queryFn: () => apiGetPostChildren(postId),
  });

  const tapLikeMutation = useMutation({
    mutationFn: apiLikeUnlikePost,
    onSuccess: (data) => {
      if (data.liked) {
        setLikedPostIds([...likedPostIds, data.postId]);
      } else {
        setLikedPostIds((prev) => prev.filter((id) => id !== data.postId));
      }
      queryClient.invalidateQueries({
        queryKey: ["posts", postId, "children"],
      });
    },
    onError: () => {
      alert("Something went wrong");
    },
  });

  const { theme } = useTheme();

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
    <View style={{ gap: 20, backgroundColor: theme.background }}>
      {posts.length > 0 ? (
        <Text style={{ fontSize: 18, color: theme.text }}>
          Relevant Replies
        </Text>
      ) : null}
      <View>
        {posts.map((post, idx) => {
          return (
            <View key={post.id}>
              <PostCard
                post={{
                  id: post.id,
                  content: post.content,
                  createdAt: post.createdAt,
                  isLiked: likedPostIds.includes(post.id),
                  name: post.author.name,
                  numberOfLikes: post.likesCount,
                  numberOfComments: post.repliesCount,
                }}
                isPreview={true}
                onLikeTap={() => {
                  tapLikeMutation.mutate(post.id);
                }}
                onProfileClick={() => {
                  router.push({
                    pathname: "/user/[userId]",
                    params: { userId: post.userId },
                  });
                }}
                onShowMore={() => {
                  router.push({
                    pathname: "/post/[postId]",
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
