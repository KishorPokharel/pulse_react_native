import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
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
  onProfileClick?: () => void;
  onShowMore?: () => void;
  onLikeTap?: () => void;
};

export default function PostCard({ post, ...props }: PostCardProps) {
  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Pressable
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          onPress={props.onProfileClick}
        >
          <Avatar name={post.name} />
          <Text style={{ fontSize: 16 }}>{post.name}</Text>
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
        <Text style={{ fontSize: 18, marginBlockStart: 10 }}>
          {previewText(post.content, 150)}
        </Text>
      </Pressable>

      <View
        style={{
          flexDirection: "row",
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
            <Feather name="heart" size={24} color="black" />
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
          <AntDesign name="comment" size={24} color="black" />
          <Text style={{ fontSize: 18 }}>{post.numberOfComments}</Text>
        </Pressable>
      </View>
    </View>
  );
}
