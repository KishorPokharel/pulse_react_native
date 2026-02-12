import { Text, TextInput, TextInputProps, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

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
  const { theme } = useTheme();
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
          color: theme.text,
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
