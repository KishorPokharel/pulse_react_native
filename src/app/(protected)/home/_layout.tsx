import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="[postId]"
        options={{ title: "Post", headerShown: true }}
      />
    </Stack>
  );
}
