import Button from "@/src/components/button";
import FullscreenLoader from "@/src/components/fullscreenLoader";
import PostCard from "@/src/components/postCard";
import TextArea from "@/src/components/textarea";
import { useTheme } from "@/src/context/ThemeContext";
import {
  useCreateReply,
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

  const [reply, setReply] = useState("");

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
    createReplyMutation.mutate({
      content: replyTrimmed,
      parentPostId: postId,
    });
  };

  return (
    <View style={{ paddingTop: 16 }}>
      <PostCard
        postId={postId}
        isPreview={false}
        canShowMore={false}
        likeBtnDisabled={
          likeUnlikeMutation.isPending &&
          likeUnlikeMutation.variables.postId === postId
        }
        onLikeTap={() => {
          likeUnlikeMutation.mutate({ postId: postId });
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

  const {
    data: repliesIdsData,
    isLoading: isRepliesLoading,
    refetch: refetchReplies,
    isRefetching: isRefetchingReplies,
  } = usePostReplies(postId);

  const refetch = () => {
    refetchReplies();
  };

  const likeUnlikeMutation = usePostLikeUnlike();

  const repliesIds = repliesIdsData || [];
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
          onRefresh={refetch}
          refreshing={isRefetchingReplies}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: "#e9e9e97c" }} />
          )}
          ListHeaderComponent={
            <View style={{ backgroundColor: theme.background }}>
              <PostView postId={postId} />
              {repliesIds.length > 0 ? (
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
          data={repliesIds}
          keyExtractor={(postId) => `posts-replies-${postId}`}
          stickyHeaderHiddenOnScroll={true}
          stickyHeaderIndices={[0]}
          ListEmptyComponent={isRepliesLoading ? <FullscreenLoader /> : null}
          renderItem={({ item: replyId }) => (
            <View style={{ paddingBlock: 12 }}>
              <PostCard
                postId={replyId}
                isPreview={true}
                likeBtnDisabled={
                  likeUnlikeMutation.isPending &&
                  likeUnlikeMutation.variables.postId === replyId
                }
                onLikeTap={() => {
                  likeUnlikeMutation.mutate({
                    postId: replyId,
                    parentPostId: postId,
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
