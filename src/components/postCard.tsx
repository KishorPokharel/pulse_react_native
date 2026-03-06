import { useActionSheet } from "@expo/react-native-action-sheet";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import {
  Alert,
  Pressable,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WEB_FRONTEND_URL } from "../constants";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useDeletePost, usePost } from "../hooks/posts";
import { formatDate, previewText } from "../utils";
import Avatar from "./avatar";
import FullscreenLoader from "./fullscreenLoader";
import { SpinningHeart } from "./spinningHeart";

type PostCardProps = {
  postId: number;
  isPreview?: boolean;
  likeBtnDisabled?: boolean;
  canShowMore?: boolean;
  onLikeTap?: () => void;
};

export default function PostCard({
  postId,
  isPreview = true,
  canShowMore = true,
  ...props
}: PostCardProps) {
  const { user, likedPostIds, setLikedPostIds } = useAuth();

  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { showActionSheetWithOptions } = useActionSheet();
  const router = useRouter();
  const { data: postData, isLoading: isPostLoading } = usePost(postId);
  const deletePostMutation = useDeletePost();

  if (isPostLoading) {
    return <FullscreenLoader />;
  }

  function handleShowProfile(): void {
    router.push({
      pathname: "/user/[userId]",
      params: { userId: post.author.id },
    });
  }

  function handleShowMore(postId: number) {
    if (!canShowMore) {
      return;
    }
    router.push({
      pathname: "/post/[postId]",
      params: { postId: postId },
    });
  }

  const authUser = user!;
  const post = postData!;

  return (
    <View style={{ backgroundColor: theme.background }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          onPress={handleShowProfile}
        >
          <Avatar id={post.author.id} name={post.author.name} />
          <View>
            <Text
              style={{ fontSize: 14, color: theme.text, fontWeight: "bold" }}
            >
              {post.author.name}
            </Text>
            <Text style={{ fontSize: 10, color: theme.text }}>
              {formatDate(post.createdAt)}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            type OptionId =
              | "unsave"
              | "save"
              | "go-to-parent"
              | "delete"
              | "copy"
              | "report"
              | "cancel";

            const myOptions: { id: OptionId; label: string; shown: boolean }[] =
              [
                {
                  id: "unsave",
                  label: "Unsave",
                  // shown: post.saved ? true : false,
                  shown: true,
                },
                {
                  id: "save",
                  label: "Save Post",
                  // shown: post.saved ? false : true,
                  shown: true,
                },
                {
                  id: "go-to-parent",
                  label: "Go to parent post",
                  shown: post.parentPostId != null,
                },
                {
                  id: "delete",
                  label: "Delete",
                  shown: post.author.id === authUser.id,
                },
                { id: "copy", label: "Copy post text", shown: true },
                {
                  id: "report",
                  label: "Report",
                  shown: post.author.id != authUser.id,
                },
                { id: "cancel", label: "Cancel", shown: true },
              ];
            const shownOptions = myOptions.filter((option) => option.shown);
            const cancelOptionIndex = shownOptions.findIndex(
              (option) => option.id === "cancel",
            );
            const options = shownOptions.map((option) => option.label);

            showActionSheetWithOptions(
              {
                options,
                cancelButtonIndex: cancelOptionIndex,
                containerStyle: {
                  paddingInline: 12,
                  paddingBottom: insets.bottom,
                  backgroundColor: theme.background,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                },
                showSeparators: true,
                textStyle: {
                  color: theme.text,
                },
              },
              (selectedIndex) => {
                if (selectedIndex === undefined) {
                  return;
                }

                const { id: optionId } = shownOptions[selectedIndex];
                if (optionId === "save") {
                  Alert.alert("Saving not implemented.");
                  return;
                }

                if (optionId === "unsave") {
                  Alert.alert("Unsave not implemented.");
                  return;
                }

                if (optionId === "delete") {
                  Alert.alert("Are you sure?", "", [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => {
                        if (
                          !deletePostMutation.isPending &&
                          deletePostMutation.variables?.postId != post.id
                        ) {
                          deletePostMutation.mutate({
                            postId: post.id,
                            parentPostId: post.parentPostId,
                          });
                        }
                      },
                    },
                  ]);
                  return;
                }

                if (optionId === "copy") {
                  (async function () {
                    await Clipboard.setStringAsync(post.content);
                  })();
                  Alert.alert("Copied", "Post text copied to clipboard.");
                  return;
                }

                if (optionId === "report") {
                  Alert.alert("Reporting not implemented.");
                  return;
                }

                if (optionId === "go-to-parent") {
                  if (post.parentPostId) {
                    router.push({
                      pathname: "/post/[postId]",
                      params: { postId: post.parentPostId },
                    });
                  }
                  return;
                }
              },
            );
          }}
        >
          <View
            style={{
              paddingBlockEnd: 8,
              paddingInlineStart: 8,
              borderWidth: 0,
            }}
          >
            <Ionicons name="ellipsis-vertical" size={20} color={theme.text} />
          </View>
        </TouchableOpacity>
      </View>

      <Pressable onPress={() => handleShowMore(post.id)}>
        <Text
          style={{
            fontSize: 16,
            marginBlockStart: 10,
            color: theme.text,
            lineHeight: 16 * 1.5,
          }}
        >
          {isPreview ? previewText(post.content, 350) : post.content}
        </Text>
      </Pressable>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 18,
          paddingBlockStart: 16,
        }}
      >
        <Pressable
          onPress={props.onLikeTap}
          disabled={props.likeBtnDisabled}
          style={{
            flexDirection: "row",
            gap: 6,
            alignItems: "center",
          }}
        >
          {props.likeBtnDisabled ? (
            <SpinningHeart color="#f43f5e" isSpinning={true} />
          ) : likedPostIds.includes(post.id) ? (
            <AntDesign name="heart" size={20} color={"#f43f5e"} />
          ) : (
            <Feather name="heart" size={20} color={theme.text} />
          )}
          <Text style={{ fontSize: 16, color: theme.text }}>
            {post.likesCount}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => handleShowMore(post.id)}
          style={{
            flexDirection: "row",
            gap: 6,
            alignItems: "center",
          }}
        >
          <AntDesign name="comment" size={20} color={theme.text} />
          <Text style={{ fontSize: 16, color: theme.text }}>
            {post.repliesCount}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            Share.share({ message: `${WEB_FRONTEND_URL}/posts/${post.id}` });
          }}
          style={{
            flexDirection: "row",
            gap: 6,
            alignItems: "center",
          }}
        >
          <Feather name="share" size={20} color={theme.text} />
          <Text style={{ fontSize: 16, color: theme.text }}>Share</Text>
        </Pressable>
      </View>
    </View>
  );
}
