import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="[userId]" options={{ title: "User Profile" }} />
      <Stack.Screen name="edit" options={{ title: "Edit Your Profile" }} />
    </Stack>
  );
}
