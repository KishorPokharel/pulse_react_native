import AppHeader from "@/src/components/appHeader";
import { useAuth } from "@/src/hooks/useAuth";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs, useRouter } from "expo-router";

export default function Layout() {
  const router = useRouter();
  let { user } = useAuth();
  user = user!;

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: (props) => (
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
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => {
            return <MaterialIcons color={color} size={28} name={"home"} />;
          },
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          title: "Add Post",
          tabBarIcon: ({ color }) => {
            return <MaterialIcons color={color} size={28} name={"add-box"} />;
          },
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color }) => {
            return (
              <MaterialIcons color={color} size={28} name={"notifications"} />
            );
          },
        }}
      />
    </Tabs>
  );
}
