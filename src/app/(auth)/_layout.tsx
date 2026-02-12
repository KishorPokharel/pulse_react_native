import { useTheme } from "@/src/context/ThemeContext";
import { Stack } from "expo-router";

export default function Layout() {
  const { theme } = useTheme();
  return (
    <Stack
      screenOptions={{
        // animation: "none",
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
