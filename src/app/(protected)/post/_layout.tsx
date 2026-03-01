import { useTheme } from "@/src/context/ThemeContext";
import { Stack } from "expo-router";

export default function Layout() {
  const { theme } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTitleStyle: { color: theme.text },
        headerTintColor: theme.text,
      }}
    >
      <Stack.Screen name="[postId]" options={{ title: "Post" }} />
    </Stack>
  );
}
