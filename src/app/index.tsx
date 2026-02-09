import Octicons from "@expo/vector-icons/Octicons";
import { Text, View } from "react-native";

export default function Screen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Octicons name="pulse" size={36} color="black" />
        <Text style={{ fontSize: 24 }}>Pulse</Text>
      </View>
    </View>
  );
}
