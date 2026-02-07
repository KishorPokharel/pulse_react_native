import { Text, TextInput, TextInputProps, View } from "react-native";

type InputProps = {
  value: string;
  label?: string;
  error?: string;
} & TextInputProps;

export default function Input({ label, value, error, ...props }: InputProps) {
  return (
    <View>
      {label ? (
        <Text style={{ fontSize: 16, marginBlockEnd: 6 }}>{label}</Text>
      ) : null}
      <TextInput
        value={value}
        style={{
          borderWidth: 1,
          borderColor: "#e0e0e0",
          borderRadius: 12,
          padding: 8,
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
