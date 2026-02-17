import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="[userId]/index" options={{ title: "User Profile" }} />
      <Stack.Screen name="edit" options={{ title: "Edit Your Profile" }} />
      <Stack.Screen
        name="[userId]/followers"
        options={{ title: "Followers" }}
      />
      <Stack.Screen
        name="[userId]/following"
        options={{ title: "Following" }}
      />
    </Stack>
  );
}
