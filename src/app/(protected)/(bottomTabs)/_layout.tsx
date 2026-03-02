import AppHeader from "@/src/components/appHeader";
import { useAuth } from "@/src/context/AuthContext";
import { useTheme } from "@/src/context/ThemeContext";
import { useUnreadNotificationCount } from "@/src/hooks/notifications";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs, useRouter } from "expo-router";

export default function Layout() {
  const router = useRouter();
  let { user } = useAuth();
  user = user!;

  const { data } = useUnreadNotificationCount();
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveBackgroundColor: theme.background,
        tabBarInactiveBackgroundColor: theme.background,
        tabBarActiveTintColor: "steelblue",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
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
          tabBarIcon: ({ color }) => {
            return <MaterialIcons color={color} size={28} name={"home"} />;
          },
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          title: "Add Post",
          headerShown: false,
          tabBarIcon: ({ color }) => {
            return <MaterialIcons color={color} size={28} name={"add-box"} />;
          },
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",

          headerShown: false,
          tabBarBadge: data?.count || undefined,
          tabBarIcon: ({ color }) => {
            return (
              <MaterialIcons color={color} size={28} name={"notifications"} />
            );
          },
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          href: null,
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ color }) => {
            return <MaterialIcons color={color} size={28} name={"settings"} />;
          },
        }}
      />
    </Tabs>
  );
}
