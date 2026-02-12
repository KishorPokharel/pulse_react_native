import { Text, TextProps } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function MyText({ children, style, ...props }: TextProps) {
  const { theme } = useTheme();
  return (
    <Text
      style={[
        {
          color: theme.text,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}
