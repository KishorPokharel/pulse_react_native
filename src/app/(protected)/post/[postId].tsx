import Button from "@/src/components/button";
import FullscreenLoader from "@/src/components/fullscreenLoader";
import PostCard from "@/src/components/postCard";
import PostCardSkeleton from "@/src/components/postCardSkeleton";
import TextArea from "@/src/components/textarea";
import { useAuth } from "@/src/context/AuthContext";
import { useTheme } from "@/src/context/ThemeContext";
import { usePost, usePostReplies } from "@/src/hooks/posts";
import { apiCreateReply, apiLikeUnlikePost } from "@/src/http/posts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type PostViewProps = {
  postId: number;
};

function PostView({ postId }: PostViewProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const { likedPostIds, setLikedPostIds } = useAuth();

  const [reply, setReply] = useState("");

  const {
    data: postResponse,
    isLoading: isPostLoading,
    refetch: refetchPost,
  } = usePost(postId);

  const queryClient = useQueryClient();
  const tapLikeMutation = useMutation({
    mutationFn: apiLikeUnlikePost,
    onSuccess: (data) => {
      if (data.liked) {
        setLikedPostIds([...likedPostIds, data.postId]);
      } else {
        setLikedPostIds((prev) => prev.filter((id) => id !== data.postId));
      }
      queryClient.invalidateQueries({ queryKey: ["posts", postId] });
    },
    onError: () => {
      alert("Something went wrong");
    },
  });

  const createReplyMutation = useMutation({
    mutationFn: apiCreateReply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", postId] });
      queryClient.invalidateQueries({
        queryKey: ["posts", postId, "children"],
      });
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
    createReplyMutation.mutate({ content: reply.trim(), parentPostId: postId });
  };

  if (isPostLoading) {
    return <PostCardSkeleton />;
  }

  const post = postResponse!;
  return (
    <View style={{ paddingTop: 16 }}>
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
    </View>
  );
}

export default function Screen() {
  const params = useLocalSearchParams<{ postId: string }>();
  const postId = +params.postId;

  const router = useRouter();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { likedPostIds, setLikedPostIds } = useAuth();

  const {
    data: postResponse,
    isLoading: isPostLoading,
    refetch: refetchPost,
  } = usePost(postId);

  const {
    data: postRepliesResponse,
    isLoading: isRepliesLoading,
    refetch: refetchReplies,
    isRefetching: isRefetchingReplies,
  } = usePostReplies(postId);

  const queryClient = useQueryClient();
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

  if (isPostLoading || isRepliesLoading) {
    return <FullscreenLoader />;
  }

  const replies = postRepliesResponse?.results || [];
  return (
    <View
      style={{
        flex: 1,
        paddingInline: 16,
        paddingBottom: insets.bottom,
        backgroundColor: theme.background,
      }}
    >
      <FlatList
        onRefresh={refetchReplies}
        refreshing={isRefetchingReplies}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: "#e9e9e97c" }} />
        )}
        ListHeaderComponent={
          <>
            <PostView postId={postId} />
            {replies.length > 0 ? (
              <Text
                style={{
                  paddingBlock: 8,
                  fontWeight: "bold",
                  color: theme.text,
                }}
              >
                Relevant Replies
              </Text>
            ) : null}
          </>
        }
        data={replies}
        keyExtractor={(post) => post.id + ""}
        renderItem={({ item: post }) => (
          <View style={{ paddingBlock: 12 }}>
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
              isPreview={true}
              onLikeTap={() => {
                tapLikeMutation.mutate(post.id);
              }}
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
      />
    </View>
  );
}
