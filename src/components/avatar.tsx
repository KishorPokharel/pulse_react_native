import { Text, View } from "react-native";

type AvatarProps = {
  name: string;
};

export default function Avatar({ name }: AvatarProps) {
  return (
    <View
      style={{
        width: 32,
        height: 32,
        borderRadius: 100,
        backgroundColor: "steelblue",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontWeight: "bold" }}>{name[0]}</Text>
    </View>
  );
}
