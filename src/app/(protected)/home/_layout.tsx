import AppHeader from "@/src/components/appHeader";
import { useAuth } from "@/src/hooks/useAuth";
import { Stack } from "expo-router";

export default function Layout() {
  const { user } = useAuth();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ header: () => <AppHeader name={user?.name || ""} /> }}
      />
      <Stack.Screen
        name="[postId]"
        options={{ title: "Post", headerShown: true }}
      />
    </Stack>
  );
}
