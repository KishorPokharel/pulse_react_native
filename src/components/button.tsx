import { ActivityIndicator, Pressable, Text } from "react-native";

type ButtonProps = {
  label: string;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
};

export default function Button(props: ButtonProps) {
  return (
    <Pressable
      style={{
        backgroundColor: "#333",
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
        <ActivityIndicator size="small" />
      ) : (
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          {props.label}
        </Text>
      )}
    </Pressable>
  );
}
