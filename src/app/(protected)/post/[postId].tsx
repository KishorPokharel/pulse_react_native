import Button from "@/src/components/button";
import FullscreenLoader from "@/src/components/fullscreenLoader";
import PostCard from "@/src/components/postCard";
import TextArea from "@/src/components/textarea";
import { useAuth } from "@/src/context/AuthContext";
import { useTheme } from "@/src/context/ThemeContext";
import {
  useCreateReply,
  usePost,
  usePostLikeUnlike,
  usePostReplies,
} from "@/src/hooks/posts";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type PostViewProps = {
  postId: number;
};

function PostView({ postId }: PostViewProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const { likedPostIds } = useAuth();

  const [reply, setReply] = useState("");

  const {
    data: postResponse,
    isLoading: isPostLoading,
    refetch: refetchPost,
  } = usePost(postId);

  const likeUnlikeMutation = usePostLikeUnlike();
  const createReplyMutation = useCreateReply({
    onSuccess: () => {
      setReply("");
    },
  });

  const handlePostReply = () => {
    const replyTrimmed = reply.trim();
    if (replyTrimmed === "") {
      return;
    }
    createReplyMutation.mutate({ content: replyTrimmed, parentPostId: postId });
  };

  if (isPostLoading) {
    return <FullscreenLoader />;
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
        likeBtnDisabled={
          likeUnlikeMutation.isPending &&
          likeUnlikeMutation.variables.postId === post.id
        }
        onLikeTap={() => {
          likeUnlikeMutation.mutate({ postId: post.id });
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
        />
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
  const { likedPostIds } = useAuth();

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

  const likeUnlikeMutation = usePostLikeUnlike();

  if (isPostLoading || isRepliesLoading) {
    return <FullscreenLoader />;
  }

  const replies = postRepliesResponse?.results || [];
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
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
            <View style={{ backgroundColor: theme.background }}>
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
            </View>
          }
          data={replies}
          keyExtractor={(post) => post.id + ""}
          stickyHeaderHiddenOnScroll={true}
          stickyHeaderIndices={[0]}
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
                likeBtnDisabled={
                  likeUnlikeMutation.isPending &&
                  likeUnlikeMutation.variables.postId === post.id
                }
                onLikeTap={() => {
                  likeUnlikeMutation.mutate({
                    postId: post.id,
                    parentPostId: postId,
                  });
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
    </KeyboardAvoidingView>
  );
}
