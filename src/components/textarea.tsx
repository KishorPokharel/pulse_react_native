import { Text, TextInput, TextInputProps, View } from "react-native";

type InputProps = {
  value: string;
  error?: string;
} & TextInputProps;

export default function TextArea({ value, error, ...props }: InputProps) {
  return (
    <View>
      <TextInput
        multiline
        numberOfLines={10}
        value={value}
        style={{
          borderWidth: 1,
          borderColor: "#333",
          borderRadius: 12,
          padding: 8,
          height: 150,
          textAlignVertical: "top",
        }}
        {...props}
      />
      {error ? (
        <Text style={{ fontSize: 16, marginBlockStart: 6, color: "red" }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
