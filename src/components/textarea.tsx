import { Text, TextInput, TextInputProps, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

type TextAreaProps = {
  label?: string;
  value: string;
  height?: number;
  error?: string;
} & TextInputProps;

export default function TextArea({
  label = "",
  value,
  height = 150,
  error,
  ...props
}: TextAreaProps) {
  const { theme } = useTheme();
  return (
    <View>
      {label ? (
        <Text style={{ fontSize: 16, marginBlockEnd: 6, color: theme.text }}>
          {label}
        </Text>
      ) : null}
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
        placeholderTextColor={theme.text}
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
