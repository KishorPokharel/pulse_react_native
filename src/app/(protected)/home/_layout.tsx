import AppHeader from "@/src/components/appHeader";
import { useAuth } from "@/src/hooks/useAuth";
import { Stack, useRouter } from "expo-router";

export default function Layout() {
  const router = useRouter();
  let { user } = useAuth();
  user = user!;

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => (
            <AppHeader
              user={{ id: user.id, name: user.name }}
              onPressAvatar={() => {
                router.push({
                  pathname: "/user/[userId]",
                  params: { userId: user.id },
                });
              }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="[postId]"
        options={{ title: "Post", headerShown: true }}
      />
    </Stack>
  );
}
