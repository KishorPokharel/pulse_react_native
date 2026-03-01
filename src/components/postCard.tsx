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
import { useDeletePost } from "../hooks/posts";
import { formatDate, previewText } from "../utils";
import Avatar from "./avatar";
import { SpinningHeart } from "./spinningHeart";

type PostCardProps = {
  post: {
    id: number;
    author: {
      id: number;
      name: string;
    };
    parentPostId: number | null;
    content: string;
    createdAt: string;
    numberOfLikes: number;
    numberOfComments: number;
    isLiked: boolean;
    saved?: boolean;
  };
  isPreview?: boolean;
  likeBtnDisabled?: boolean;
  onProfileClick?: () => void;
  onShowMore?: () => void;
  onLikeTap?: () => void;
};

export default function PostCard({
  post,
  isPreview = true,
  ...props
}: PostCardProps) {
  const { user } = useAuth();

  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { showActionSheetWithOptions } = useActionSheet();
  const router = useRouter();
  const deletePostMutation = useDeletePost();

  const authUser = user!;
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
          onPress={props.onProfileClick}
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
            const options: string[] = [];

            if (post.saved) {
              options.push("Unsave");
            } else {
              options.push("Save post");
            }
            if (post.parentPostId) {
              options.push("Go to parent post");
            }
            if (post.author.id === authUser.id) {
              options.push("Delete");
            }
            options.push("Copy post text");
            options.push("Report");
            options.push("Cancel");
            const cancelButtonIndex = options.length - 1;

            showActionSheetWithOptions(
              {
                options,
                cancelButtonIndex,
                containerStyle: {
                  paddingBottom: insets.bottom,
                  backgroundColor: theme.background,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                },
                textStyle: {
                  color: theme.text,
                },
              },
              (selectedIndex) => {
                if (selectedIndex === undefined) {
                  return;
                }

                const option = options[selectedIndex];
                if (option === "Save post") {
                  Alert.alert("Saving not implemented.");
                } else if (option === "Unsave") {
                  Alert.alert("Unsave not implemented.");
                } else if (option === "Delete") {
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
                } else if (option === "Copy post text") {
                  (async function () {
                    await Clipboard.setStringAsync(post.content);
                  })();
                  Alert.alert("Copied", "Post text copied to clipboard.");
                } else if (option === "Report") {
                  Alert.alert("Reporting not implemented.");
                } else if (option === "Go to parent post") {
                  if (post.parentPostId) {
                    router.push({
                      pathname: "/post/[postId]",
                      params: { postId: post.parentPostId },
                    });
                  }
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

      <Pressable
        onPress={() => {
          props.onShowMore?.();
        }}
      >
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
          ) : post.isLiked ? (
            <AntDesign name="heart" size={20} color={"#f43f5e"} />
          ) : (
            <Feather name="heart" size={20} color={theme.text} />
          )}
          <Text style={{ fontSize: 16, color: theme.text }}>
            {post.numberOfLikes}
          </Text>
        </Pressable>
        <Pressable
          onPress={props.onShowMore}
          style={{
            flexDirection: "row",
            gap: 6,
            alignItems: "center",
          }}
        >
          <AntDesign name="comment" size={20} color={theme.text} />
          <Text style={{ fontSize: 16, color: theme.text }}>
            {post.numberOfComments}
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
        {/* <Pressable
          onPress={() => {
            alert("Not implemented");
          }}
          style={{
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
          }}
        >
          <Ionicons name="ellipsis-vertical" size={20} color={theme.text} />
        </Pressable> */}
      </View>
    </View>
  );
}
