import { Text, TextInput, TextInputProps, View } from "react-native";

type InputProps = {
  value: string;
  height?: number;
  error?: string;
} & TextInputProps;

export default function TextArea({
  value,
  height = 150,
  error,
  ...props
}: InputProps) {
  return (
    <View>
      <TextInput
        multiline
        value={value}
        style={{
          borderWidth: 1,
          borderColor: "#cdcdcd",
          borderRadius: 12,
          padding: 8,
          height: height,
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
