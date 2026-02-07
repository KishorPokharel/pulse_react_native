import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";
import { formatDate, previewText } from "../utils";
import Avatar from "./avatar";

type PostCardProps = {
  post: {
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
  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Pressable
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          onPress={props.onProfileClick}
        >
          <Avatar name={post.name} />
          <Text style={{ fontSize: 16, color: "#000000d3" }}>{post.name}</Text>
        </Pressable>
        <Text style={{ fontSize: 12 }}>
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
          style={{ fontSize: 18, marginBlockStart: 10, color: "#000000d3" }}
        >
          {isPreview ? previewText(post.content, 150) : post.content}
        </Text>
      </Pressable>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 18,
          paddingBlockStart: 10,
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
            <AntDesign name="heart" size={24} color={"#f43f5e"} />
          ) : (
            <Feather name="heart" size={24} color="#000000b8" />
          )}
          <Text style={{ fontSize: 18 }}>{post.numberOfLikes}</Text>
        </Pressable>
        <Pressable
          onPress={props.onShowMore}
          style={{
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
          }}
        >
          <AntDesign name="comment" size={24} color="#000000b8" />
          <Text style={{ fontSize: 18 }}>{post.numberOfComments}</Text>
        </Pressable>
        <Pressable
          onPress={() => {}}
          style={{
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
          }}
        >
          <Feather name="share" size={24} color="#000000b8" />
        </Pressable>
        <Pressable
          onPress={() => {}}
          style={{
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
          }}
        >
          <Ionicons name="ellipsis-vertical" size={24} color="#000000b8" />
        </Pressable>
      </View>
    </View>
  );
}
