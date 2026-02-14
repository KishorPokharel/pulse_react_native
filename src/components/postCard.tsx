import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { formatDate, previewText } from "../utils";
import Avatar from "./avatar";

type PostCardProps = {
  post: {
    id: number;
    name: string;
    content: string;
    createdAt: string;
    numberOfLikes: number;
    numberOfComments: number;
    isLiked: boolean;
  };
  isPreview?: boolean;
  onProfileClick?: () => void;
  onShowMore?: () => void;
  onLikeTap?: () => void;
};

export default function PostCard({
  post,
  isPreview = true,
  ...props
}: PostCardProps) {
  const { theme } = useTheme();

  return (
    <View style={{ backgroundColor: theme.background }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          onPress={props.onProfileClick}
        >
          <Avatar name={post.name} />
          <Text style={{ fontSize: 16, color: theme.text }}>{post.name}</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 12, color: theme.text }}>
          {" • "}
          {formatDate(post.createdAt)}
        </Text>
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
          style={{
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
          }}
        >
          {post.isLiked ? (
            <AntDesign name="heart" size={20} color={"#f43f5e"} />
          ) : (
            <Feather name="heart" size={20} color={theme.text} />
          )}
          <Text style={{ fontSize: 18, color: theme.text }}>
            {post.numberOfLikes}
          </Text>
        </Pressable>
        <Pressable
          onPress={props.onShowMore}
          style={{
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
          }}
        >
          <AntDesign name="comment" size={20} color={theme.text} />
          <Text style={{ fontSize: 18, color: theme.text }}>
            {post.numberOfComments}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            alert("Not implemented");
          }}
          style={{
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
          }}
        >
          <Feather name="share" size={20} color={theme.text} />
        </Pressable>
        <Pressable
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
        </Pressable>
      </View>
    </View>
  );
}
