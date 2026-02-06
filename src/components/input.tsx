import { Text, TextInput, View } from "react-native";

type InputProps = {
  label: string;
};

export default function Input(props: InputProps) {
  return (
    <View>
      <Text style={{ fontSize: 16, marginBlockEnd: 6 }}>{props.label}</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#333",
          borderRadius: 12,
        }}
      />
    </View>
  );
}
