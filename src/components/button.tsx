import { ActivityIndicator, Pressable, Text } from "react-native";
import { useTheme } from "../context/ThemeContext";

type ButtonProps = {
  label: string;
  disabled?: boolean;
  loading?: boolean;
  type?: "primary" | "secondary";
  onPress: () => void;
};

export default function Button({ type = "primary", ...props }: ButtonProps) {
  const { theme } = useTheme();
  return (
    <Pressable
      style={{
        backgroundColor: type === "primary" ? "#333" : "transparent",
        borderWidth: 1,
        borderColor: props.disabled ? "rgba(51, 51 , 51, 0.5)" : "#333333",
        paddingBlock: 12,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        opacity: props.disabled ? 0.5 : 1,
      }}
      onPress={props.onPress}
      disabled={props.disabled}
    >
      {props.loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Text
          style={{
            color: type === "primary" ? "white" : theme.text,
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          {props.label}
        </Text>
      )}
    </Pressable>
  );
}
