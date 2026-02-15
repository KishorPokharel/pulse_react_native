import { Text, View } from "react-native";
import { getAvatarColor } from "../utils";

type AvatarProps = {
  id: number;
  name: string;
  size?: number;
};

export default function Avatar({ id, name, size = 32 }: AvatarProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: "100%",
        backgroundColor: getAvatarColor(id),
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontWeight: "bold" }}>{name[0]}</Text>
    </View>
  );
}
