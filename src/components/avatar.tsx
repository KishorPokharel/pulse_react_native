import { Text, View } from "react-native";

type AvatarProps = {
  name: string;
  size?: number;
};

export default function Avatar({ name, size = 32 }: AvatarProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: "100%",
        backgroundColor: "steelblue",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontWeight: "bold" }}>{name[0]}</Text>
    </View>
  );
}
