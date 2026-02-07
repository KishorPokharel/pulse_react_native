import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function Screen() {
  const params = useLocalSearchParams();
  
  return (
    <View>
      <Text>{JSON.stringify(params)}</Text>
    </View>
  );
}
